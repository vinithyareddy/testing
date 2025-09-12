import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };
const RADIUS = 100;
const LABEL_COLOR = '#ffffff'; // global label color
const LABEL_FONT_SIZE = 26;    // global label font size
const MIN_LABEL_DISTANCE = 3;  // minimum spacing between labels

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  private controls!: OrbitControls;
  private globe: any;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private labelGroup!: THREE.Group;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) { }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Clean, modern text sprite (no shadows, crisp text)
  private createTextSprite(text: string, color: string, fontSize: number): THREE.Sprite {
    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d')!;
    measureCtx.font = `${fontSize}px Arial, Helvetica, sans-serif`;
    const textWidth = measureCtx.measureText(text).width;
    const textHeight = fontSize;

    const padding = 6;
    const canvas = document.createElement('canvas');
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;

    const ctx = canvas.getContext('2d')!;
    ctx.font = `${fontSize}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    const scale = fontSize * 0.1;
    sprite.scale.set(scale, scale * 0.5, 1);

    return sprite;
  }

  // Add labels, skip overlaps
  private addCountryLabels() {
    this.labelGroup = new THREE.Group();
    this.scene.add(this.labelGroup);

    this.countriesList.forEach(country => {
      if (!country.position) return;

      // skip labels too close to existing ones
      const tooClose = this.labelGroup.children.some(label =>
        label.position.distanceTo(country.position!) < MIN_LABEL_DISTANCE
      );
      if (tooClose) return;

      const label = this.createTextSprite(country.code, LABEL_COLOR, LABEL_FONT_SIZE);
      const labelPos = country.position.clone().normalize().multiplyScalar(RADIUS + 1.5);
      label.position.copy(labelPos);
      (label as any).userData = { country };
      this.labelGroup.add(label);
    });
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    const camDir = this.camera.position.clone().normalize();
    this.labelGroup.children.forEach(label => {
      const sprite = label as THREE.Sprite;
      const dir = sprite.position.clone().normalize();
      const dot = dir.dot(camDir);
      sprite.visible = dot > 0.05;
      if (sprite.visible) {
        const opacity = Math.min(1, Math.max(0, (dot - 0.05) / 0.35));
        (sprite.material as THREE.SpriteMaterial).opacity = opacity;
      }
    });
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    host.appendChild(renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, host.offsetWidth / host.offsetHeight, 0.1, 1000);
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
    );
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 75, 75),
      new THREE.MeshPhongMaterial({ map: earthTex, specular: new THREE.Color(0x222222), shininess: 3 })
    );
    this.scene.add(earth);
    this.globe.add(earth);

    this.scene.add(this.globe);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);

    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, RADIUS)
      }));
      this.filteredList = [...this.countriesList];
      this.addCountryLabels();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.updateLabelVisibility();
      renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
