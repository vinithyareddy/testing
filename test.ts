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

const CUSTOM_GLOBE_COLOR = '#70c7d9';
const STROKE_COLOR_COUNTRY = '#7e8790';
const FALLBACK_COLOR = '#e0e0e0';
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
  private countryLabelData: Array<{ feature: any, centroid: [number, number], name: string }> = [];
  private stateLabelData: Array<{ feature: any, centroid: [number, number], label: string }> = [];
  isMobile = false;
  isTablet = false;
  private mediaQueryMobile!: MediaQueryList;
  private mediaQueryTablet!: MediaQueryList;
  private readonly breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 };

  constructor(private http: HttpClient, private render: Renderer2) {
    this.setupMediaQueries();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.checkScreenSize();
    this.handleResize();
  }

  // ------------------------------
  // 🔹 Globe Initialization
  // ------------------------------
  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;

    this.currentRadius = this.getResponsiveRadius();

    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.projection.rotate([0, 0]);
    this.path = d3.geoPath().projection(this.projection);

    d3.select(globeDiv).selectAll('svg').remove();

    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // --- Base teal ocean circle
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // --- PNG overlay projected onto globe
    this.drawRasterGlobe(width, height); // 🔹 CHANGED

    d3.select(globeDiv).selectAll('.globe-tooltip').remove();
    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.setupInteractions();
  }

  // ------------------------------
  // 🔹 Raster globe (PNG overlay)
  // ------------------------------
  private drawRasterGlobe(width: number, height: number) {
    const clipId = 'globe-clip';

    this.svg.append('clipPath')
      .attr('id', clipId)
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius);

    this.svg.append('image')
      .attr('href', 'assets/images/transparent-globe.png') // your transparent PNG
      .attr('x', width / 2 - this.currentRadius)
      .attr('y', height / 2 - this.currentRadius)
      .attr('width', this.currentRadius * 2)
      .attr('height', this.currentRadius * 2)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('clip-path', `url(#${clipId})`)
      .attr('id', 'globe-image');
  }

  // ------------------------------
  // 🔹 Resize handling
  // ------------------------------
  private handleResize() {
    if (!this.svg || !this.globeContainer) return;
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;

    this.currentRadius = this.getResponsiveRadius();

    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);

    this.svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Resize teal circle
    this.svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius * this.currentZoom);

    // Resize raster PNG
    this.svg.select('#globe-image')
      .attr('x', width / 2 - this.currentRadius)
      .attr('y', height / 2 - this.currentRadius)
      .attr('width', this.currentRadius * 2)
      .attr('height', this.currentRadius * 2);

    this.updateCountries();
    this.updateStates();
  }

  // ------------------------------
  // 🔹 Rotation loop update
  // ------------------------------
  private startRotation() {
    const rotate = () => {
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);

        // 🔹 Rotate PNG overlay
        this.svg.select('#globe-image')
          .attr('transform', `rotate(${this.currentRotation[0]}, ${this.svg.attr('width')/2}, ${this.svg.attr('height')/2})`);

        this.updateCountries();
        this.updateStates();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }

  // -------------------------------------------------
  // 🔹 All your other existing methods remain the same
  // -------------------------------------------------
  // (drawCountries, drawStates, tooltips, zoom, etc.)
}
