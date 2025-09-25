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
  HostListener,
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
  position?: THREE.Vector3;
};

const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss'],
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
  private path: any;
  private countries!: FeatureCollection<Geometry, any>;
  private states!: FeatureCollection<Geometry, any>;
  private oceans!: FeatureCollection<Geometry, any>;

  private currentRotation = [0, 0];
  private isRotating = true;
  private isDragging = false;
  private resizeObserver?: ResizeObserver;

  currentZoom: number = ZOOM.initial;
  private currentRadius = 300;

  private tooltip: any;

  // --- Three.js stuff ---
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private globe!: THREE.Mesh;

  private countryLabelData: Array<{
    feature: any;
    centroid: [number, number];
    name: string;
  }> = [];
  private stateLabelData: Array<{
    feature: any;
    centroid: [number, number];
    label: string;
  }> = [];

  constructor(private http: HttpClient, private render: Renderer2) {}

  @HostListener('window:resize')
  onWindowResize() {
    this.handleResize();
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
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return 300;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);
    return Math.min(minDimension * 0.45, 300);
  }

  // --- Setup Globe with Three.js + D3 overlay ---
  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;

    this.currentRadius = this.getResponsiveRadius();

    // --- Setup Three.js scene ---
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.z = this.currentRadius * 3;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    globeDiv.innerHTML = '';
    globeDiv.appendChild(this.renderer.domElement);

    // --- Load Texture Globe ---
    const texture = new THREE.TextureLoader().load(
      'assets/images/transparent-globe.png'
    );
    const geometry = new THREE.SphereGeometry(this.currentRadius, 64, 64);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // --- Setup D3 projection (for labels) ---
    this.projection = d3
      .geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    // --- Create SVG overlay for labels ---
    d3.select(globeDiv).selectAll('svg').remove();
    this.svg = d3
      .select(globeDiv)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0');

    // --- Tooltip for hover ---
    d3.select(globeDiv).selectAll('.globe-tooltip').remove();
    this.tooltip = d3
      .select(globeDiv)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.setupInteractions();
    this.startRotation();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  private handleResize() {
    if (!this.renderer || !this.camera) return;
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

    this.svg.attr('width', width).attr('height', height);
  }

  // --- Animate Globe & Labels ---
  private startRotation() {
    const animate = () => {
      requestAnimationFrame(animate);

      if (this.isRotating && !this.isDragging) {
        this.globe.rotation.y += ROTATION_SPEED * 0.01;
      }

      // Sync D3 projection with globe rotation
      const rotation = this.globe.rotation.y * (180 / Math.PI);
      this.projection.rotate([rotation, 0]);

      this.updateCountryLabels();
      this.updateStateLabels();

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  // --- Mouse interactions ---
  private setupInteractions() {
    let lastX = 0;
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      lastX = e.clientX;
      this.isRotating = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - lastX;
        lastX = e.clientX;
        this.globe.rotation.y += deltaX * 0.005;
      }
    });
    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isRotating = true;
    });
    this.renderer.domElement.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) this.zoomIn();
      else this.zoomOut();
    });
  }

  // --- Data Loading ---
  private loadData() {
    this.http.get<any>('assets/json/world-globe-data.json').subscribe((data) => {
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
      }));

      this.filteredList = [...this.countriesList];

      this.countries = topojson.feature(
        worldData as any,
        (worldData as any).objects.countries
      ) as unknown as FeatureCollection<Geometry, any>;

      this.initializeCountryLabels();
    });

    this.http.get<any>('assets/json/globe-states.json').subscribe((data) => {
      this.states = topojson.feature(
        data,
        data.objects.ne_50m_admin_1_states_provinces
      ) as unknown as FeatureCollection<Geometry, any>;

      this.initializeStateLabels();
    });

    this.http.get<any>('assets/json/oceans.json').subscribe((data) => {
      this.oceans = data;
    });
  }

  private initializeCountryLabels() {
    this.countryLabelData = this.countries.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const name = feature.properties?.name;
        return name ? { feature, centroid, name } : null;
      })
      .filter(
        (
          item
        ): item is { feature: any; centroid: [number, number]; name: string } =>
          item !== null
      );
  }

  private initializeStateLabels() {
    if (!this.states) return;
    this.stateLabelData = this.states.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const props = feature.properties;
        let label = props?.code_hasc || props?.iso_3166_2 || props?.name;

        if (label && label.includes('.')) label = label.split('.').pop();
        if (label && label.includes('-')) label = label.split('-').pop();

        return label ? { feature, centroid, label } : null;
      })
      .filter(
        (
          item
        ): item is { feature: any; centroid: [number, number]; label: string } =>
          item !== null
      );
  }

  // --- Labels ---
  private updateCountryLabels() {
    if (!this.countryLabelData.length) return;

    this.svg.selectAll('.country-label').remove();

    const visibleLabels = this.countryLabelData.filter((data) => {
      const projected = this.projection(data.centroid);
      return projected !== null;
    });

    visibleLabels.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;
      const [x, y] = projected;

      const fontSize = 10;

      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('fill', '#fff')
        .style('stroke', '#000')
        .style('stroke-width', '0.5px')
        .text(data.name);
    });
  }

  private updateStateLabels() {
    if (!this.stateLabelData.length) return;

    this.svg.selectAll('.state-label').remove();

    const visibleLabels = this.stateLabelData.filter((data) => {
      const projected = this.projection(data.centroid);
      return projected !== null;
    });

    visibleLabels.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;
      const [x, y] = projected;

      this.svg
        .append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', '7px')
        .style('font-weight', '400')
        .style('fill', '#eee')
        .style('stroke', '#000')
        .style('stroke-width', '0.4px')
        .text(data.label);
    });
  }

  // --- Tooltip logic ---
  private showTooltip(event: any, d: any) {
    const entry = this.countriesList.find((c) => c.country === d.properties.name);
    if (entry) {
      const tooltipContent = `
        <div class="tooltip-header">
          <img class="flag-icon" src="assets/images/flags/${entry.code.toLowerCase()}.svg"/>
          <span>${entry.country}</span>
        </div>
        <div class="tooltip-row"><span class="label">Unique Skills</span>
        <span class="value">${entry.uniqueSkills}</span></div>
        <div class="tooltip-row"><span class="label">Skill Supply (FTE)</span>
        <span class="value">${entry.skillSupply}</span></div>
      `;
      this.tooltip.html(tooltipContent).style('display', 'block');
      this.moveTooltip(event);
    }
  }

  private moveTooltip(event: any) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.tooltip.style('left', x + 10 + 'px').style('top', y + 10 + 'px');
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  // --- Zoom ---
  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.projection.scale(this.currentRadius * this.currentZoom);
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
  }

  // --- Focus on country ---
  focusOnCountry(country: CountrySkill) {
    if (!country) return;
    this.isRotating = false;
    const targetRotation = -country.lng * (Math.PI / 180);
    this.globe.rotation.y = targetRotation;
  }

  // --- Fullscreen toggle ---
  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
    setTimeout(() => {
      this.handleResize();
    }, 150);
  }
}
