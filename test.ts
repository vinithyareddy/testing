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
  selectedCountry: CountrySkill | null = null;
  private highlightGroup!: THREE.Group;

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private labelGroup!: THREE.Group;
  private globeGroup!: THREE.Group;
  private lastZoom: number = ZOOM.initial;
  currentZoom: number = ZOOM.initial;

  private isFocusing = false;

  constructor(private http: HttpClient) { }

  selectCountry(country: CountrySkill) {
    this.selectedCountry = country;
    this.highlightCountryOnGlobe(country);
    this.focusOnCountry(country);
  }

  private highlightCountryOnGlobe(country: CountrySkill) {
    // Clear existing highlights
    if (this.highlightGroup) {
      this.globeGroup.remove(this.highlightGroup);
    }
    
    this.highlightGroup = new THREE.Group();
    this.globeGroup.add(this.highlightGroup);

    // Ensure country has position
    if (!country.position) {
      country.position = this.latLngToVector3(country.lat, country.lng, RADIUS);
    }

    if (country.position) {
      console.log(`Highlighting ${country.country} at position:`, country.position);

      // Create a larger pulsing ring around the country
      const ringGeometry = new THREE.RingGeometry(3, 6, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Red for better visibility
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Position the ring at the country's location
      const ringPosition = country.position.clone().normalize();
      ringPosition.multiplyScalar(RADIUS + 2); // Slightly further out
      ring.position.copy(ringPosition);
      
      // Make the ring face outward from the globe center
      ring.lookAt(ringPosition.clone().multiplyScalar(2));
      
      this.highlightGroup.add(ring);

      // Create a larger glowing sphere
      const sphereGeometry = new THREE.SphereGeometry(2.5, 16, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4444, // Bright red
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(ringPosition);
      this.highlightGroup.add(sphere);

      // Add a crosshair at the center for precise location
      const crosshairGroup = new THREE.Group();
      
      // Horizontal line
      const hLineGeometry = new THREE.PlaneGeometry(8, 0.5);
      const hLineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00, // Yellow
        transparent: true,
        opacity: 0.9
      });
      const hLine = new THREE.Mesh(hLineGeometry, hLineMaterial);
      crosshairGroup.add(hLine);
      
      // Vertical line
      const vLineGeometry = new THREE.PlaneGeometry(0.5, 8);
      const vLineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00, // Yellow
        transparent: true,
        opacity: 0.9
      });
      const vLine = new THREE.Mesh(vLineGeometry, vLineMaterial);
      crosshairGroup.add(vLine);
      
      crosshairGroup.position.copy(ringPosition);
      crosshairGroup.lookAt(ringPosition.clone().multiplyScalar(2));
      this.highlightGroup.add(crosshairGroup);

      // Add text label showing country name
      const labelSprite = this.createTextSprite(
        `${country.country} (${country.code})`, 
        '#ffff00', 
        32
      );
      const labelPosition = ringPosition.clone();
      labelPosition.multiplyScalar(1.2); // Further out for the label
      labelSprite.position.copy(labelPosition);
      this.highlightGroup.add(labelSprite);

      // Animate the highlight
      this.animateHighlight(ring, sphere, crosshairGroup);
    }
  }

  private animateHighlight(ring: THREE.Mesh, sphere: THREE.Mesh, crosshair: THREE.Group) {
    const animate = () => {
      if (this.highlightGroup && this.highlightGroup.children.includes(ring)) {
        // Pulse the ring
        const time = Date.now() * 0.003;
        const scale = 1 + Math.sin(time) * 0.3;
        ring.scale.setScalar(scale);
        
        // Pulse the sphere opacity
        const sphereMaterial = sphere.material as THREE.MeshBasicMaterial;
        sphereMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.3;
        
        // Animate crosshair
        const crosshairScale = 1 + Math.sin(time * 1.5) * 0.2;
        crosshair.scale.setScalar(crosshairScale);
        
        requestAnimationFrame(animate);
      }
    };
    animate();
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

  private getCountryPosition(lat: number, lng: number, radius: number = RADIUS): THREE.Vector3 {
    return this.latLngToVector3(lat, lng, radius);
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
        const label = this.createTextSprite(country.code, '#ffffff', 26);
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

    // FIXED: OrbitControls setup with proper constraints
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;
    
    // FIX: Properly center the controls on the globe
    this.controls.target.set(0, 0, 0);
    this.controls.enablePan = false; // Disable panning to prevent weird movements
    
    // FIX: Add rotation constraints to prevent flipping
    this.controls.minPolarAngle = Math.PI * 0.1; // Don't go too high
    this.controls.maxPolarAngle = Math.PI * 0.9; // Don't go too low
    
    // FIX: Constrain zoom levels
    this.controls.minDistance = 50;
    this.controls.maxDistance = 400;
    
    this.controls.update();

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

    this.globeGroup = new THREE.Group();
    this.globeGroup.add(this.globe);
    this.globeGroup.add(earth);
    this.scene.add(this.globeGroup);

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

    const globeGroup = new THREE.Group();
    globeGroup.add(this.globe);
    this.scene.add(globeGroup);

    this.labelGroup = new THREE.Group();
    globeGroup.add(this.labelGroup);

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

      if (!this.isFocusing) {
        this.globeGroup.rotation.y += ROTATION_SPEED;
      }

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

  focusOnCountry(country: CountrySkill) {
    if (!country) return;

    console.log(`Focusing on ${country.country} at lat: ${country.lat}, lng: ${country.lng}`);

    this.isFocusing = true;

    // Calculate target rotation to bring country to front center
    const targetRotationY = -country.lng * (Math.PI / 180);
    const targetRotationX = -country.lat * (Math.PI / 180);
    
    // Limit latitude rotation to prevent extreme tilting
    const maxTilt = Math.PI / 4; // 45 degrees
    const limitedTargetRotationX = Math.max(-maxTilt, Math.min(maxTilt, targetRotationX));

    console.log(`Target rotations: Y=${targetRotationY * 180/Math.PI}°, X=${limitedTargetRotationX * 180/Math.PI}°`);

    // Get current rotations
    const currentRotationY = this.globeGroup.rotation.y;
    const currentRotationX = this.globeGroup.rotation.x;

    // Calculate rotation differences (shortest path for Y)
    let diffY = targetRotationY - currentRotationY;
    while (diffY > Math.PI) diffY -= 2 * Math.PI;
    while (diffY < -Math.PI) diffY += 2 * Math.PI;

    const diffX = limitedTargetRotationX - currentRotationX;

    console.log(`Rotation differences: Y=${diffY * 180/Math.PI}°, X=${diffX * 180/Math.PI}°`);

    // Animate the globe rotation
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    
    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOutQuad(progress);

      // Apply interpolated rotation to the globe
      this.globeGroup.rotation.y = currentRotationY + (diffY * easedProgress);
      this.globeGroup.rotation.x = currentRotationX + (diffX * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        // Animation complete
        console.log(`Animation complete! Final: Y=${this.globeGroup.rotation.y * 180/Math.PI}°, X=${this.globeGroup.rotation.x * 180/Math.PI}°`);
        
        // Reset controls target to globe center after focusing
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        
        setTimeout(() => {
          this.isFocusing = false;
        }, 2000);
      }
    };

    animateRotation();
  }
}