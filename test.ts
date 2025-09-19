import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';

type CountryCost = {
  country: string;
  region: string;
  cost: number;
  code: string;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

// -------------------- CONSTANTS -------------------- //
const GLOBE_RADIUS = { desktop: 300, tablet: 200, mobile: 150 };
const PIN_SIZE = { desktop: 30, mobile: 24 };
const ANIMATION = { appear: 400, fade: 600, duration: 3000 };
const STROKES = { globe: 1, country: 0.5, pin: 2 };

const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

// Colors now in SCSS, but still provide defaults if needed
const REGION_COLORS: Record<string, string> = {
  'North America': 'var(--region-north-america)',
  'South America': 'var(--region-south-america)',
  'Asia': 'var(--region-asia)',
  'Europe': 'var(--region-europe)',
  'Africa': 'var(--region-africa)',
  'Oceania': 'var(--region-oceania)',
  'Antarctic': 'var(--region-antarctic)',
  'Other': 'var(--region-other)'
};

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  laborData: CountryCost[] = [];
  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];
  countryList: CountryCost[] = [];

  private svg: any;
  private projection: any;
  private path: any;
  private countries!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, 0];
  private isRotating = true;
  private tooltip: any;
  private isDragging = false;
  private resizeObserver?: ResizeObserver;

  currentZoom: number = ZOOM.initial;
  isFullscreen = false;
  selectedView: string = 'By Region';
  showMenu: boolean = false;

  private currentRadius = GLOBE_RADIUS.desktop;
  private isMobile = false;
  private isTablet = false;

  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(['var(--country-color-min)', 'var(--country-color-max)']);

  constructor(private http: HttpClient) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.handleResize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (!event.target.closest('.custom-dropdown')) {
      this.showMenu = false;
    }
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width >= 768 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return GLOBE_RADIUS.desktop;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);

    if (this.isMobile) {
      return Math.min(minDimension * 0.35, GLOBE_RADIUS.mobile);
    } else if (this.isTablet) {
      return Math.min(minDimension * 0.4, GLOBE_RADIUS.tablet);
    } else {
      return Math.min(minDimension * 0.45, GLOBE_RADIUS.desktop);
    }
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

    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('class', 'globe-base');

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    d3.select(globeDiv).selectAll('.tooltip-card').remove();

    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'tooltip-card');
    this.setupInteractions();
  }

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

    this.svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius * this.currentZoom);

    this.updateCountries();
  }

  private setupInteractions() {
    const drag = d3.drag()
      .on('start', () => {
        this.isDragging = true;
        this.isRotating = false;
      })
      .on('drag', (event: any) => {
        const sensitivity = this.isMobile ? 0.4 : 0.25;
        this.currentRotation[0] += event.dx * sensitivity;
        this.currentRotation[1] -= event.dy * sensitivity;
        this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      })
      .on('end', () => {
        this.isDragging = false;
        setTimeout(() => {
          if (!this.isDragging) {
            this.isRotating = true;
          }
        }, 2000);
      });

    this.svg.select('circle').call(drag);
  }

  private loadData() {
    this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
      this.laborData = data.countries.map((c: any) => ({
        country: c.name,
        region: c.region,
        cost: c.cost ?? Math.floor(Math.random() * 2),
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, this.currentRadius)
      }));

      const minCost = d3.min(this.laborData, d => d.cost) || 0;
      const maxCost = d3.max(this.laborData, d => d.cost) || 1;

      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minCost, maxCost])
        .range(['var(--country-color-min)', 'var(--country-color-max)']);

      this.showRegionData();
      this.drawCountries();
      this.startRotation();
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
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        this.isRotating = false;
        this.showTooltip(event, d);
      })
      .on('mousemove', (event: any) => this.moveTooltip(event))
      .on('mouseout', () => {
        if (!this.isDragging) this.isRotating = true;
        this.hideTooltip();
      });
  }

  private showTooltip(event: any, d: any) {
    const entry = this.laborData.find(c => c.country === d.properties.name);
    if (entry) {
      let tooltipContent = '';
      if (this.selectedView === 'By Region') {
        const regionGroup = this.regionGroups.find(r => r.region === entry.region);
        const regionTotal = regionGroup ? regionGroup.total : entry.cost;
        tooltipContent = `
          <div class="tooltip-row tooltip-header">${entry.region}</div>
          <div class="tooltip-row tooltip-body">
            <span>Average Cost</span>
            <span><b>$${regionTotal}</b></span>
          </div>
        `;
      } else {
        tooltipContent = `
          <div class="tooltip-row tooltip-header">
            <span>${entry.country}</span>
          </div>
          <div class="tooltip-row tooltip-body">
            <span>Average Cost</span>
            <span><b>$${entry.cost}</b></span>
          </div>
        `;
      }
      this.tooltip.html(tooltipContent).style('display', 'block');
      this.moveTooltip(event);
    }
  }

  private moveTooltip(event: any) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const offset = this.isMobile ? 10 : 15;
    this.tooltip
      .style('left', `${x + offset}px`)
      .style('top', `${y + offset}px`);
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));
    this.svg.select('circle').attr('r', this.currentRadius * this.currentZoom);
  }

  private getCountryColor(d: any): string {
    const entry = this.laborData.find(c => c.country === d.properties.name);
    if (this.selectedView === 'By Region') {
      return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
    } else {
      return entry ? this.countryColorScale(entry.cost) : 'var(--country-fallback)';
    }
  }

  private startRotation() {
    const rotate = () => {
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }

  // Pin rendering
  focusOnCountry(country: CountryCost) {
    if (!country) return;
    this.isRotating = false;
    this.currentRotation = [-country.lng, -country.lat];
    this.projection.rotate(this.currentRotation);
    this.updateCountries();

    this.svg.selectAll('.country-marker').remove();

    const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];
    const pinSize = this.isMobile ? PIN_SIZE.mobile : PIN_SIZE.desktop;

    const pinGroup = this.svg.append('g').attr('class', 'country-marker');

    const pinPath = `
      M ${x} ${y}
      C ${x - pinSize / 2} ${y - pinSize / 2}
        ${x - pinSize / 2} ${y - pinSize}
        ${x} ${y - pinSize * 1.15}
      C ${x + pinSize / 2} ${y - pinSize}
        ${x + pinSize / 2} ${y - pinSize / 2}
        ${x} ${y}
      Z
    `;

    pinGroup.append('path').attr('class', 'pin-shadow').attr('d', pinPath);
    pinGroup.append('path').attr('class', 'pin-body').attr('d', pinPath);
    pinGroup.append('circle')
      .attr('class', 'pin-inner')
      .attr('cx', x)
      .attr('cy', y - pinSize * 0.8)
      .attr('r', pinSize * 0.25);

    pinGroup
      .style('opacity', 0)
      .transition()
      .duration(ANIMATION.appear)
      .style('opacity', 1);

    setTimeout(() => {
      pinGroup.transition()
        .duration(ANIMATION.fade)
        .style('opacity', 0)
        .on('end', () => pinGroup.remove());
      this.isRotating = true;
    }, ANIMATION.duration);
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }

  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountries();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountries();
  }

  setView(view: string) {
    this.selectedView = view;
    if (view === 'By Region') {
      this.showRegionData();
    } else {
      this.showCountryData();
    }
    this.drawCountries();
  }

  private showRegionData() {
    const grouped = this.laborData.reduce((acc, c) => {
      (acc[c.region] ||= []).push(c);
      return acc;
    }, {} as Record<string, CountryCost[]>);

    this.regionGroups = Object.entries(grouped).map(([region, arr]) => ({
      region,
      total: arr.reduce((s, x) => s + x.cost, 0),
      countries: arr,
      expanded: false
    }));

    this.countryList = [];
  }

  private showCountryData() {
    this.countryList = [...this.laborData].sort((a, b) => a.country.localeCompare(b.country));
    this.regionGroups = [];
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    setTimeout(() => this.handleResize(), 100);
  }

  trackByRegion(index: number, region: any): string {
    return region.region;
  }

  trackByCountry(index: number, country: CountryCost): string {
    return country.code;
  }
}


:root {
  --globe-color: #84c9f6;
  --country-stroke: #7e8790;
  --country-fallback: #e0e0e0;
  --country-color-min: #8db4ddff;
  --country-color-max: #144c88;

  --region-north-america: #3c87d7;
  --region-south-america: #144c88;
  --region-asia: #343875ff;
  --region-europe: #375691ff;
  --region-africa: #83c083ff;
  --region-oceania: #9467bd;
  --region-antarctic: #8c564b;
  --region-other: #adcdee;

  --pin-color: #1a73e8;
  --pin-outline: #fff;
  --pin-shadow: rgba(0, 0, 0, 0.2);
}

.globe-base {
  fill: var(--globe-color);
  stroke: #ccc;
  stroke-width: 1;
}

.country {
  stroke-width: 0.5;
}

.country-marker {
  .pin-shadow {
    fill: var(--pin-shadow);
  }
  .pin-body {
    fill: var(--pin-color);
    stroke: var(--pin-outline);
    stroke-width: 2;
  }
  .pin-inner {
    fill: #fff;
  }
}

.tooltip-card {
  position: absolute;
  pointer-events: none;
  display: none;
}
