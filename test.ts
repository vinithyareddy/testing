// Add these responsive mixins at the top
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 1025px) {
    @content;
  }
}

// Updated main container
.budget-card-box-lg {
  width: 100%;
  min-height: 400px;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: #fff;
    padding: 10px;
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    
    @include mobile {
      padding: 5px;
    }
  }
}

.budget-box-chart-lg {
  width: 100%;
  height: 100%;
}

// Responsive header section
.widget-heading {
  @include mobile {
    col-md-8: auto;
    width: 100% !important;
    margin-bottom: 10px;
    text-align: center;
    
    .title-with-icon {
      font-size: 14px;
      justify-content: center;
    }
  }
  
  @include tablet {
    font-size: 15px;
  }
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  @include mobile {
    width: 100% !important;
    justify-content: center;
    margin-top: 10px;
    gap: 15px;
  }
  
  i {
    font-size: 16px;
    cursor: pointer;
    
    @include mobile {
      font-size: 18px;
    }
  }
  
  .fa-expand {
    margin-top: 7px;
    color: #0071bc;
  }
  
  .ellipsis {
    cursor: pointer;
    font-size: 18px;
    margin-left: 12px;
    color: #0071bc;
    margin-top: 1px;
    
    @include mobile {
      margin-left: 0;
    }
  }
}

// Responsive globe wrapper
.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  color: #fff;
  position: relative;
  min-height: 400px;
  
  @include mobile {
    flex-direction: column;
    padding: 10px;
    min-height: 300px;
  }
  
  @include tablet {
    min-height: 500px;
  }
}

// Responsive globe container
.globe-container {
  width: 70%;
  height: 800px;
  aspect-ratio: 1 / 1;
  min-height: 300px;
  
  @include mobile {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
  
  @include tablet {
    width: 65%;
    height: 500px;
  }
  
  // Responsive SVG
  svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
  }
}

// Responsive zoom controls
.zoom-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;
  
  @include mobile {
    bottom: 10px;
    left: 10px;
    
    button {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }
  }
  
  button {
    background: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    margin: 2px 0;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    color: #214bcc;
    width: 40px;
    height: 40px;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    @include tablet {
      width: 38px;
      height: 38px;
      font-size: 18px;
    }
  }
}

// Responsive legend wrapper
.legend-wrapper {
  margin-top: 120px;
  margin-right: 20px;
  width: 25%;
  display: flex;
  flex-direction: column;
  
  @include mobile {
    width: 100%;
    margin-top: 0;
    margin-right: 0;
    max-height: 300px;
    overflow-y: auto;
  }
  
  @include tablet {
    width: 30%;
    margin-top: 50px;
  }
  
  &.scrollable {
    .legend-table {
      display: block;
      max-height: 500px;
      overflow-y: auto;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      background: #fff;
      
      @include mobile {
        max-height: 250px;
      }
      
      thead {
        position: sticky;
        top: 0;
        background: #f8f9fa;
        z-index: 1;
        display: table-header-group;
      }
      
      tbody {
        display: block;
      }
      
      tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
    }
  }
}

// Responsive legend title
.legend-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  color: #fff;
  
  @include mobile {
    font-size: 1rem;
    text-align: center;
    margin-bottom: 10px;
  }
  
  @include tablet {
    font-size: 1.1rem;
  }
}

// Responsive legend table
.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem;
  color: #000;
  border-radius: 0;
  margin-top: 0;
  
  @include mobile {
    font-size: 0.8rem;
  }
  
  th, td {
    padding: 10px;
    
    @include mobile {
      padding: 8px 5px;
    }
  }
  
  th:first-child {
    text-align: left !important;
    padding-left: 30px !important;
    
    @include mobile {
      padding-left: 15px !important;
    }
  }
  
  th.left {
    text-align: left;
  }
  
  th.right {
    text-align: right;
  }
  
  td.cost-col {
    text-align: right;
  }
  
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background-color: #f1f5f9;
    }
  }
}

// Responsive custom dropdown
.custom-dropdown {
  @include mobile {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .btn {
    padding: 2px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    width: 200px;
    
    @include mobile {
      width: 100%;
      max-width: 200px;
    }
  }
  
  .dropdown-menu {
    font-size: 14px;
    min-width: 140px;
    z-index: 2000 !important;
    display: block !important;
    position: absolute;
    margin-top: 4px;
    
    @include mobile {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 300px;
    }
  }
  
  .dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    i {
      color: #007bff;
    }
  }
}

// Responsive country scroll sections
.country-scroll-cell {
  padding: 0;
}

.country-scroll {
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #eee;
  
  @include mobile {
    max-height: 150px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    
    &:hover {
      background-color: #f1f5f9;
    }
  }
}

// Responsive flag and content
.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
  
  @include mobile {
    width: 16px;
    margin-right: 5px;
  }
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
  
  @include mobile {
    gap: 5px;
  }
}

// Responsive tooltip
:host ::ng-deep .tooltip-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  width: 160px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background: #fff;
  margin-left: 20px;
  
  @include mobile {
    width: 140px;
    font-size: 12px;
    margin-left: 10px;
  }
  
  .tooltip-row {
    padding: 6px 10px;
    
    @include mobile {
      padding: 5px 8px;
    }
  }
  
  .tooltip-header {
    background: #f4f6f9;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #000 !important;
    
    @include mobile {
      gap: 4px;
    }
  }
  
  .tooltip-body {
    background: #fff;
    color: #000;
    display: flex;
    justify-content: space-between;
  }
  
  img {
    width: 20px;
    height: 14px;
    border: 1px solid #ccc;
    
    @include mobile {
      width: 16px;
      height: 12px;
    }
  }
}

// Responsive view more section
.viewmore {
  @include mobile {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
  }
}

// Responsive header layout
.d-flex.justify-content-between {
  @include mobile {
    flex-direction: column !important;
    align-items: center !important;
    gap: 10px;
  }
}

// Additional mobile-specific styles
@include mobile {
  .col-md-8, .col-md-4 {
    width: 100% !important;
    max-width: 100% !important;
    flex: none !important;
  }
}



import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
import { LiftPopoverComponent } from '@lift/ui';

type CountryCost = {
  country: string;
  region: string;
  cost: number;
  code: string;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

const CUSTOM_GLOBE_COLOR = '#84c9f6';

const REGION_COLORS: Record<string, string> = {
  'North America': '#3c87d7',
  'South America': '#144c88',
  'Asia': '#343875ff',
  'Europe': '#375691ff',
  'Africa': '#83c083ff',
  'Oceania': '#9467bd',
  'Antarctic': '#8c564b',
  'Other': '#adcdee'
};

const COUNTRY_COLOR_RANGE: [string, string] = ['#8db4ddff', '#144c88'];
const STROKE_COLOR_COUNTRY = '#7e8790';
const FALLBACK_COLOR = '#e0e0e0';
const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule, LiftPopoverComponent],
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
  
  // Responsive properties
  private currentRadius = 300;
  private isMobile = false;
  private isTablet = false;
  
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(COUNTRY_COLOR_RANGE);

  constructor(private http: HttpClient) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    this.handleResize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    // Close dropdown when clicking outside
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
    
    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90);
      
    this.path = d3.geoPath().projection(this.projection);
    
    // Clear any existing SVG
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
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Clear any existing tooltip
    d3.select(globeDiv).selectAll('.tooltip-card').remove();
    
    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'tooltip-card')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.setupInteractions();
  }

  private handleResize() {
    if (!this.svg || !this.globeContainer) return;
    
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    
    this.currentRadius = this.getResponsiveRadius();
    
    // Update projection
    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);
    
    // Update SVG viewBox
    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    
    // Update globe circle
    this.svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius * this.currentZoom);
    
    // Redraw countries
    this.updateCountries();
  }

  private setupInteractions() {
    const zoom = d3.zoom()
      .scaleExtent([ZOOM.min, ZOOM.max])
      .filter((event: any) => {
        return event.type === 'wheel';
      })
      .on('zoom', (event: any) => {
        this.currentZoom = event.transform.k;
        this.projection.scale(this.currentRadius * event.transform.k);
        this.updateCountries();
      });

    const drag = d3.drag()
      .filter((event: any) => {
        return event.type !== 'wheel';
      })
      .on('start', (event: any) => {
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
      .on('end', (event: any) => {
        this.isDragging = false;
        setTimeout(() => {
          if (!this.isDragging) {
            this.isRotating = true;
          }
        }, 2000);
      });

    this.svg.call(zoom);
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

      const minCost = d3.min(this.laborData, (d: any) => d.cost) || 0;
      const maxCost = d3.max(this.laborData, (d: any) => d.cost) || 1;

      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minCost, maxCost])
        .range(COUNTRY_COLOR_RANGE);

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
      .attr('stroke', this.selectedView === 'By Country' ? STROKE_COLOR_COUNTRY : 'none')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => this.showTooltip(event, d))
      .on('mousemove', (event: any) => this.moveTooltip(event))
      .on('mouseout', () => this.hideTooltip());
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
        const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
        tooltipContent = `
          <div class="tooltip-row tooltip-header">
            <img src="${flagUrl}" />
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
    
    const offsetX = this.isMobile ? 10 : 15;
    const offsetY = this.isMobile ? 10 : 15;
    
    this.tooltip
      .style('left', (x + offsetX) + 'px')
      .style('top', (y + offsetY) + 'px');
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));

    this.svg.select('circle')
      .attr('r', this.currentRadius * this.currentZoom);
  }

  private getCountryColor(d: any): string {
    const countryName = d.properties.name;
    const entry = this.laborData.find(c => c.country === countryName);

    if (this.selectedView === 'By Region') {
      return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
    } else {
      return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
    }
  }

  private startRotation() {
    const rotate = () => {
      if (this.isRotating) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
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

  focusOnCountry(country: CountryCost) {
    if (!country) return;

    this.isRotating = false;
    const targetRotation = [-country.lng, -country.lat];
    this.currentRotation = targetRotation;
    this.projection.rotate(this.currentRotation);
    this.updateCountries();

    this.svg.selectAll('.country-marker').remove();
    const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

    const markerSize = this.isMobile ? 4 : 6;
    const marker = this.svg.append('circle')
      .attr('class', 'country-marker')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', markerSize)
      .attr('fill',