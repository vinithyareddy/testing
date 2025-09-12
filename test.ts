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

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };
const RADIUS = 100; // globe radius

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
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private labelGroup!: THREE.Group; // Group to hold all labels
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

  private createTextSprite(text: string, color: string = '#ffffff', fontSize: number = 64): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = 256;
    canvas.height = 128;
    
    // Configure text style
    context.fillStyle = color;
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Add text background for better visibility
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.1
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 5, 1); // Adjust scale as needed
    
    return sprite;
  }

  private addCountryLabels() {
    // Create a group to hold all labels
    this.labelGroup = new THREE.Group();
    this.scene.add(this.labelGroup);

    this.countriesList.forEach(country => {
      if (country.position) {
        // Create text sprite for country code
        const label = this.createTextSprite(country.code, '#ffffff', 48);
        
        // Position the label slightly above the globe surface
        const labelPosition = country.position.clone();
        labelPosition.normalize();
        labelPosition.multiplyScalar(RADIUS + 8); // Slightly above surface
        
        label.position.copy(labelPosition);
        
        // Store reference to country data for potential interactions
        (label as any).userData = { country: country };
        
        this.labelGroup.add(label);
      }
    });
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

    this.labelGroup.children.forEach(label => {
      const sprite = label as THREE.Sprite;
      
      // Calculate if label is facing the camera
      const labelDirection = label.position.clone().normalize();
      const dot = labelDirection.dot(cameraDirection.clone().negate());
      
      // Only show labels on the visible side of the globe
      sprite.visible = dot > 0;
      
      // Fade labels based on distance from camera center
      if (sprite.visible) {
        const distanceFromCenter = Math.abs(dot - 1);
        sprite.material.opacity = Math.max(0.3, 1 - distanceFromCenter * 2);
      }
    });
  }

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

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);
    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    }

    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
    );

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 75, 75),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        specular: new THREE.Color(0x222222),
        shininess: 3
      })
    );
    this.scene.add(earth);
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
        uniqueSkills:
          c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply:
          c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, RADIUS)
      }));
      this.filteredList = [...this.countriesList];

      // Add country labels after data is loaded
      this.addCountryLabels();

      // Tooltip logic based on lat/lon positions
      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObject(earth);
        if (intersects.length > 0) {
          const point = intersects[0].point;

          // find closest country by 3D distance
          let closest: CountrySkill | null = null;
          let minDist = Infinity;
          for (const c of this.countriesList) {
            if (!c.position) continue;
            const dist = point.distanceTo(c.position);
            if (dist < minDist) {
              minDist = dist;
              closest = c;
            }
          }

          if (closest) {
            const vector = closest.position!.clone().project(this.camera);
            const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
            const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

            tooltip.innerHTML = `<b>${closest.country}</b><br>Code: ${closest.code}<br>Unique Skills: ${closest.uniqueSkills}<br>Skill Supply: ${closest.skillSupply}`;
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
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
      // this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      
      // Update label visibility based on camera position
      this.updateLabelVisibility();
      
      renderer.render(this.scene, this.camera);
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