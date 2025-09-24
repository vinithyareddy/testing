import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  OnDestroy,
  HostListener
} from '@angular/core';

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
};

const CUSTOM_GLOBE_COLOR = '#84c9f6';
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

  private svg: any;
  private projection: any;
  private countries!: FeatureCollection<Geometry, any>;
  private states!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, 0];
  private isRotating = true;
  private tooltip: any;
  private isDragging = false;
  private resizeObserver?: ResizeObserver;
  currentZoom: number = ZOOM.initial;
  private currentRadius = 300;

  // THREE.js fields
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private earthMesh?: THREE.Mesh;

  private countryLabelData: Array<{ feature: any; centroid: [number, number]; name: string }> = [];
  private stateLabelData: Array<{ feature: any; centroid: [number, number]; label: string }> = [];

  isMobile = false;
  isTablet = false;
  private mediaQueryMobile!: MediaQueryList;
  private mediaQueryTablet!: MediaQueryList;

  constructor(private http: HttpClient, private render: Renderer2) {
    this.setupMediaQueries();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkScreenSize();
    this.handleResize();
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
    this.initializeGlobe();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mediaQueryMobile) this.mediaQueryMobile.removeEventListener('change', () => this.updateResponsiveState());
    if (this.mediaQueryTablet) this.mediaQueryTablet.removeEventListener('change', () => this.updateResponsiveState());
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
    if (this.isMobile) this.legendCollapsed = false;
    if (this.svg) setTimeout(() => this.handleResize(), 100);
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width >= 768 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return 300;
    const minDimension = Math.min(container.offsetWidth, container.offsetHeight);
    if (this.isMobile) return Math.min(minDimension * 0.35, 150);
    if (this.isTablet) return Math.min(minDimension * 0.4, 200);
    return Math.min(minDimension * 0.45, 300);
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    // === THREE.js setup ===
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.z = this.currentRadius * 3;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    globeDiv.innerHTML = ''; // clear container
    globeDiv.appendChild(this.renderer.domElement);

    // Load texture
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('assets/images/globe-texture.png');
    const material = new THREE.MeshPhongMaterial({ map: earthTexture });
    const geometry = new THREE.SphereGeometry(this.currentRadius, 64, 64);
    this.earthMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.earthMesh);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x666666));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.isRotating && !this.isDragging && this.earthMesh) {
        this.earthMesh.rotation.y += ROTATION_SPEED * 0.005;
      }
      this.renderer?.render(this.scene!, this.camera!);
    };
    animate();

    // === D3 overlay for labels & tooltips ===
    d3.select(globeDiv).selectAll('svg').remove();
    this.svg = d3.select(globeDiv)
      .append('svg')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    d3.select(globeDiv).selectAll('.globe-tooltip').remove();
    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');
  }

  private handleResize() {
    if (!this.renderer || !this.camera || !this.scene || !this.svg) return;
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);

    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    this.updateCountryLabels();
    this.updateStateLabels();
  }

  private loadData() {
    this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills || Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply || Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng
      }));
      this.filteredList = [...this.countriesList];
      this.initializeCountryLabels();
      this.updateCountryLabels();
    });

    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(
        data,
        data.objects.ne_50m_admin_1_states_provinces
      ) as unknown as FeatureCollection<Geometry, any>;
      this.initializeStateLabels();
      this.updateStateLabels();
    });
  }

  private initializeCountryLabels() {
    this.countryLabelData = this.countries.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const name = feature.properties?.name;
        return name ? { feature, centroid, name } : null;
      })
      .filter((item): item is { feature: any; centroid: [number, number]; name: string } => item !== null);
  }

  private initializeStateLabels() {
    if (!this.states) return;
    this.stateLabelData = this.states.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const props = feature.properties;
        let label = props?.code_hasc || props?.iso_3166_2 || props?.name;
        if (label && label.includes(".")) label = label.split(".").pop();
        if (label && label.includes("-")) label = label.split("-").pop();
        return label ? { feature, centroid, label } : null;
      })
      .filter((item): item is { feature: any; centroid: [number, number]; label: string } => item !== null);
  }

  private updateCountryLabels() {
    if (!this.countryLabelData.length) return;
    this.svg.selectAll('.country-label').remove();
    this.countryLabelData.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;
      const [x, y] = projected;
      this.svg.append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${8 + this.currentZoom * 1.5}px`)
        .style('font-weight', '600')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('paint-order', 'stroke fill')
        .text(data.name);
    });
  }

  private updateStateLabels() {
    if (!this.stateLabelData.length) return;
    this.svg.selectAll('.state-label').remove();
    this.stateLabelData.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;
      const [x, y] = projected;
      this.svg.append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${6 + this.currentZoom}px`)
        .style('fill', '#2b2b2b')
        .style('stroke', 'white')
        .style('stroke-width', '0.5px')
        .style('paint-order', 'stroke fill')
        .text(data.label);
    });
  }

  private showTooltip(event: any, d: any) {
    const entry = this.countriesList.find(c => c.country === d.properties.name);
    if (entry) {
      const tooltipContent = `
        <div class="tooltip-header">
          <img class="flag-icon" src="assets/images/flags/${entry.code.toLowerCase()}.svg"/>
          <span>${entry.country}</span>
        </div>
        <div class="tooltip-row">
          <span class="label">Unique Skills</span>
          <span class="value">${entry.uniqueSkills}</span>
        </div>
        <div class="tooltip-row">
          <span class="label">Skill Supply (FTE)</span>
          <span class="value">${entry.skillSupply}</span>
        </div>
      `;
      this.tooltip.html(tooltipContent).style('display', 'block');
      this.tooltip.style('left', event.clientX + 'px').style('top', event.clientY + 'px');
    }
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  focusOnCountry(country: CountrySkill) {
    if (!country) return;
    this.isRotating = false;
    const projected = this.projection([country.lng, country.lat]);
    if (projected) {
      const fakeEvent = {
        clientX: projected[0] + this.globeContainer.nativeElement.getBoundingClientRect().left,
        clientY: projected[1] + this.globeContainer.nativeElement.getBoundingClientRect().top
      };
      const countryFeature = this.countries.features.find((f: any) => f.properties.name === country.country);
      if (countryFeature) this.showTooltip(fakeEvent, countryFeature);
    }
  }

  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(c =>
        c.country.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
  }

  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountryLabels();
    this.updateStateLabels();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountryLabels();
    this.updateStateLabels();
  }

  toggleLegend() {
    if (!this.isMobile) this.legendCollapsed = !this.legendCollapsed;
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) this.render.addClass(document.body, 'no-scroll');
    else this.render.removeClass(document.body, 'no-scroll');
    setTimeout(() => {
      this.handleResize();
      if (this.fullview && this.isMobile) this.legendCollapsed = false;
    }, 150);
  }
}
