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
    // Remove zoom functionality - only keep drag for rotation
    const drag = d3.drag()
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

    // Apply drag to the globe circle
    this.svg.select('circle').call(drag);
    
    // Prevent default wheel behavior on the globe container to allow page scrolling
    this.globeContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      // Don't prevent default - this allows normal page scrolling
    }, { passive: true });
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
      .on('mouseover', (event: any, d: any) => {
        // Pause rotation only when hovering over a country
        this.isRotating = false;
        this.showTooltip(event, d);
      })
      .on('mousemove', (event: any) => this.moveTooltip(event))
      .on('mouseout', () => {
        // Resume rotation when leaving the country
        if (!this.isDragging) {
          this.isRotating = true;
        }
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
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      }
      // Always continue the animation loop, but only rotate when conditions are met
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

    // Remove any existing markers
    this.svg.selectAll('.country-marker').remove();
    
    // Get the projected coordinates
    const [x, y] = this.projection([country.lng, country.lat]) || [0, 0];

    // Create location pin group
    const pinSize = this.isMobile ? 24 : 30;
    const pinGroup = this.svg.append('g')
      .attr('class', 'country-marker');

    // Create perfect teardrop/pin shape with rounded top like Google Maps
    const pinPath = `
      M ${x} ${y}
      C ${x - pinSize/2} ${y - pinSize/3} 
        ${x - pinSize/2} ${y - pinSize * 0.7} 
        ${x - pinSize/2} ${y - pinSize}
      C ${x - pinSize/2} ${y - pinSize * 1.3} 
        ${x - pinSize/4} ${y - pinSize * 1.4} 
        ${x} ${y - pinSize * 1.4}
      C ${x + pinSize/4} ${y - pinSize * 1.4} 
        ${x + pinSize/2} ${y - pinSize * 1.3} 
        ${x + pinSize/2} ${y - pinSize}
      C ${x + pinSize/2} ${y - pinSize * 0.7} 
        ${x + pinSize/2} ${y - pinSize/3} 
        ${x} ${y}
      Z
    `;

    // Add pin shadow (slightly offset)
    pinGroup.append('path')
      .attr('d', `
        M ${x + 3} ${y + 3}
        C ${x - pinSize/2 + 3} ${y - pinSize/3 + 3} 
          ${x - pinSize/2 + 3} ${y - pinSize * 0.7 + 3} 
          ${x - pinSize/2 + 3} ${y - pinSize + 3}
        C ${x - pinSize/2 + 3} ${y - pinSize * 1.3 + 3} 
          ${x - pinSize/4 + 3} ${y - pinSize * 1.4 + 3} 
          ${x + 3} ${y - pinSize * 1.4 + 3}
        C ${x + pinSize/4 + 3} ${y - pinSize * 1.4 + 3} 
          ${x + pinSize/2 + 3} ${y - pinSize * 1.3 + 3} 
          ${x + pinSize/2 + 3} ${y - pinSize + 3}
        C ${x + pinSize/2 + 3} ${y - pinSize * 0.7 + 3} 
          ${x + pinSize/2 + 3} ${y - pinSize/3 + 3} 
          ${x + 3} ${y + 3}
        Z
      `)
      .attr('fill', '#000')
      .attr('opacity', 0.2);

    // Add main pin body (blue teardrop)
    pinGroup.append('path')
      .attr('d', pinPath)
      .attr('fill', '#1a73e8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add inner white circle (positioned in the round part)
    pinGroup.append('circle')
      .attr('cx', x)
      .attr('cy', y - pinSize * 0.8)
      .attr('r', pinSize * 0.25)
      .attr('fill', '#fff');

    // Simple smooth appearance animation (no jerky movement)
    pinGroup
      .style('opacity', 0)
      .style('transform', `scale(0.5)`)
      .style('transform-origin', `${x}px ${y}px`)
      .transition()
      .duration(400)
      .style('opacity', 1)
      .style('transform', 'scale(1)');

    // Remove marker after 3 seconds with smooth fade
    setTimeout(() => {
      pinGroup
        .transition()
        .duration(600)
        .style('opacity', 0)
        .on('end', () => pinGroup.remove());
      
      this.isRotating = true;
    }, 3000);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    
    // Small delay to allow DOM to update before recalculating
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }

  // TrackBy functions for better performance
  trackByRegion(index: number, region: any): string {
    return region.region;
  }

  trackByCountry(index: number, country: CountryCost): string {
    return country.code;
  }
}