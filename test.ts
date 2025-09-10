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

type CountryData = {
  country: string;
  code: string;
  region: string;
  uniqueSkills: number;
  skillSupply: number;
  lat: number;
  lng: number;
};

const ROTATION_SPEED = 0.002;

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: CountryData[] = [];
  filteredList: CountryData[] = [];

  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      globeDiv.offsetWidth / globeDiv.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 250;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // 🌍 Base globe with map texture (NOT satellite)
    this.globe = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .atmosphereColor('#7ec8e3')
      .atmosphereAltitude(0.18);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Load JSON and assign random fallback values
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

      this.applyBorders();
      this.applyLabels();
    });

    // 🎥 Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.globe) this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // 🌐 Light gray borders
  private applyBorders() {
    if (!this.countries) return;
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0.35)');
  }

  // 🏷️ Country labels
  private applyLabels() {
    this.globe
      .labelsData(this.countriesList)
      .labelLat((d: any) => d.lat)
      .labelLng((d: any) => d.lng)
      .labelText((d: any) => d.country)
      .labelSize(() => 0.9)
      .labelDotRadius(() => 0.25)
      .labelColor(() => 'rgba(0,0,0,0.85)')
      .labelResolution(2);
  }
}
