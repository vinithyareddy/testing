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

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat?: number;
  lng?: number;
};

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
  @ViewChild('tooltip', { static: true }) tooltipEl!: ElementRef<HTMLDivElement>;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private nameToCode = new Map<string, string>();
  private coordsByCode = new Map<string, { lat: number; lng: number }>();

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // mouse listener for raycasting + tooltip follow
    renderer.domElement.addEventListener('mousemove', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.tooltipEl) {
        this.tooltipEl.nativeElement.style.left = event.clientX + 15 + 'px';
        this.tooltipEl.nativeElement.style.top = event.clientY + 15 + 'px';
      }
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, host.offsetWidth / host.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    // Transparent globe base
    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    }

    // Earth textures
    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load('https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg');
    const bumpTex = texLoader.load('https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png');

    const R = 100;
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
    earth.rotation.y = -Math.PI / 2;
    this.globe.add(earth);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(0);

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // load data
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng
      }));
      this.filteredList = [...this.countriesList];

      for (const c of this.countriesList) {
        this.nameToCode.set(c.country, c.code);
        if (typeof c.lat === 'number' && typeof c.lng === 'number') {
          this.coordsByCode.set(c.code, { lat: c.lat, lng: c.lng });
        }
      }

      const labelData = this.countries.features
        .map((f: any) => {
          const name = f.properties.name as string;
          const code = this.nameToCode.get(name);
          if (!code) return null;

          const fixed = this.coordsByCode.get(code);
          let lat: number, lng: number;
          if (fixed) {
            ({ lat, lng } = fixed);
          } else {
            [lng, lat] = geoCentroid(f) as [number, number];
          }
          return { code, lat, lng, userData: { code } };
        })
        .filter(Boolean) as { code: string; lat: number; lng: number; userData: any }[];

      if (typeof (this.globe as any).labelsData === 'function') {
        this.globe
          .labelsData(labelData)
          .labelText((d: any) => d.code)
          .labelLat((d: any) => d.lat)
          .labelLng((d: any) => d.lng)
          .labelAltitude(0.01)
          .labelSize(0.45)
          .labelDotRadius(0.12)
          .labelColor(() => 'rgba(0,0,0,0.8)')
          .labelResolution(2);
      }
    });

    // animate loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();

      // hover detection
      this.raycaster.setFromCamera(this.mouse, camera);
      const intersects = this.raycaster.intersectObjects(scene.children, true);

      let found = false;
      for (const obj of intersects) {
        if (obj.object && obj.object.userData && obj.object.userData.code) {
          const country = this.countriesList.find(c => c.code === obj.object.userData.code);
          if (country && this.tooltipEl) {
            this.tooltipEl.nativeElement.innerHTML = `
              <b>${country.country}</b><br/>
              Unique Skills: ${country.uniqueSkills}<br/>
              Skill Supply (FTE): ${country.skillSupply}
            `;
            this.tooltipEl.nativeElement.style.display = 'block';
            found = true;
            break;
          }
        }
      }
      if (!found && this.tooltipEl) {
        this.tooltipEl.nativeElement.style.display = 'none';
      }

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

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateCameraZoom();
  }
  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateCameraZoom();
  }
  private updateCameraZoom() {
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }
}
