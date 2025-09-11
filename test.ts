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

type CountrySkill = { country: string; code: string; uniqueSkills: number; skillSupply: number };

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

  // 🎨 Pick your colors here (hex/rgb/number all OK)
  private oceanColor: string | number = '#0b2a4d';  // deep blue for water
  private landColor:  string | number = '#a8d5a2';  // soft green for land
  // If you want borders later: set to '#ffffff' and uncomment the stroke line below
  private borderColor: string = 'rgba(0,0,0,0)';

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    // Make colors accurate across devices
    if ('outputColorSpace' in renderer) {
      (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace;
    } else {
      (renderer as any).outputEncoding = (THREE as any).sRGBEncoding;
    }
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, host.offsetWidth / host.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // 🌍 Plain globe (no texture), with your ocean color
    this.globe = new Globe().showGlobe(true).showGraticules(false).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: this.oceanColor as any }));

    // Countries geometry
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Land = your color, no borders
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => this.landColor as any)
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      // .polygonStrokeColor(() => this.borderColor) // ← uncomment for borders
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')     // no borders
      .polygonAltitude(0);                            // flat on sphere

    scene.add(this.globe);

    // Soft lights (keeps things readable but not shiny)
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Load JSON → list on the left + build country-code labels
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];

      const nameToCode = new Map<string, string>();
      for (const c of this.countriesList) nameToCode.set(c.country, c.code);

      const labelData = this.countries.features
        .map((f: any) => {
          const code = nameToCode.get(f.properties.name as string);
          if (!code) return null;
          const [lng, lat] = geoCentroid(f) as [number, number];
          return { code, lat, lng };
        })
        .filter(Boolean) as { code: string; lat: number; lng: number }[];

      if (typeof (this.globe as any).labelsData === 'function') {
        this.globe
          .labelsData(labelData)
          .labelText((d: any) => d.code)  // show ISO code
          .labelLat((d: any) => d.lat)
          .labelLng((d: any) => d.lng)
          .labelAltitude(0.012)
          .labelSize(0.95)
          .labelDotRadius(0.16)
          .labelColor(() => 'rgba(0,0,0,0.9)')
          .labelResolution(2);
      }
    });

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // Search + zoom helpers
  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(c =>
          c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        );
  }

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateCameraZoom();
  }
  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateCameraZoom();
  }
  private updateCameraZoom() {
    if (this.controls.object) {
      (this.controls.object as any).position.z = this.currentZoom;
    }
  }
}
