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
  }

  private handleMouseMove(event: MouseEvent) {
    // Handle hover effects and tooltip positioning
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert screen coordinates to world coordinates for country detection
    const mouse = new THREE.Vector2();
    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    // Raycasting logic would go here for precise country detection
    // For now, we'll use the existing tooltip positioning
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
    this.countriesList.forEach(country => {
      if (this.shouldShowLabel(country)) {
        this.createCountryLabel(country);
      }
    });
  }

  private shouldShowLabel(country: CountrySkill): boolean {
    // Check if country is visible on current globe face
    const coords = [country.lng, country.lat];
    const projected = this.projection(coords);
    
    if (!projected) return false;
    
    // Check if point is visible (not on back side of globe)
    return this.isPointVisible(coords);
  }

  private createCountryLabel(country: CountrySkill) {
    // Convert lat/lng to 3D position on sphere
    const phi = (90 - country.lat) * Math.PI / 180;
    const theta = (country.lng + 180) * Math.PI / 180;
    
    const x = -(2.1 * Math.sin(phi) * Math.cos(theta));
    const y = 2.1 * Math.cos(phi);
    const z = 2.1 * Math.sin(phi) * Math.sin(theta);

    // Create label sprite (simplified - you might want to use actual text sprites)
    const labelDiv = document.createElement('div');
    labelDiv.textContent = country.country;
    labelDiv.style.position = 'absolute';
    labelDiv.style.fontSize = '10px';
    labelDiv.style.color = '#111';
    labelDiv.style.fontWeight = '600';
    labelDiv.style.pointerEvents = 'none';
    
    // Position would need proper 3D to 2D projection
    // This is a simplified version
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
    const targetRotation = [-country.lng, -country.lat];
    this.currentRotation = targetRotation;
    this.updateGlobeRotation();

    // Show tooltip for focused country
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

    setTimeout(() => {
      this.hideTooltip();
      this.isRotating = true;
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