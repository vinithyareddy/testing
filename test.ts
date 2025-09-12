import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Text } from 'troika-three-text';

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
const LABEL_COLOR = '#ffffff';
const BASE_FONT_SIZE = 6;
const MIN_LABEL_DISTANCE = 3;

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
  private tooltip!: HTMLDivElement;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) {}

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  private getFontSizeForZoom(): number {
    if (this.currentZoom > 250) return BASE_FONT_SIZE * 0.6;
    if (this.currentZoom > 180) return BASE_FONT_SIZE * 0.8;
    if (this.currentZoom > 120) return BASE_FONT_SIZE * 1.0;
    return BASE_FONT_SIZE * 1.4;
  }

  private getVisibilityThreshold(): number {
    if (this.currentZoom > 250) return 90;
    if (this.currentZoom > 180) return 70;
    if (this.currentZoom > 120) return 40;
    return 0;
  }

  private addCountryLabels() {
    if (this.labelGroup) {
      this.scene.remove(this.labelGroup);
    }

    this.labelGroup = new THREE.Group();
    this.scene.add(this.labelGroup);

    const fontSize = this.getFontSizeForZoom();
    const threshold = this.getVisibilityThreshold();

    this.countriesList.forEach(country => {
      if (!country.position) return;
      if (country.uniqueSkills < threshold) return;

      const tooClose = this.labelGroup.children.some(label =>
        label.position.distanceTo(country.position!) < MIN_LABEL_DISTANCE
      );
      if (tooClose) return;

      const text = new Text();
      text.text = country.code;
      text.fontSize = fontSize;
      text.color = LABEL_COLOR;
      text.anchorX = 'center';
      text.anchorY = 'middle';

      const labelPos = country.position.clone().normalize().multiplyScalar(RADIUS + 0.1);
      text.position.copy(labelPos);

      text.lookAt(new THREE.Vector3(0, 0, 0));

      (text as any).userData = { country };

      this.labelGroup.add(text);
    });
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    const camDir = this.camera.position.clone().normalize();
    this.labelGroup.children.forEach(label => {
      const dir = label.position.clone().normalize();
      const dot = dir.dot(camDir);
      label.visible = dot > 0.05;
    });
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    host.appendChild(renderer.domElement);

    // ✅ Tooltip div
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

    // ✅ Add polygons for raycasting tooltips
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;
    this.globe
      .polygonsData(countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(0);

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

    // ✅ Old tooltip logic (labels + polygons)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleHover = (event: MouseEvent) => {
      mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(
        [...this.labelGroup.children, ...this.globe.children],
        true
      );

      if (intersects.length > 0) {
        const obj: any = intersects[0].object;
        let country: CountrySkill | null = null;

        if (obj.userData && obj.userData.country) {
          country = obj.userData.country;
        } else if (obj.userData && obj.userData.properties) {
          const name = obj.userData.properties.name;
          country = this.countriesList.find(
            c => c.country.toLowerCase() === name?.toLowerCase()
          ) || null;
        }

        if (country) {
          this.tooltip.innerHTML = `<b>${country.country}</b><br>Code: ${country.code}<br>Unique Skills: ${country.uniqueSkills}<br>Skill Supply: ${country.skillSupply}`;
          this.tooltip.style.left = event.offsetX + 15 + 'px';
          this.tooltip.style.top = event.offsetY + 15 + 'px';
          this.tooltip.style.display = 'block';
          return;
        }
      }

      this.tooltip.style.display = 'none';
    };

    renderer.domElement.addEventListener('mousemove', handleHover);
    renderer.domElement.addEventListener('click', handleHover);
    renderer.domElement.addEventListener('mouseleave', () => {
      this.tooltip.style.display = 'none';
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();

      const zoomNow = this.camera.position.z;
      if (Math.abs(zoomNow - this.currentZoom) > 2) {
        this.currentZoom = zoomNow;
        this.addCountryLabels();
      }

      this.updateLabelVisibility();
      renderer.render(this.scene, this.camera);
    };
    animate();
  }
}
