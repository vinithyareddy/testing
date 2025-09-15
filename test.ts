// HTML Template Updates
// Add click handler and selection styling to country cards
<div *ngFor="let c of filteredList" 
     class="country-card" 
     [class.selected]="selectedCountry?.code === c.code"
     (click)="selectCountry(c)">
  <div class="country-header">
    <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
    <div class="country-name">{{ c.country }}</div>
  </div>
  <div class="metrics">
    <div class="metric-labels">
      <span>Unique Skills</span>
      <span>Skill Supply (FTE)</span>
    </div>
    <div class="metric-values">
      <span>{{ c.uniqueSkills }}</span>
      <span>{{ c.skillSupply }}</span>
    </div>
  </div>
</div>

// SCSS Updates
// Add selected state styling
.country-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 5px;
  cursor: pointer; // Changed from default to pointer
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &.selected {
    background: #eff6ff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
}

// TypeScript Component Updates
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
  selectedCountry: CountrySkill | null = null; // Add selected country tracking
  
  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private labelGroup!: THREE.Group;
  private globeGroup!: THREE.Group;
  private highlightGroup!: THREE.Group; // Add highlight group
  private lastZoom: number = ZOOM.initial;
  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) { }

  // Add method to select country
  selectCountry(country: CountrySkill) {
    this.selectedCountry = country;
    this.highlightCountryOnGlobe(country);
    this.animateToCountry(country);
  }

  // Add method to highlight country on globe
  private highlightCountryOnGlobe(country: CountrySkill) {
    // Clear existing highlights
    if (this.highlightGroup) {
      this.globeGroup.remove(this.highlightGroup);
    }
    
    this.highlightGroup = new THREE.Group();
    this.globeGroup.add(this.highlightGroup);

    if (country.position) {
      // Create a pulsing ring around the country
      const ringGeometry = new THREE.RingGeometry(2, 4, 16);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Position the ring at the country's location
      const ringPosition = country.position.clone().normalize();
      ringPosition.multiplyScalar(RADIUS + 1);
      ring.position.copy(ringPosition);
      
      // Make the ring face outward
      ring.lookAt(ringPosition.clone().multiplyScalar(2));
      
      this.highlightGroup.add(ring);

      // Create a glowing sphere
      const sphereGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(ringPosition);
      this.highlightGroup.add(sphere);

      // Animate the highlight
      this.animateHighlight(ring, sphere);
    }
  }

  // Add animation for the highlight
  private animateHighlight(ring: THREE.Mesh, sphere: THREE.Mesh) {
    const animate = () => {
      if (this.highlightGroup && this.highlightGroup.children.includes(ring)) {
        // Pulse the ring
        const time = Date.now() * 0.003;
        const scale = 1 + Math.sin(time) * 0.3;
        ring.scale.setScalar(scale);
        
        // Pulse the sphere opacity
        const sphereMaterial = sphere.material as THREE.MeshBasicMaterial;
        sphereMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.3;
        
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  // Add method to animate camera to country
  private animateToCountry(country: CountrySkill) {
    if (!country.position || !this.camera || !this.controls) return;

    // Calculate target position for camera
    const targetPosition = country.position.clone().normalize();
    targetPosition.multiplyScalar(this.currentZoom);
    
    // Animate camera movement
    const startPosition = this.camera.position.clone();
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      const easedProgress = easeInOutCubic(progress);
      
      // Interpolate camera position
      this.camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
      
      // Update controls target to look at the country
      const lookAtTarget = country.position!.clone();
      this.controls.target.lerp(lookAtTarget, easedProgress);
      
      this.controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  private createTextSprite(text: string, color: string = '#1f2937', fontSize: number = 18): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    const padding = 4;
    canvas.width = textWidth + (padding * 2);
    canvas.height = textHeight + (padding * 2);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(0, 0, 0, 0.9)';
    context.shadowBlur = 3;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      depthTest: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    const baseScale = 3;
    const scaleX = Math.max(baseScale, textWidth * 0.015);
    const scaleY = baseScale * 0.8;
    sprite.scale.set(scaleX, scaleY, 1);

    return sprite;
  }

  private addCountryLabels() {
    if (this.labelGroup) this.globeGroup.remove(this.labelGroup);
    this.labelGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);

    this.countriesList.forEach(country => {
      if (country.position) {
        // Highlight selected country label
        const isSelected = this.selectedCountry?.code === country.code;
        const labelColor = isSelected ? '#3b82f6' : '#ffffff';
        const fontSize = isSelected ? 30 : 26;
        
        const label = this.createTextSprite(country.code, labelColor, fontSize);
        const labelPosition = country.position.clone().normalize();
        labelPosition.multiplyScalar(RADIUS + 0.5);
        label.position.copy(labelPosition);
        (label as any).userData = { country };
        this.labelGroup.add(label);
      }
    });
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    const cameraPosition = this.camera.position.clone().normalize();
    const minDistance = 8;

    this.labelGroup.children.forEach((label, i) => {
      const sprite = label as THREE.Sprite;
      const labelDirection = label.position.clone().normalize();
      const dot = labelDirection.dot(cameraPosition);

      sprite.visible = dot > 0;

      if (sprite.visible) {
        const opacity = Math.max(0.3, Math.min(1.0, dot));
        (sprite.material as THREE.SpriteMaterial).opacity = opacity;

        for (let j = 0; j < i; j++) {
          const other = this.labelGroup.children[j] as THREE.Sprite;
          if (other.visible && label.position.distanceTo(other.position) < minDistance) {
            sprite.visible = false;
            break;
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

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

    // build globeGroup
    this.globeGroup = new THREE.Group();
    this.globeGroup.add(this.globe);
    this.globeGroup.add(earth);
    this.scene.add(this.globeGroup);

    // init label group and highlight group inside globeGroup
    this.labelGroup = new THREE.Group();
    this.highlightGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);
    this.globeGroup.add(this.highlightGroup);

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
          let closest: CountrySkill | null = null;
          let minDist = Infinity;

          for (const c of this.countriesList) {
            if (!c.position) continue;
            const rotatedPos = c.position.clone().applyMatrix4(this.globeGroup.matrixWorld);
            const dist = point.distanceTo(rotatedPos);
            if (dist < minDist) {
              minDist = dist;
              closest = { ...c, position: rotatedPos };
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
      this.globeGroup.rotation.y += ROTATION_SPEED;
      this.controls.update();

      const currentZ = this.camera.position.z;
      if (Math.abs(currentZ - this.lastZoom) > 5) {
        this.currentZoom = currentZ;
        this.addCountryLabels();
        this.lastZoom = currentZ;
      }

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

    // Clear selection if selected country is not in filtered list
    if (this.selectedCountry && !this.filteredList.some(c => c.code === this.selectedCountry!.code)) {
      this.selectedCountry = null;
      if (this.highlightGroup) {
        this.globeGroup.remove(this.highlightGroup);
      }
    }

    this.addCountryLabels();
  }

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  private updateCameraZoom() {
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }
}