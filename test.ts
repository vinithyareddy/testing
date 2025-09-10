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
type LabelDatum = { lat: number; lng: number; text: string; type: 'country' | 'ocean' };

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };

// Approx positions for ocean labels (UI-only)
const OCEAN_LABELS: LabelDatum[] = [
  { text: 'North Pacific Ocean', lat: 25, lng: -150, type: 'ocean' },
  { text: 'South Pacific Ocean', lat: -25, lng: -135, type: 'ocean' },
  { text: 'North Atlantic Ocean', lat: 30, lng: -35, type: 'ocean' },
  { text: 'South Atlantic Ocean', lat: -25, lng: -20, type: 'ocean' },
  { text: 'Indian Ocean', lat: -15, lng: 80, type: 'ocean' },
  { text: 'Arctic Ocean', lat: 75, lng: 0, type: 'ocean' },
  { text: 'Southern Ocean', lat: -60, lng: 20, type: 'ocean' }
];

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

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;

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

    this.globe = new Globe().showGlobe(true).showGraticules(true);
    // Ocean color (flat light blue)
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: 0xaed6f1 }));
    // Graticules subtle blue
    this.globe.graticulesMaterial(new THREE.LineBasicMaterial({ color: 0x3a8bbf, opacity: 0.25, transparent: true }));

    // Countries geometry
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Base land style (no cost/region coloring)
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => '#a8d5a2')              // pale green land
      .polygonSideColor(() => 'rgba(0,0,0,0)')       // no side shading
      .polygonStrokeColor(() => '#ffffff');          // white borders

    // Labels: countries + oceans
    const countryLabels: LabelDatum[] = this.countries.features
      .map((f: any) => {
        const [lng, lat] = geoCentroid(f);
        return { lat, lng, text: f.properties.name as string, type: 'country' as const };
      })
      .filter(d => Number.isFinite(d.lat) && Number.isFinite(d.lng));

    const allLabels: LabelDatum[] = [...countryLabels, ...OCEAN_LABELS];

    this.globe
      .labelsData(allLabels)
      .labelText((d: LabelDatum) => d.text)
      .labelLat((d: LabelDatum) => d.lat)
      .labelLng((d: LabelDatum) => d.lng)
      .labelSize((d: LabelDatum) => (d.type === 'ocean' ? 2.6 : 1.6))
      .labelColor((d: LabelDatum) => (d.type === 'ocean' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.85)'))
      .labelDotRadius(0) // no dots under labels
      .labelResolution(2);

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Load skills JSON (for the side list; values randomized if 0)
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED; // smooth auto-rotate
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // Zoom helpers (wire to +/− buttons if you have them)
  zoomIn()  { this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min); this.updateZoom(); }
  zoomOut() { this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max); this.updateZoom(); }
  private updateZoom() { if (this.controls.object) this.controls.object.position.z = this.currentZoom; }
}
