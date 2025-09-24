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
  position?: THREE.Vector3;
};

const CUSTOM_GLOBE_COLOR = '#84c9f6';
const STROKE_COLOR_COUNTRY = '#7e8790';
const STROKE_COLOR_STATE = '#999';
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

  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(['#8db4ddff', '#144c88']);

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
    if (this.mediaQueryMobile) {
      this.mediaQueryMobile.removeEventListener('change', () => this.updateResponsiveState());
    }
    if (this.mediaQueryTablet) {
      this.mediaQueryTablet.removeEventListener('change', () => this.updateResponsiveState());
    }
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
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);
    if (this.isMobile) return Math.min(minDimension * 0.35, 150);
    if (this.isTablet) return Math.min(minDimension * 0.4, 200);
    return Math.min(minDimension * 0.45, 300);
  }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const v = new THREE.Vector3(x, y, z);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    return v;
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

    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    d3.select(globeDiv).selectAll('svg').remove();

    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Glow shadow around globe
    const defs = this.svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', 15)
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .style('filter', 'url(#glow)');

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.setupInteractions();
  }

  private setupInteractions() {
    const drag = d3.drag()
      .on('start', () => { this.isDragging = true; this.isRotating = false; })
      .on('drag', (event: any) => {
        const sensitivity = this.isMobile ? 0.4 : 0.25;
        this.currentRotation[0] += event.dx * sensitivity;
        this.currentRotation[1] -= event.dy * sensitivity;
        this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
        this.updateStates();
      })
      .on('end', () => {
        this.isDragging = false;
        setTimeout(() => { if (!this.isDragging) this.isRotating = true; }, 2000);
      });

    this.svg.select('circle').call(drag);
  }

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
        position: this.latLngToVector3(c.lat, c.lng, this.currentRadius)
      }));

      const minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
      const maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minSkills, maxSkills])
        .range(['#8db4ddff', '#144c88']);

      this.filteredList = [...this.countriesList];
      this.drawCountries();
      this.startRotation();
    });

    // Load states
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(
        data,
        data.objects['ne_50m_admin_1_states_provinces']
      ) as unknown as FeatureCollection<Geometry, any>;
      this.drawStates();
    });
  }

  private drawCountries() {
    this.svg.selectAll('.country').remove();

    this.svg.selectAll('.country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d))
      .attr('stroke', STROKE_COLOR_COUNTRY)
      .attr('stroke-width', 0.5);

    this.addCountryLabels();
  }

  private drawStates() {
    if (!this.states) return;

    this.svg.selectAll('.state').remove();

    this.svg.selectAll('.state')
      .data(this.states.features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', this.path)
      .attr('fill', 'transparent')
      .attr('stroke', STROKE_COLOR_STATE)
      .attr('stroke-width', 0.4);

    this.addStateLabels();
  }

  private addStateLabels() {
    if (!this.states) return;
    this.svg.selectAll('.state-label').remove();

    this.states.features.forEach((d: any) => {
      const centroid = this.path.centroid(d);
      if (!centroid) return;

      const [x, y] = centroid;
      const props = d.properties;
      const label = props.iso_3166_2 || props.name;

      this.svg.append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', this.isMobile ? '5px' : '7px')
        .style('fill', '#333')
        .style('pointer-events', 'none')
        .text(label);
    });
  }

  private addCountryLabels() {
    this.svg.selectAll('.country-label').remove();

    this.countries.features.forEach((d: any) => {
      const centroid = this.path.centroid(d);
      if (!centroid) return;

      const [x, y] = centroid;
      const props = d.properties;
      const label = props.name;

      this.svg.append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', this.isMobile ? '8px' : '10px')
        .style('font-weight', '600')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('paint-order', 'stroke fill')
        .text(label);
    });
  }

  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));

    this.addCountryLabels();
  }

  private updateStates() {
    if (!this.states) return;
    this.svg.selectAll('.state').attr('d', this.path);
    this.addStateLabels();
  }

  private getCountryColor(d: any): string {
    const countryName = d.properties.name;
    const entry = this.countriesList.find(c => c.country === countryName);
    return entry ? this.countryColorScale(entry.uniqueSkills) : FALLBACK_COLOR;
  }

  private startRotation() {
    const rotate = () => {
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
        this.updateStates();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }

  // other existing methods remain unchanged...
}
