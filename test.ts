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

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';
  legendCollapsed = false;
  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // Tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '13px';
    tooltip.style.zIndex = '10';
    tooltip.style.display = 'none';
    host.appendChild(tooltip);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
    }

    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
    );
    const bumpTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png'
    );

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

      // 🔑 Unified labelData: same source for codes + tooltips
      const labelData = this.countries.features
        .map((f: any) => {
          const name = f.properties.name as string;
          const match = this.countriesList.find(
            c => c.country.toLowerCase() === name.toLowerCase()
          );
          let lat: number, lng: number;
          if (match?.lat && match?.lng) {
            lat = match.lat;
            lng = match.lng;
          } else {
            [lng, lat] = geoCentroid(f) as [number, number];
          }
          return match
            ? { code: match.code, lat, lng, country: match.country, data: match }
            : null;
        })
        .filter(Boolean) as {
        code: string;
        lat: number;
        lng: number;
        country: string;
        data: CountrySkill;
      }[];

      // Show codes on globe
      this.globe
        .labelsData(labelData)
        .labelText((d: any) => d.code)
        .labelLat((d: any) => d.lat)
        .labelLng((d: any) => d.lng)
        .labelAltitude(0.012)
        .labelSize(0.95)
        .labelDotRadius(0.16)
        .labelColor(() => 'rgba(0,0,0,0.9)')
        .labelResolution(2);

      // Tooltip logic: raycast against earth, then nearest labelData
      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(earth);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          let closest: any = null;
          let minDist = Infinity;
          for (const d of labelData) {
            const pos = new THREE.Vector3().setFromSphericalCoords(
              R,
              (90 - d.lat) * (Math.PI / 180),
              (d.lng + 180) * (Math.PI / 180)
            );
            const dist = point.distanceTo(pos);
            if (dist < minDist) {
              minDist = dist;
              closest = d;
            }
          }
          if (closest) {
            const vector = new THREE.Vector3().setFromSphericalCoords(
              R,
              (90 - closest.lat) * (Math.PI / 180),
              (closest.lng + 180) * (Math.PI / 180)
            );
            const screen = vector.clone().project(camera);
            const x =
              (screen.x * 0.5 + 0.5) * renderer.domElement.clientWidth + 15;
            const y =
              (-screen.y * 0.5 + 0.5) * renderer.domElement.clientHeight + 15;

            tooltip.innerHTML = `<b>${closest.country}</b><br>Unique Skills: ${closest.data.uniqueSkills}<br>Skill Supply: ${closest.data.skillSupply}`;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
            tooltip.style.display = 'block';
            return;
          }
        }
        tooltip.style.display = 'none';
      };

      renderer.domElement.addEventListener('mousemove', handleHover);
      renderer.domElement.addEventListener('click', handleHover);
      renderer.domElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
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
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }
}
