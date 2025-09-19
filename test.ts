import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three-stdlib';
import { LiftPopoverComponent } from '@lift/ui';

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

// Pin configuration
const PIN_CONFIG = {
  COLOR: 0x1a73e8, // Google blue
  SIZE: 2.5,
  HEIGHT: 5,
  DISPLAY_TIME: 3000,
  ANIMATION_DURATION: 500
};

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  fullview = false;
  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';
  legendCollapsed = false;

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

  constructor(private http: HttpClient, private render: Renderer2) { }

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

    this.labelGroup.children.forEach((label: any, i: number) => {
      const sprite = label as THREE.Sprite;
      const labelDirection = label.position.clone().normalize();
      const dot = labelDirection.dot(cameraPosition);

      sprite.visible = true;

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
    tooltip.className = 'globe-tooltip';
    tooltip.style.zIndex = '2000';
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

    this.globeGroup = new THREE.Group();
    this.globeGroup.add(this.globe);
    this.globeGroup.add(earth);
    this.scene.add(this.globeGroup);

    this.labelGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);

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

    this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
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

            tooltip.innerHTML = `
              <div class="tooltip-header">
                <span class="fi fi-${closest.code.toLowerCase()}" title="${closest.country}"></span>
                <span>${closest.country}</span>
              </div>
              <div class="tooltip-row">
                <span class="label">Unique Skills</span>
                <span class="value">${closest.uniqueSkills}</span>
              </div>
              <div class="tooltip-row">
                <span class="label">Skill Supply (FTE)</span>
                <span class="value">${closest.skillSupply}</span>
              </div>
            `;

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

    this.isFocusing = true;

    const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);
    const worldPos = basePos.clone().applyMatrix4(this.globeGroup.matrixWorld);

    const distance = this.camera.position.length();
    const dir = worldPos.clone().normalize();

    this.camera.position.copy(dir.multiplyScalar(distance));
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Create location pin instead of red sphere
    const pinGroup = this.createLocationPin(basePos);
    this.globeGroup.add(pinGroup);

    // Animate pin appearance
    this.animatePin(pinGroup);

    setTimeout(() => {
      // Fade out and remove pin
      this.fadeOutPin(pinGroup, () => {
        this.globeGroup.remove(pinGroup);
      });
      this.isFocusing = false;
    }, PIN_CONFIG.DISPLAY_TIME);
  }

  private createLocationPin(position: THREE.Vector3): THREE.Group {
    const pinGroup = new THREE.Group();

    // Create teardrop shape for the pin
    const pinGeometry = this.createPinGeometry();
    const pinMaterial = new THREE.MeshLambertMaterial({ 
      color: PIN_CONFIG.COLOR,
      transparent: true
    });
    const pin = new THREE.Mesh(pinGeometry, pinMaterial);

    // Create white center circle
    const centerGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const centerMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xffffff,
      transparent: true
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.set(0, PIN_CONFIG.HEIGHT * 0.6, 0);

    // Create pin shadow
    const shadowGeometry = this.createPinGeometry();
    const shadowMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0.3
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(0.3, -0.2, 0.3); // Offset for shadow effect
    shadow.scale.set(1.1, 0.3, 1.1); // Flatten and slightly enlarge for shadow

    pinGroup.add(shadow);
    pinGroup.add(pin);
    pinGroup.add(center);

    // Position the pin at the country location
    pinGroup.position.copy(position);
    
    // Make pin point outward from globe center
    const direction = position.clone().normalize();
    pinGroup.lookAt(direction.multiplyScalar(1000));
    pinGroup.rotateX(Math.PI); // Flip to point outward

    return pinGroup;
  }

  private createPinGeometry(): THREE.BufferGeometry {
    // Create teardrop/pin shape using LatheGeometry
    const points = [];
    
    // Create the profile curve for the teardrop shape
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      let x, y;
      
      if (t <= 0.6) {
        // Circular top part
        const angle = (t / 0.6) * Math.PI;
        x = Math.sin(angle) * PIN_CONFIG.SIZE;
        y = PIN_CONFIG.HEIGHT - (1 - Math.cos(angle)) * PIN_CONFIG.SIZE;
      } else {
        // Tapered bottom part
        const tapeFactor = (t - 0.6) / 0.4;
        x = PIN_CONFIG.SIZE * (1 - tapeFactor);
        y = PIN_CONFIG.HEIGHT - PIN_CONFIG.SIZE - tapeFactor * (PIN_CONFIG.HEIGHT - PIN_CONFIG.SIZE);
      }
      
      points.push(new THREE.Vector2(x, y));
    }
    
    // Add the very tip point
    points.push(new THREE.Vector2(0, 0));
    
    return new THREE.LatheGeometry(points, 16);
  }

  private animatePin(pinGroup: THREE.Group) {
    // Start small and fade in
    pinGroup.scale.set(0.1, 0.1, 0.1);
    pinGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = 0;
      }
    });

    // Animate scale and opacity
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / PIN_CONFIG.ANIMATION_DURATION, 1);
      
      // Ease out animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      pinGroup.scale.setScalar(easeProgress);
      pinGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          if (child.material.color.getHex() === 0x000000) {
            // Shadow
            child.material.opacity = 0.3 * easeProgress;
          } else {
            // Pin body and center
            child.material.opacity = easeProgress;
          }
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  private fadeOutPin(pinGroup: THREE.Group, onComplete: () => void) {
    const startTime = Date.now();
    const fadeOutDuration = PIN_CONFIG.ANIMATION_DURATION;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / fadeOutDuration, 1);
      
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.2; // Slightly shrink while fading
      
      pinGroup.scale.setScalar(scale);
      pinGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          if (child.material.color.getHex() === 0x000000) {
            // Shadow
            child.material.opacity = 0.3 * opacity;
          } else {
            // Pin body and center
            child.material.opacity = opacity;
          }
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}