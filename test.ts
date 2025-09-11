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

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;

  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    // make colors look correct (avoids washed-out textures)
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

    // 🌍 Globe setup
    this.globe = new Globe().showGlobe(true).showGraticules(false).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    // Load earth texture (relief + oceans) and DARKEN it
    const loader = new THREE.TextureLoader();
    loader.load(
      'assets/images/blueearth.jpg',
      (texture) => {
        const earthMat = new THREE.MeshPhongMaterial({
          map: texture,
          bumpMap: texture,
          bumpScale: 0.8,
          specular: new THREE.Color(0x222222),
          shininess: 4
        });
        // apply to globe
        this.globe.globeMaterial(earthMat);

        // 🔵 darken & tint
        earthMat.color.set('#2f4f7a');       // bluish tint
        earthMat.color.multiplyScalar(0.82); // 0.82 -> slightly darker (0.8 for more)
        earthMat.specular.set(0x111111);
        earthMat.shininess = 2;
      }
    );

    // Countries geometry
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // No borders; transparent caps so the texture shows through
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(0);

    // Lights (a bit dimmer to keep map darker)
    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 0.8)); // was 1.2
    const dir = new THREE.DirectionalLight(0xffffff, 0.55); // was 0.8
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Optional: subtle dark overlay shell (increase opacity for darker)
    const darkOverlay = new THREE.Mesh(
      new THREE.SphereGeometry(100 * 1.001, 64, 64), // 100 ~ default radius
      new THREE.MeshBasicMaterial({ color: 0x001a33, transparent: true, opacity: 0.12 })
    );
    darkOverlay.renderOrder = 1;
    this.globe.add(darkOverlay);

    // Load JSON data for side panel + build CODE labels at centroids
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];

      // quick name->code map
      const nameToCode = new Map<string, string>();
      for (const c of this.countriesList) nameToCode.set(c.country, c.code);

      const labelData = this.countries.features
        .map((f: any) => {
          const name = f.properties.name as string;
          const code = nameToCode.get(name);
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // Zoom helpers
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
