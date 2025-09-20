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

  // Add these new properties for hover control
  private isHovering = false;
  private renderer!: THREE.WebGLRenderer;
  private resizeObserver!: ResizeObserver;
  private animationId!: number;

  // Responsive scaling factors
  private scaleFactor = 1;
  private isMobile = false;
  private isTablet = false;

  constructor(private http: HttpClient, private render: Renderer2) { }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.handleResize();
  }

  private updateResponsiveSettings() {
    const width = window.innerWidth;
    
    // Determine device type
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
    
    // Calculate scale factor based on screen size
    if (this.isMobile) {
      this.scaleFactor = 0.6;
    } else if (this.isTablet) {
      this.scaleFactor = 0.8;
    } else {
      this.scaleFactor = 1;
    }
  }

  private handleResize() {
    if (!this.renderer || !this.camera || !this.globeContainer) return;

    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    const height = host.offsetHeight;

    // Update responsive settings
    this.updateResponsiveSettings();

    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer size
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Adjust zoom based on screen size
    this.adjustZoomForScreenSize();

    // Update labels for new screen size
    this.addCountryLabels();
  }

  private adjustZoomForScreenSize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    let baseZoom = ZOOM.initial;
    
    // Adjust base zoom for smaller screens
    if (width < 480) {
      baseZoom = ZOOM.initial + 50; // Zoom out more on very small screens
    } else if (width < 768) {
      baseZoom = ZOOM.initial + 30; // Zoom out on mobile
    } else if (width < 1024) {
      baseZoom = ZOOM.initial + 20; // Slight zoom out on tablet
    }
    
    this.currentZoom = Math.max(Math.min(baseZoom, ZOOM.max), ZOOM.min);
    this.updateCameraZoom();
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
    
    // Scale font size based on screen size and scale factor
    const scaledFontSize = Math.max(12, fontSize * this.scaleFactor);
    
    context.font = `bold ${scaledFontSize}px Arial, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = scaledFontSize;
    const padding = 4 * this.scaleFactor;
    
    canvas.width = textWidth + (padding * 2);
    canvas.height = textHeight + (padding * 2);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `bold ${scaledFontSize}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(0, 0, 0, 0.9)';
    context.shadowBlur = 3 * this.scaleFactor;
    context.shadowOffsetX = 1 * this.scaleFactor;
    context.shadowOffsetY = 1 * this.scaleFactor;
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
    const baseScale = 3 * this.scaleFactor;
    const scaleX = Math.max(baseScale, textWidth * 0.015 * this.scaleFactor);
    const scaleY = baseScale * 0.8;
    sprite.scale.set(scaleX, scaleY, 1);
    return sprite;
  }

  private addCountryLabels() {
    if (this.labelGroup) this.globeGroup.remove(this.labelGroup);
    this.labelGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);

    // Show fewer labels on smaller screens to avoid clutter
    const maxLabels = this.isMobile ? 20 : this.isTablet ? 40 : this.filteredList.length;
    const countriesToShow = this.filteredList.slice(0, maxLabels);

    countriesToShow.forEach(country => {
      if (country.position) {
        const scaledFontSize = this.isMobile ? 20 : this.isTablet ? 24 : 26;
        const label = this.createTextSprite(country.code, '#ffffff', scaledFontSize);
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
    const size = 128;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = size;
    canvas.height = size;

    const scaledFontSize = (size - 16) * this.scaleFactor;
    ctx.font = `900 ${scaledFontSize}px "Font Awesome 6 Pro"`;
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
    const responsiveScaleX = scaleX * this.scaleFactor;
    const responsiveScaleY = scaleY * this.scaleFactor;
    sprite.scale.set(responsiveScaleX, responsiveScaleY, 1);
    return sprite;
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;
    
    const cameraPosition = this.camera.position.clone().normalize();
    const minDistance = this.isMobile ? 12 : this.isTablet ? 10 : 8; // Increase spacing on smaller screens

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
    this.updateResponsiveSettings();
    this.initializeGlobe();
    this.setupResizeObserver();
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

  private setupResizeObserver() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  private initializeGlobe() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile, alpha: true }); // Disable antialiasing on mobile for performance
    this.renderer.setSize(host.offsetWidth, host.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    // Create responsive tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.className = 'globe-tooltip';
    tooltip.style.zIndex = '2000';
    tooltip.style.display = 'none';
    tooltip.style.fontSize = this.isMobile ? '12px' : '14px';
    tooltip.style.maxWidth = this.isMobile ? '200px' : '300px';
    host.appendChild(tooltip);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    
    // Set initial camera position based on screen size
    this.adjustZoomForScreenSize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = this.isMobile ? 0.3 : 0.5; // Slower rotation on mobile
    this.controls.enableZoom = false;

    this.globe = new Globe().showGraticules(!this.isMobile).showAtmosphere(true); // Hide graticules on mobile for performance
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
    
    // Reduce sphere geometry complexity on mobile
    const sphereDetail = this.isMobile ? 50 : 75;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, sphereDetail, sphereDetail),
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

      const handleMouseMove = (event: MouseEvent) => {
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
          const maxHoverDistance = this.isMobile ? 20 : 15; // Increase hover distance on mobile

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

            const vector = closest.position!.clone().project(this.camera);
            const x = (vector.x * 0.5 + 0.5) * rect.width;
            const y = (-vector.y * 0.5 + 0.5) * rect.height;

            tooltip.innerHTML = `
              <div class="tooltip-header">
                <img class="flag-icon" src="assets/images/flags/${closest.code.toLowerCase()}.svg" style="width: ${this.isMobile ? '16px' : '20px'}; height: auto;"/>
                <span style="font-size: ${this.isMobile ? '12px' : '14px'};">${closest.country}</span>
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

            const offsetX = this.isMobile ? 10 : 15;
            const offsetY = this.isMobile ? 10 : 15;
            tooltip.style.left = `${Math.min(x + offsetX, rect.width - tooltip.offsetWidth - 10)}px`;
            tooltip.style.top = `${Math.min(y + offsetY, rect.height - tooltip.offsetHeight - 10)}px`;
            tooltip.style.display = 'block';
            return;
          }
        }

        this.isHovering = false;
        tooltip.style.display = 'none';
      };

      // Use touchstart and touchmove for mobile
      if (this.isMobile) {
        this.renderer.domElement.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            handleMouseMove({
              clientX: touch.clientX,
              clientY: touch.clientY,
              offsetX: touch.clientX - rect.left,
              offsetY: touch.clientY - rect.top
            } as MouseEvent);
          }
        });
      } else {
        this.renderer.domElement.addEventListener('mousemove', handleMouseMove);
      }

      this.renderer.domElement.addEventListener('mouseleave', () => {
        this.isHovering = false;
        tooltip.style.display = 'none';
      });
    });

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
    const zoomStep = this.isMobile ? ZOOM.step * 0.7 : ZOOM.step;
    this.currentZoom = Math.max(this.currentZoom - zoomStep, ZOOM.min);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  zoomOut() {
    const zoomStep = this.isMobile ? ZOOM.step * 0.7 : ZOOM.step;
    this.currentZoom = Math.min(this.currentZoom + zoomStep, ZOOM.max);
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

    const pinScale = this.isMobile ? 3 : 5;
    const pin = this.createIconSprite('#388dfcff', pinScale, pinScale);
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
    
    // Trigger resize after fullscreen change
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }
}