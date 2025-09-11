import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { geoCentroid } from 'd3-geo';

type CountrySkill = { country: string; code: string; region?: string; uniqueSkills: number; skillSupply: number };

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;

  private nameToCode = new Map<string, string>();
  private codeToRegion = new Map<string, string>();
  private codeToMetrics = new Map<string, { uniqueSkills: number; skillSupply: number }>();

  // pleasant, readable region colors
  private regionColor = (r?: string) => ({
    'North America': '#98d6ff',
    'Latin America': '#9be7c4',
    'Europe': '#ffd58a',
    'Sub-Saharan Africa': '#f4a4a4',
    'Middle East & N. Africa': '#c7b7ff',
    'South Asia': '#b0e0b0',
    'East Asia & Pacific': '#8fd3ff',
    'Oceania': '#b7f0ff'
  } as Record<string, string>)[r || ''] || '#a8d5a2';

  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, host.offsetWidth / host.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // 🌍 Figma-like globe
    this.globe = new Globe().showGlobe(true).showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);      // soft halo
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: 0x70c7d9 }));  // ocean

    // Countries geometry
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // We’ll color polygons later (after we load your metrics/regions)
    this.globe
      .polygonsData(this.countries.features)
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => '#ffffff')
      .onPolygonClick((feat: any) => {
        const [lng, lat] = geoCentroid(feat) as [number, number];
        this.globe.pointOfView({ lat, lng, altitude: 1.8 }, 1000);
      })
      .polygonLabel((feat: any) => {
        const name = feat.properties.name as string;
        const code = this.nameToCode.get(name) ?? '';
        const m = code ? this.codeToMetrics.get(code) : undefined;
        return `
          <div style="font-size:12px;padding:6px 8px">
            <b>${name}${code ? ` (${code})` : ''}</b><br/>
            Unique Skills: ${m?.uniqueSkills ?? 0}<br/>
            Skill Supply (FTE): ${m?.skillSupply ?? 0}
          </div>`;
      });

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Load your countries/regions/metrics JSON
    // Expected shape:
    // { countries: [{ name, code, region, uniqueSkills, skillSupply }, ...] }
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];

      // build helper maps
      for (const c of this.countriesList) {
        this.nameToCode.set(c.country, c.code);
        if (c.region) this.codeToRegion.set(c.code, c.region);
        this.codeToMetrics.set(c.code, { uniqueSkills: c.uniqueSkills, skillSupply: c.skillSupply });
      }

      // Color countries by region
      this.globe.polygonCapColor((feat: any) => {
        const code = this.nameToCode.get(feat.properties.name as string);
        const region = code ? this.codeToRegion.get(code) : undefined;
        return this.regionColor(region);
      });

      // 🏷️ Country-code labels at centroids
      const labelData = this.countries.features
        .map((f: any) => {
          const code = this.nameToCode.get(f.properties.name as string);
          if (!code) return null;
          const [lng, lat] = geoCentroid(f) as [number, number];
          return { code, lat, lng };
        })
        .filter(Boolean) as { code: string; lat: number; lng: number }[];

      this.globe
        .labelsData(labelData)
        .labelText((d: any) => d.code)       // << show ISO code
        .labelLat((d: any) => d.lat)
        .labelLng((d: any) => d.lng)
        .labelAltitude(0.01)
        .labelSize(0.9)
        .labelDotRadius(0.15)
        .labelColor(() => 'rgba(0,0,0,0.85)')
        .labelResolution(2);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(c =>
          c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        );
  }

  zoomIn() { this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min); this.updateCameraZoom(); }
  zoomOut() { this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max); this.updateCameraZoom(); }
  private updateCameraZoom() { if (this.controls.object) this.controls.object.position.z = this.currentZoom; }
}
