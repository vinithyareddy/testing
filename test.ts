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

    // ── Three-Globe base (keep graticules + halo)
    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    // Hide the library’s internal blue sphere (older three-globe lacks globeImageUrl)
    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    }

    // Add our own textured Earth as a child of the globe (so it rotates with it)
    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load('assets/img/earth-blue-marble.jpg');
    const bumpTex  = texLoader.load('assets/img/earth-topology.png');

    const R = 100; // default globe radius used by three-globe
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 75, 75),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        bumpMap: bumpTex,
        bumpScale: 0.4,
        specular: new THREE.Color(0x222222),
        shininess: 3
      })
    );
    this.globe.add(earth);

    // Optional starfield background
    const starsTex = texLoader.load('assets/img/night-sky.jpg');
    const stars = new THREE.Mesh(
      new THREE.SphereGeometry(R * 10, 32, 32),
      new THREE.MeshBasicMaterial({ map: starsTex, side: THREE.BackSide })
    );
    scene.add(stars);

    // Countries geometry
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Transparent country interiors so the basemap shows through; raised borders
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => '#ffffff')
      .polygonAltitude(0.003);

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Load your country list (name + code + metrics). We’ll use it for labels & left panel.
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];
      for (const c of this.countriesList) this.nameToCode.set(c.country, c.code);

      // Country-code labels placed at polygon centroids
      const labelData = this.countries.features
        .map((f: any) => {
          const code = this.nameToCode.get(f.properties.name as string);
          if (!code) return null;
          const [lng, lat] = geoCentroid(f) as [number, number];
          return { code, lat, lng };
        })
        .filter(Boolean) as { code: string; lat: number; lng: number }[];

      if (typeof (this.globe as any).labelsData === 'function') {
        this.globe
          .labelsData(labelData)
          .labelText((d: any) => d.code)
          .labelLat((d: any) => d.lat)
          .labelLng((d: any) => d.lng)
          .labelAltitude(0.01)
          .labelSize(0.9)
          .labelDotRadius(0.15)
          .labelColor(() => 'rgba(0,0,0,0.85)')
          .labelResolution(2);
      }
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

  zoomIn()  { this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min); this.updateCameraZoom(); }
  zoomOut() { this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max); this.updateCameraZoom(); }
  private updateCameraZoom() { if (this.controls.object) this.controls.object.position.z = this.currentZoom; }
}
