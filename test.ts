import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Globe from 'three-globe';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat?: number;
  lng?: number;
  screenX?: number;
  screenY?: number;
};

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };
const RADIUS = 100;

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
  legendCollapsed = false;
  private controls!: OrbitControls;
  private globe: any;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private tooltip!: HTMLDivElement;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  // Convert lat/lon → 3D vector on globe
  private latLngToVector3(lat: number, lng: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(host.offsetWidth, host.offsetHeight);
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    // Tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.background = 'rgba(0,0,0,0.85)';
    this.tooltip.style.color = '#fff';
    this.tooltip.style.padding = '6px 12px';
    this.tooltip.style.borderRadius = '6px';
    this.tooltip.style.fontSize = '13px';
    this.tooltip.style.zIndex = '10';
    this.tooltip.style.display = 'none';
    host.appendChild(this.tooltip);

    const scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // Base globe
    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
    );
    const bumpTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png'
    );

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 75, 75),
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

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Load JSON with lat/lon
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills:
          c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply:
          c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng
      }));
      this.filteredList = [...this.countriesList];
    });

    // Mouse move → check distance to projected lat/lon
    this.renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.countriesList.length) return;

      let hovered: CountrySkill | null = null;
      let minDist = 9999;

      for (const c of this.countriesList) {
        if (c.lat == null || c.lng == null) continue;

        const vec = this.latLngToVector3(c.lat, c.lng, RADIUS);
        const projected = vec.clone().project(this.camera);
        const x = (projected.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
        const y = (-projected.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;

        c.screenX = x;
        c.screenY = y;

        const dx = event.offsetX - x;
        const dy = event.offsetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 20 && dist < minDist) {
          hovered = c;
          minDist = dist;
        }
      }

      if (hovered) {
        this.tooltip.innerHTML = `
          <b>${hovered.country}</b><br>
          Unique Skills: ${hovered.uniqueSkills}<br>
          Skill Supply: ${hovered.skillSupply}
        `;
        this.tooltip.style.left = `${hovered.screenX! + 10}px`;
        this.tooltip.style.top = `${hovered.screenY! + 10}px`;
        this.tooltip.style.display = 'block';
      } else {
        this.tooltip.style.display = 'none';
      }
    });

    this.renderer.domElement.addEventListener('mouseleave', () => {
      this.tooltip.style.display = 'none';
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Update projected screen coords for all countries each frame
      for (const c of this.countriesList) {
        if (c.lat == null || c.lng == null) continue;
        const vec = this.latLngToVector3(c.lat, c.lng, RADIUS);
        const projected = vec.clone().project(this.camera);
        c.screenX =
          (projected.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
        c.screenY =
          (-projected.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;
      }

      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      this.renderer.render(scene, this.camera);
    };
    animate();
  }

  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(
          c =>
            c.country.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
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
    if (this.controls.object)
      this.controls.object.position.z = this.currentZoom;
  }
}
