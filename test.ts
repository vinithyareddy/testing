import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, OnDestroy, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
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
  private isHovering = false;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  private resizeObserver!: ResizeObserver;

  // Responsive breakpoints
  private readonly breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  constructor(private http: HttpClient, private render: Renderer2) {}

  // Handle window resize events
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleResize();
  }

  private handleResize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    if (!host || !this.renderer || !this.camera) return;

    const width = host.offsetWidth;
    const height = host.offsetHeight;

    // Update renderer size
    this.renderer.setSize(width, height);
    
    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Adjust zoom based on screen size for better mobile experience
    this.adjustZoomForScreenSize();

    // Update label scaling for different screen sizes
    this.updateLabelScaling();
  }

  private adjustZoomForScreenSize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    let zoomMultiplier = 1;
    
    if (width <= this.breakpoints.mobile) {
      // Mobile devices - zoom out more to show more of the globe
      zoomMultiplier = 1.3;
    } else if (width <= this.breakpoints.tablet) {
      // Tablets - slight zoom adjustment
      zoomMultiplier = 1.1;
    }

    const adjustedZoom = this.currentZoom * zoomMultiplier;
    
    if (this.camera && this.controls) {
      this.camera.position.z = adjustedZoom;
      this.controls.update();
    }
  }

  private updateLabelScaling() {
    if (!this.labelGroup) return;
    
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    let scaleFactor = 1;
    
    if (width <= this.breakpoints.mobile) {
      scaleFactor = 0.7; // Smaller labels on mobile
    } else if (width <= this.breakpoints.tablet) {
      scaleFactor = 0.85; // Slightly smaller on tablets
    }

    this.labelGroup.children.forEach((label: any) => {
      const sprite = label as THREE.Sprite;
      const currentScale = sprite.scale.clone();
      sprite.scale.set(
        currentScale.x * scaleFactor,
        currentScale.y * scaleFactor,
        currentScale.z
      );
    });
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use requestAnimationFrame to avoid resize loops
          requestAnimationFrame(() => {
            this.handleResize();
          });
        }
      });

      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
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
    
    // Adjust font size based on screen size
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    let adjustedFontSize = fontSize;
    
    if (width <= this.breakpoints.mobile) {
      adjustedFontSize = fontSize * 0.8;
    } else if (width <= this.breakpoints.tablet) {
      adjustedFontSize = fontSize * 0.9;
    }
    
    context.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = adjustedFontSize;
    const padding = 4;
    
    canvas.width = textWidth + (padding * 2);
    canvas.height = textHeight + (padding * 2);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
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
    const baseScale = width <= this.breakpoints.mobile ? 2.5 : 3;
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

  private createIconSprite(
    color: string = '#0071bc',
    scaleX: number = 8,
    scaleY: number = 12
  ): THREE.Sprite {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    // Adjust icon size based on screen size
    let adjustedScaleX = scaleX;
    let adjustedScaleY = scaleY;
    
    if (width <= this.breakpoints.mobile) {
      adjustedScaleX = scaleX * 0.7;
      adjustedScaleY = scaleY * 0.7;
    } else if (width <= this.breakpoints.tablet) {
      adjustedScaleX = scaleX * 0.85;
      adjustedScaleY = scaleY * 0.85;
    }

    const size = 128;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = size;
    canvas.height = size;

    ctx.font = `900 ${size - 16}px "Font Awesome 6 Pro"`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf3c5', size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      color: new THREE.Color(color)
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(adjustedScaleX, adjustedScaleY, 1);
    return sprite;
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    const cameraPosition = this.camera.position.clone().normalize();
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    // Adjust minimum distance based on screen size
    let minDistance = 8;
    if (width <= this.breakpoints.mobile) {
      minDistance = 12; // Increase spacing on mobile
    } else if (width <= this.breakpoints.tablet) {
      minDistance = 10;
    }

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
    
    // Initialize renderer with responsive size
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.updateRendererSize();
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    // Set up resize observer
    this.setupResizeObserver();

    // Create tooltip with responsive positioning
    const tooltip = this.createResponsiveTooltip(host);

    this.scene = new THREE.Scene();
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
    this.controls.enableZoom = false;

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

      const handleMouseMove = this.createResponsiveMouseHandler(tooltip, earth);
      
      this.renderer.domElement.addEventListener('mouseleave', () => {
        this.isHovering = false;
        tooltip.style.display = 'none';
      });

      this.renderer.domElement.addEventListener('mousemove', handleMouseMove);
    });

    this.startAnimation();

    // Initial responsive adjustments
    this.adjustZoomForScreenSize();
  }

  private createResponsiveTooltip(host: HTMLDivElement): HTMLDivElement {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.className = 'globe-tooltip';
    tooltip.style.zIndex = '2000';
    tooltip.style.display = 'none';
    
    // Add responsive styles
    tooltip.style.fontSize = 'clamp(12px, 2vw, 14px)';
    tooltip.style.maxWidth = '250px';
    tooltip.style.wordWrap = 'break-word';
    
    host.appendChild(tooltip);
    return tooltip;
  }

  private createResponsiveMouseHandler(tooltip: HTMLDivElement, earth: THREE.Mesh) {
    return (event: MouseEvent) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(earth);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        let closest: CountrySkill | null = null;
        let minDist = Infinity;
        
        // Adjust hover sensitivity based on screen size
        const host = this.globeContainer.nativeElement as HTMLDivElement;
        const width = host.offsetWidth;
        let maxHoverDistance = 15;
        
        if (width <= this.breakpoints.mobile) {
          maxHoverDistance = 20; // Increase hover area on mobile
        }

        for (const c of this.countriesList) {
          if (!c.position) continue;
          const rotatedPos = c.position.clone().applyMatrix4(this.globeGroup.matrixWorld);
          const dist = point.distanceTo(rotatedPos);
          if (dist < minDist && dist < maxHoverDistance) {
            minDist = dist;
            closest = { ...c, position: rotatedPos };
          }
        }

        if (closest) {
          this.isHovering = true;
          this.positionTooltip(tooltip, closest, event);
          return;
        }
      }

      this.isHovering = false;
      tooltip.style.display = 'none';
    };
  }

  private positionTooltip(tooltip: HTMLDivElement, country: CountrySkill, event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <img class="flag-icon" src="assets/images/flags/${country.code.toLowerCase()}.svg"/>
        <span>${country.country}</span>
      </div>
      <div class="tooltip-row">
        <span class="label">Unique Skills</span>
        <span class="value">${country.uniqueSkills}</span>
      </div>
      <div class="tooltip-row">
        <span class="label">Skill Supply (FTE)</span>
        <span class="value">${country.skillSupply}</span>
      </div>
    `;

    // Responsive tooltip positioning
    let x = event.clientX - rect.left + 15;
    let y = event.clientY - rect.top + 15;
    
    // Prevent tooltip from going off-screen
    const tooltipRect = tooltip.getBoundingClientRect();
    if (x + tooltipRect.width > width) {
      x = event.clientX - rect.left - tooltipRect.width - 15;
    }
    if (y + tooltipRect.height > host.offsetHeight) {
      y = event.clientY - rect.top - tooltipRect.height - 15;
    }

    tooltip.style.left = `${Math.max(5, x)}px`;
    tooltip.style.top = `${Math.max(5, y)}px`;
    tooltip.style.display = 'block';
  }

  private updateRendererSize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    if (host && this.renderer) {
      this.renderer.setSize(host.offsetWidth, host.offsetHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    }
  }

  private startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      // Only rotate if not hovering and not focusing
      if (!this.isFocusing && !this.isHovering) {
        this.globeGroup.rotation.y += ROTATION_SPEED;
      }

      this.controls.update();
      this.updateLabelVisibility();
      this.renderer.render(this.scene, this.camera);
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

    const pin = this.createIconSprite('#388dfcff', 5, 5);
    pin.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));
    this.globeGroup.add(pin);
    
    setTimeout(() => {
      this.globeGroup.remove(pin);
      this.isFocusing = false;
    }, 2000);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
    
    // Trigger resize after fullscreen toggle
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}