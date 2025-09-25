// TypeScript Component
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
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

const GLOBE_TEAL_COLOR = '#20b2aa';
const STROKE_COLOR_COUNTRY = '#7e8790';
const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

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
  
  // Three.js properties
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private globe!: THREE.Mesh;
  private globeGroup!: THREE.Group;
  private labelGroup!: THREE.Group;
  private equatorLine!: THREE.Line;
  
  // D3 properties for projection calculations
  private projection: any;
  private path: any;
  private countries!: FeatureCollection<Geometry, any>;
  private states!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, 0];
  private isRotating = true;
  private tooltip: any;
  private isDragging = false;
  private resizeObserver?: ResizeObserver;
  currentZoom: number = ZOOM.initial;
  private currentRadius = 300;
  private oceans!: FeatureCollection<Geometry, any>;
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(['#d9ead3', '#38761d']);
  
  isMobile = false;
  isTablet = false;
  private mediaQueryMobile!: MediaQueryList;
  private mediaQueryTablet!: MediaQueryList;
  private readonly breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  constructor(private http: HttpClient, private render: Renderer2) {
    this.setupMediaQueries();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.checkScreenSize();
    this.handleResize();
  }

  private setupMediaQueries() {
    if (typeof window !== 'undefined') {
      this.mediaQueryMobile = window.matchMedia('(max-width: 767px)');
      this.mediaQueryTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
      this.updateResponsiveState();
      this.mediaQueryMobile.addEventListener('change', () => this.updateResponsiveState());
      this.mediaQueryTablet.addEventListener('change', () => this.updateResponsiveState());
    }
  }

  private updateResponsiveState() {
    this.isMobile = this.mediaQueryMobile?.matches || false;
    this.isTablet = this.mediaQueryTablet?.matches || false;
    if (this.isMobile) {
      this.legendCollapsed = false;
    }
    if (this.renderer) {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    }
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width >= 768 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return 300;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);
    if (this.isMobile) {
      return Math.min(minDimension * 0.35, 150);
    } else if (this.isTablet) {
      return Math.min(minDimension * 0.4, 200);
    } else {
      return Math.min(minDimension * 0.45, 300);
    }
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
    this.initializeGlobe();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.mediaQueryMobile) {
      this.mediaQueryMobile.removeEventListener('change', () => this.updateResponsiveState());
    }
    if (this.mediaQueryTablet) {
      this.mediaQueryTablet.removeEventListener('change', () => this.updateResponsiveState());
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);
    globeDiv.appendChild(this.renderer.domElement);

    // Create globe group
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // Create label group
    this.labelGroup = new THREE.Group();
    this.scene.add(this.labelGroup);

    // Initialize D3 projection for coordinate calculations
    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);
    this.projection.rotate([0, 0]);
    this.path = d3.geoPath().projection(this.projection);

    // Create globe with texture
    this.createGlobeWithTexture();

    // Setup tooltip
    this.setupTooltip(globeDiv);

    // Setup interactions
    this.setupInteractions();

    // Start render loop
    this.startRenderLoop();
  }

  private createGlobeWithTexture() {
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/images/globe-texture.png', (texture) => {
      // Create sphere geometry
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      
      // Create material with texture and teal tint
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1
      });

      // Create globe mesh
      this.globe = new THREE.Mesh(geometry, material);
      this.globeGroup.add(this.globe);

      // Add teal-colored base sphere (slightly smaller to show as base color)
      const baseGeometry = new THREE.SphereGeometry(1.99, 64, 64);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(GLOBE_TEAL_COLOR),
        transparent: true,
        opacity: 0.3
      });
      const baseSphere = new THREE.Mesh(baseGeometry, baseMaterial);
      this.globeGroup.add(baseSphere);

      // Create equator line
      this.createEquatorLine();
    });
  }

  private createEquatorLine() {
    const points = [];
    for (let i = 0; i <= 360; i += 2) {
      const angle = (i * Math.PI) / 180;
      const x = Math.cos(angle) * 2.01;
      const z = Math.sin(angle) * 2.01;
      points.push(new THREE.Vector3(x, -0.3, z)); // Slightly below equator
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: 0x7697a4,
      dashSize: 0.1,
      gapSize: 0.05,
      transparent: true,
      opacity: 0.8
    });

    this.equatorLine = new THREE.Line(geometry, material);
    this.equatorLine.computeLineDistances();
    this.globeGroup.add(this.equatorLine);
  }

  private setupTooltip(container: HTMLElement) {
    d3.select(container).selectAll('.globe-tooltip').remove();
    this.tooltip = d3.select(container)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');
  }

  private setupInteractions() {
    const canvas = this.renderer.domElement;
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('mousedown', (event) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      this.isDragging = true;
      this.isRotating = false;
    });

    canvas.addEventListener('mousemove', (event) => {
      if (!mouseDown) {
        this.handleMouseMove(event);
        return;
      }

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      const sensitivity = this.isMobile ? 0.004 : 0.0025;
      
      this.currentRotation[0] += deltaX * sensitivity * 180 / Math.PI;
      this.currentRotation[1] -= deltaY * sensitivity * 180 / Math.PI;
      this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));

      this.updateGlobeRotation();

      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    canvas.addEventListener('mouseup', () => {
      mouseDown = false;
      this.isDragging = false;
      setTimeout(() => {
        if (!this.isDragging) {
          this.isRotating = true;
        }
      }, 2000);
    });

    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -ZOOM.step : ZOOM.step;
      this.currentZoom = Math.max(ZOOM.min, Math.min(ZOOM.max, this.currentZoom + delta));
      this.updateGlobeScale();
    }, { passive: false });

    // Add touch support for mobile
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      if (event.touches.length === 1) {
        mouseDown = true;
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        this.isDragging = true;
        this.isRotating = false;
      }
    });

    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault();
      if (event.touches.length === 1 && mouseDown) {
        const deltaX = event.touches[0].clientX - mouseX;
        const deltaY = event.touches[0].clientY - mouseY;
        
        const sensitivity = 0.006;
        
        this.currentRotation[0] += deltaX * sensitivity * 180 / Math.PI;
        this.currentRotation[1] -= deltaY * sensitivity * 180 / Math.PI;
        this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));

        this.updateGlobeRotation();

        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
      }
    });

    canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      mouseDown = false;
      this.isDragging = false;
      setTimeout(() => {
        if (!this.isDragging) {
          this.isRotating = true;
        }
      }, 2000);
    });
  }

  private handleMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert screen coordinates to normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    // Create raycaster for detecting globe intersection
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    if (this.globe) {
      const intersects = raycaster.intersectObject(this.globe);
      
      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        
        // Convert 3D point to lat/lng
        const lat = Math.asin(intersectionPoint.y / 2) * 180 / Math.PI;
        const lng = Math.atan2(intersectionPoint.z, -intersectionPoint.x) * 180 / Math.PI;
        
        // Adjust for current rotation
        const adjustedLng = lng - this.currentRotation[0];
        const adjustedLat = lat - this.currentRotation[1];
        
        // Find nearest country
        const nearestCountry = this.findNearestCountry(adjustedLng, adjustedLat);
        
        if (nearestCountry) {
          this.isRotating = false;
          this.showTooltipForCountry(event, nearestCountry);
          this.renderer.domElement.style.cursor = 'pointer';
        } else {
          this.hideTooltip();
          this.renderer.domElement.style.cursor = 'grab';
        }
      } else {
        this.hideTooltip();
        this.renderer.domElement.style.cursor = 'grab';
      }
    }
  }

  private findNearestCountry(lng: number, lat: number): CountrySkill | null {
    let nearestCountry: CountrySkill | null = null;
    let minDistance = Infinity;
    const maxDistance = 10; // Maximum distance in degrees to consider a "hit"

    for (const country of this.countriesList) {
      const distance = Math.sqrt(
        Math.pow(country.lng - lng, 2) + Math.pow(country.lat - lat, 2)
      );
      
      if (distance < minDistance && distance < maxDistance) {
        minDistance = distance;
        nearestCountry = country;
      }
    }

    return nearestCountry;
  }

  private showTooltipForCountry(event: MouseEvent, country: CountrySkill) {
    const tooltipContent = `
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

    this.tooltip.html(tooltipContent).style('display', 'block');
    this.moveTooltip(event);
  }

  private updateGlobeRotation() {
    if (this.globeGroup) {
      this.globeGroup.rotation.y = this.currentRotation[0] * Math.PI / 180;
      this.globeGroup.rotation.x = this.currentRotation[1] * Math.PI / 180;
    }
    
    // Update D3 projection for coordinate calculations
    this.projection.rotate(this.currentRotation);
    this.updateLabels();
  }

  private updateGlobeScale() {
    if (this.globeGroup) {
      this.globeGroup.scale.setScalar(this.currentZoom);
    }
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateLabels();
  }

  private updateLabels() {
    // Clear existing labels
    this.labelGroup.clear();
    
    if (!this.countriesList.length) return;

    // Add country labels based on visibility and zoom level
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    this.countriesList.forEach(country => {
      if (this.shouldShowLabel(country)) {
        this.createCountryLabel(country, context);
      }
    });

    // Add ocean labels if zoom level is appropriate
    if (this.currentZoom >= 0.8) {
      this.addOceanLabels();
    }
  }

  private shouldShowLabel(country: CountrySkill): boolean {
    // Check if country is visible on current globe face
    const coords = [country.lng, country.lat];
    const projected = this.projection(coords);
    
    if (!projected) return false;
    
    // Check if point is visible (not on back side of globe)
    const isVisible = this.isPointVisible(coords);
    
    // Only show labels for larger countries or when zoomed in
    const shouldShow = this.currentZoom > 1.2 || country.uniqueSkills > 30;
    
    return isVisible && shouldShow;
  }

  private createCountryLabel(country: CountrySkill, context: CanvasRenderingContext2D) {
    // Convert lat/lng to 3D position on sphere
    const phi = (90 - country.lat) * Math.PI / 180;
    const theta = (country.lng + 180) * Math.PI / 180;
    
    // Apply current rotation
    const rotatedTheta = theta + (this.currentRotation[0] * Math.PI / 180);
    const rotatedPhi = phi + (this.currentRotation[1] * Math.PI / 180);
    
    const x = -(2.15 * Math.sin(rotatedPhi) * Math.cos(rotatedTheta));
    const y = 2.15 * Math.cos(rotatedPhi);
    const z = 2.15 * Math.sin(rotatedPhi) * Math.sin(rotatedTheta);

    // Create text sprite
    const fontSize = Math.max(24, Math.min(48, 32 + this.currentZoom * 8));
    context.font = `${fontSize}px Arial, sans-serif`;
    context.fillStyle = '#ffffff';
    context.strokeStyle = '#000000';
    context.lineWidth = 3;
    
    const textMetrics = context.measureText(country.country);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    
    const canvas = document.createElement('canvas');
    canvas.width = textWidth + 20;
    canvas.height = textHeight + 10;
    const ctx = canvas.getContext('2d')!;
    
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    
    ctx.strokeText(country.country, 10, textHeight - 5);
    ctx.fillText(country.country, 10, textHeight - 5);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.1
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    sprite.position.set(x, y, z);
    sprite.scale.set(2, 1, 1);
    
    this.labelGroup.add(sprite);
  }

  private addOceanLabels() {
    // Add major ocean labels
    const oceanLabels = [
      { name: 'Pacific Ocean', lat: 0, lng: -160 },
      { name: 'Atlantic Ocean', lat: 0, lng: -30 },
      { name: 'Indian Ocean', lat: -10, lng: 80 },
      { name: 'Arctic Ocean', lat: 80, lng: 0 }
    ];

    oceanLabels.forEach(ocean => {
      if (this.isPointVisible([ocean.lng, ocean.lat])) {
        this.createOceanLabel(ocean.name, ocean.lat, ocean.lng);
      }
    });
  }

  private createOceanLabel(name: string, lat: number, lng: number) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    
    const rotatedTheta = theta + (this.currentRotation[0] * Math.PI / 180);
    const rotatedPhi = phi + (this.currentRotation[1] * Math.PI / 180);
    
    const x = -(2.05 * Math.sin(rotatedPhi) * Math.cos(rotatedTheta));
    const y = 2.05 * Math.cos(rotatedPhi);
    const z = 2.05 * Math.sin(rotatedPhi) * Math.sin(rotatedTheta);

    const fontSize = 32;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 60;
    const ctx = canvas.getContext('2d')!;
    
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#1a4b7a';
    ctx.globalAlpha = 0.7;
    ctx.textAlign = 'center';
    
    ctx.fillText(name, 200, 40);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      alphaTest: 0.1
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    sprite.position.set(x, y, z);
    sprite.scale.set(3, 0.75, 1);
    
    this.labelGroup.add(sprite);
  }

  private startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.updateGlobeRotation();
      }
      
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private handleResize() {
    if (!this.renderer || !this.globeContainer) return;

    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    
    this.currentRadius = this.getResponsiveRadius();
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    
    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);
      
    this.updateLabels();
  }

  // Keep all existing methods for data loading and interaction
  private loadData() {
    this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng,
      }));

      const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
      const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minSkills, maxSkills])
        .range(['#f5f0e4', '#87c3ab']);

      this.filteredList = [...this.countriesList];
      this.updateLabels();
    });

    // Load other data (countries, states, oceans) for coordinate calculations
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;
  }

  private isPointVisible(centroid: [number, number] | number[]): boolean {
    const projected = this.projection(centroid);
    if (!projected) return false;

    const [lng, lat] = centroid;
    if (lng === undefined || lat === undefined) return false;
    
    const lambda = (lng * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const rotLambda = (this.currentRotation[0] * Math.PI) / 180;
    const rotPhi = (this.currentRotation[1] * Math.PI) / 180;

    const adjustedLng = lambda + rotLambda;
    const cosPhi = Math.cos(phi + rotPhi);
    const cosLambda = Math.cos(adjustedLng);
    const dotProduct = cosPhi * cosLambda;

    return dotProduct > 0;
  }

  // Keep all existing UI interaction methods
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
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateGlobeScale();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateGlobeScale();
  }

  toggleLegend() {
    if (!this.isMobile) {
      this.legendCollapsed = !this.legendCollapsed;
    }
  }

  focusOnCountry(country: CountrySkill) {
    if (!country) return;

    this.isRotating = false;
    
    // Calculate target rotation to center the country
    const targetRotation = [-country.lng, -country.lat];
    
    // Animate to the target rotation
    this.animateToRotation(targetRotation, () => {
      // Show highlight and tooltip after animation
      this.highlightCountry(country);
      this.showCountryTooltip(country);
    });
  }

  private animateToRotation(targetRotation: number[], onComplete?: () => void) {
    const startRotation = [...this.currentRotation];
    const duration = 1000; // 1 second animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate rotation
      this.currentRotation[0] = startRotation[0] + (targetRotation[0] - startRotation[0]) * easeProgress;
      this.currentRotation[1] = startRotation[1] + (targetRotation[1] - startRotation[1]) * easeProgress;

      this.updateGlobeRotation();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    animate();
  }

  private highlightCountry(country: CountrySkill) {
    // Remove any existing highlight
    const existingHighlight = this.scene.getObjectByName('country-highlight');
    if (existingHighlight) {
      this.scene.remove(existingHighlight);
    }

    // Create highlight ring around country location
    const phi = (90 - country.lat) * Math.PI / 180;
    const theta = (country.lng + 180) * Math.PI / 180;
    
    const rotatedTheta = theta + (this.currentRotation[0] * Math.PI / 180);
    const rotatedPhi = phi + (this.currentRotation[1] * Math.PI / 180);
    
    const x = -(2.1 * Math.sin(rotatedPhi) * Math.cos(rotatedTheta));
    const y = 2.1 * Math.cos(rotatedPhi);
    const z = 2.1 * Math.sin(rotatedPhi) * Math.sin(rotatedTheta);

    // Create pulsing ring geometry
    const ringGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });

    const highlight = new THREE.Mesh(ringGeometry, ringMaterial);
    highlight.position.set(x, y, z);
    highlight.lookAt(0, 0, 0); // Face the center of the globe
    highlight.name = 'country-highlight';

    this.scene.add(highlight);

    // Animate the highlight (pulsing effect)
    let pulseDirection = 1;
    let pulseScale = 1;

    const pulseAnimation = () => {
      pulseScale += pulseDirection * 0.02;
      if (pulseScale > 1.3) {
        pulseDirection = -1;
      } else if (pulseScale < 0.8) {
        pulseDirection = 1;
      }

      if (highlight.parent) {
        highlight.scale.setScalar(pulseScale);
        requestAnimationFrame(pulseAnimation);
      }
    };

    pulseAnimation();

    // Remove highlight after 3 seconds
    setTimeout(() => {
      if (highlight.parent) {
        this.scene.remove(highlight);
      }
      this.isRotating = true;
    }, 3000);
  }

  private showCountryTooltip(country: CountrySkill) {
    const tooltipContent = `
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

    this.tooltip.html(tooltipContent).style('display', 'block');
    
    // Position tooltip at center of screen
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    this.tooltip
      .style('left', (centerX + 20) + 'px')
      .style('top', (centerY - 50) + 'px');

    setTimeout(() => {
      this.hideTooltip();
    }, 3000);
  }

  private showTooltip(event: any, country: CountrySkill) {
    const tooltipContent = `
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

    this.tooltip.html(tooltipContent).style('display', 'block');
    this.moveTooltip(event);
  }

  private moveTooltip(event: any) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const offsetX = this.isMobile ? 10 : 15;
    const offsetY = this.isMobile ? 10 : 15;

    this.tooltip
      .style('left', (x + offsetX) + 'px')
      .style('top', (y + offsetY) + 'px');
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }

    setTimeout(() => {
      this.handleResize();
      if (this.fullview && this.isMobile) {
        this.legendCollapsed = false;
      }
    }, 150);
  }
}