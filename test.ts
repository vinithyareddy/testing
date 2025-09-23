import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
import { LiftPopoverComponent } from '@lift/ui';

type SkillSupplyData = {
  country: string;
  region: string;
  code: string;
  lat: number;
  lng: number;
  uniqueSkills: number;
  skillSupply: number;
  isVisible?: boolean;
  labelSize?: 'major' | 'normal' | 'small';
};

const GLOBE_COLORS = {
  background: ['#4A9CB8', '#2E7D8A', '#1E5F73'],
  countries: {
    default: 'rgba(255, 255, 255, 0.3)',
    hover: 'rgba(255, 255, 255, 0.5)',
    highlighted: 'rgba(255, 193, 7, 0.4)'
  },
  stroke: {
    default: 'rgba(255, 255, 255, 0.5)',
    hover: 'rgba(255, 255, 255, 0.8)',
    highlighted: '#ffc107'
  },
  graticule: 'rgba(255, 255, 255, 0.2)',
  labels: '#fff'
};

const ROTATION_SPEED = 0.3;
const ZOOM_CONFIG = { initial: 1, step: 0.2, min: 0.8, max: 4 };
const HIGHLIGHT_DURATION = 4000;
const GRATICULE_STEP = 20;

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // Data Properties
  skillData: SkillSupplyData[] = [];
  filteredCountries: SkillSupplyData[] = [];
  searchTerm: string = '';
  selectedCountry: SkillSupplyData | null = null;

  // Globe Properties
  private svg: any;
  private projection: any;
  private path: any;
  private graticule: any;
  private countries!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, -10];
  private isRotating = true;
  private isDragging = false;
  private tooltip: any;
  private currentZoom: number = ZOOM_CONFIG.initial;
  private currentRadius = 280;
  private resizeObserver?: ResizeObserver;
  private highlightTimer?: number;

  // UI Properties
  isFullscreen = false;
  private isMobile = false;
  private isTablet = false;

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
    // Handle outside clicks if needed
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width >= 768 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return 280;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);
    
    if (this.isMobile) {
      return Math.min(minDimension * 0.35, 140);
    } else if (this.isTablet) {
      return Math.min(minDimension * 0.4, 200);
    } else {
      return Math.min(minDimension * 0.45, 280);
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
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
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

    // Setup projection and path
    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(this.currentRotation);

    this.path = d3.geoPath().projection(this.projection);

    // Setup graticule (grid lines)
    this.graticule = d3.geoGraticule()
      .step([GRATICULE_STEP, GRATICULE_STEP]);

    // Clear existing SVG
    d3.select(globeDiv).selectAll('svg').remove();

    // Create main SVG
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add gradient definition
    const defs = this.svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'globeGradient')
      .attr('cx', '30%')
      .attr('cy', '30%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', GLOBE_COLORS.background[0]);
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', GLOBE_COLORS.background[1]);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', GLOBE_COLORS.background[2]);

    // Add globe sphere
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('fill', 'url(#globeGradient)')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1);

    // Add graticule (grid lines)
    this.svg.append('path')
      .datum(this.graticule)
      .attr('class', 'globe-graticule')
      .attr('d', this.path)
      .attr('stroke', GLOBE_COLORS.graticule)
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');

    // Load world data
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Setup tooltip
    this.setupTooltip(globeDiv);
    
    // Setup interactions
    this.setupInteractions();
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
        this.updateGlobe();
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
      // Transform the data to match our interface
      this.skillData = data.countries.map((c: any) => ({
        country: c.name,
        region: c.region,
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        uniqueSkills: Math.floor(Math.random() * 80) + 20, // Dummy data
        skillSupply: Math.floor(Math.random() * 50) + 5,   // Dummy data
        isVisible: true,
        labelSize: this.determineLabelSize(c.name)
      }));

      this.filteredCountries = [...this.skillData].sort((a, b) => 
        b.skillSupply - a.skillSupply
      );

      this.drawCountries();
      this.drawCountryLabels();
      this.startRotation();
    });
  }

  private determineLabelSize(countryName: string): 'major' | 'normal' | 'small' {
    const majorCountries = [
      'United States', 'China', 'India', 'Brazil', 'Russia', 
      'Canada', 'Australia', 'Germany', 'France', 'United Kingdom', 
      'Japan', 'South Africa', 'Mexico', 'Argentina', 'Egypt'
    ];
    
    const normalCountries = [
      'Spain', 'Italy', 'Turkey', 'Poland', 'Ukraine', 'Iran', 
      'Thailand', 'Myanmar', 'Kenya', 'Tanzania', 'Nigeria', 
      'Colombia', 'Venezuela', 'Peru', 'Chile', 'Kazakhstan'
    ];

    if (majorCountries.includes(countryName)) return 'major';
    if (normalCountries.includes(countryName)) return 'normal';
    return 'small';
  }

  private drawCountries() {
    this.svg.selectAll('.globe-country').remove();

    this.svg.selectAll('.globe-country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'globe-country')
      .attr('d', this.path)
      .attr('fill', GLOBE_COLORS.countries.default)
      .attr('stroke', GLOBE_COLORS.stroke.default)
      .attr('stroke-width', 0.3)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        this.handleCountryHover(event, d);
      })
      .on('mousemove', (event: any) => {
        this.moveTooltip(event);
      })
      .on('mouseout', () => {
        this.hideTooltip();
        if (!this.isDragging) {
          this.isRotating = true;
        }
      })
      .on('click', (event: any, d: any) => {
        this.handleCountryClick(d);
      });
  }

  private drawCountryLabels() {
    this.svg.selectAll('.globe-country-label').remove();

    const labels = this.svg.selectAll('.globe-country-label')
      .data(this.skillData.filter(d => d.isVisible))
      .enter()
      .append('text')
      .attr('class', (d: SkillSupplyData) => `globe-country-label ${d.labelSize}-country`)
      .text((d: SkillSupplyData) => d.country)
      .attr('font-size', (d: SkillSupplyData) => {
        if (d.labelSize === 'major') return '12px';
        if (d.labelSize === 'normal') return '10px';
        return '8px';
      })
      .attr('fill', GLOBE_COLORS.labels)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0, 0, 0, 0.7)');

    this.updateCountryLabels();
  }

  private updateCountryLabels() {
    this.svg.selectAll('.globe-country-label')
      .attr('transform', (d: SkillSupplyData) => {
        const coords = this.projection([d.lng, d.lat]);
        if (!coords) return 'translate(-1000, -1000)';
        
        // Check if point is visible (on the front of the globe)
        const geoAngle = d3.geoDistance([d.lng, d.lat], this.projection.invert!([0, 0]) || [0, 0]);
        const isVisible = geoAngle < Math.PI / 2;
        
        if (!isVisible) return 'translate(-1000, -1000)';
        
        return `translate(${coords[0]}, ${coords[1]})`;
      })
      .style('opacity', (d: SkillSupplyData) => {
        const coords = this.projection([d.lng, d.lat]);
        if (!coords) return 0;
        
        const geoAngle = d3.geoDistance([d.lng, d.lat], this.projection.invert!([0, 0]) || [0, 0]);
        const isVisible = geoAngle < Math.PI / 2;
        
        if (!isVisible) return 0;
        
        // Show small labels only when zoomed in
        if (d.labelSize === 'small') {
          return this.currentZoom > 1.5 ? 1 : 0;
        }
        
        return 1;
      });
  }

  private handleCountryHover(event: any, d: any) {
    this.isRotating = false;
    
    // Find country data
    const countryData = this.skillData.find(c => c.country === d.properties.name);
    if (countryData) {
      this.showTooltip(event, countryData);
    }
    
    // Highlight country
    d3.select(event.target)
      .attr('fill', GLOBE_COLORS.countries.hover)
      .attr('stroke', GLOBE_COLORS.stroke.hover)
      .attr('stroke-width', 0.8);
  }

  private handleCountryClick(d: any) {
    const countryData = this.skillData.find(c => c.country === d.properties.name);
    if (countryData) {
      this.selectCountry(countryData);
    }
  }

  private showTooltip(event: any, country: SkillSupplyData) {
    const tooltipContent = `
      <div class="tooltip-header">
        <img src="assets/images/flags/${country.code.toLowerCase()}.svg" 
             alt="${country.country} flag" 
             class="flag-icon">
        <span>${country.country}</span>
      </div>
      <div class="tooltip-content">
        <div class="tooltip-stat">
          <span class="stat-label">Unique Skills</span>
          <span class="stat-value">${country.uniqueSkills}</span>
        </div>
        <div class="tooltip-stat">
          <span class="stat-label">Skill Supply (FTE)</span>
          <span class="stat-value">${country.skillSupply}</span>
        </div>
      </div>
    `;

    this.tooltip.html(tooltipContent)
      .style('display', 'block');
    
    this.moveTooltip(event);
  }

  private moveTooltip(event: any) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const offsetX = this.isMobile ? 10 : 15;
    const offsetY = this.isMobile ? -40 : -35;
    
    this.tooltip
      .style('left', (x + offsetX) + 'px')
      .style('top', (y + offsetY) + 'px');
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
    
    // Remove hover effects
    this.svg.selectAll('.globe-country')
      .attr('fill', (d: any) => {
        return d3.select(d3.event?.target).classed('highlighted') ? 
               GLOBE_COLORS.countries.highlighted : 
               GLOBE_COLORS.countries.default;
      })
      .attr('stroke', (d: any) => {
        return d3.select(d3.event?.target).classed('highlighted') ? 
               GLOBE_COLORS.stroke.highlighted : 
               GLOBE_COLORS.stroke.default;
      })
      .attr('stroke-width', (d: any) => {
        return d3.select(d3.event?.target).classed('highlighted') ? 2 : 0.3;
      });
  }

  private updateGlobe() {
    // Update countries
    this.svg.selectAll('.globe-country')
      .attr('d', this.path);
    
    // Update graticule
    this.svg.select('.globe-graticule')
      .attr('d', this.path);
    
    // Update labels
    this.updateCountryLabels();
    
    // Update globe sphere
    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    this.svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius * this.currentZoom);
  }

  private handleResize() {
    if (!this.svg || !this.globeContainer) return;

    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);

    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    
    this.updateGlobe();
  }

  private startRotation() {
    const rotate = () => {
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateGlobe();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }

  // Public Methods
  selectCountry(country: SkillSupplyData) {
    if (!country) return;

    this.selectedCountry = country;
    this.isRotating = false;

    // Clear previous highlights
    this.clearHighlights();

    // Rotate to country
    const targetRotation = [-country.lng, -country.lat];
    this.currentRotation = targetRotation;
    this.projection.rotate(this.currentRotation);
    this.updateGlobe();

    // Highlight country
    this.highlightCountry(country);

    // Auto-resume rotation after highlight period
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
    }
    
    this.highlightTimer = window.setTimeout(() => {
      this.clearHighlights();
      this.isRotating = true;
    }, HIGHLIGHT_DURATION);
  }

  private highlightCountry(country: SkillSupplyData) {
    this.svg.selectAll('.globe-country')
      .classed('highlighted', (d: any) => d.properties.name === country.country)
      .attr('fill', (d: any) => {
        return d.properties.name === country.country ? 
               GLOBE_COLORS.countries.highlighted : 
               GLOBE_COLORS.countries.default;
      })
      .attr('stroke', (d: any) => {
        return d.properties.name === country.country ? 
               GLOBE_COLORS.stroke.highlighted : 
               GLOBE_COLORS.stroke.default;
      })
      .attr('stroke-width', (d: any) => {
        return d.properties.name === country.country ? 2 : 0.3;
      })
      .attr('stroke-dasharray', (d: any) => {
        return d.properties.name === country.country ? '3,3' : null;
      });
  }

  private clearHighlights() {
    this.svg.selectAll('.globe-country')
      .classed('highlighted', false)
      .attr('fill', GLOBE_COLORS.countries.default)
      .attr('stroke', GLOBE_COLORS.stroke.default)
      .attr('stroke-width', 0.3)
      .attr('stroke-dasharray', null);
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredCountries = [...this.skillData];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredCountries = this.skillData.filter(country =>
        country.country.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by skill supply descending
    this.filteredCountries.sort((a, b) => b.skillSupply - a.skillSupply);
  }

  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM_CONFIG.step, ZOOM_CONFIG.max);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateGlobe();
    
    // Add zoom class for showing small labels
    this.svg.classed('globe-zoomed', this.currentZoom > 1.5);
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM_CONFIG.step, ZOOM_CONFIG.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateGlobe();
    
    // Remove zoom class when zoomed out
    this.svg.classed('globe-zoomed', this.currentZoom > 1.5);
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }

  trackByCountry(index: number, country: SkillSupplyData): string {
    return country.code;
  }
}


<div class="skill-supply-card-box-lg" #cartboxchartsection [ngClass]="{ 'fullscreen': isFullscreen }">
    <div class="skill-supply-box-chart-lg">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
            
            <!-- Left Section -->
            <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
                <span class="title-with-icon d-flex align-items-center gap-2">
                    Skill Supply by Location
                    <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
                </span>
            </div>

            <!-- Right Section -->
            <div class="col-md-4 d-flex justify-content-end align-items-center header-icons">
                <!-- Search Input -->
                <div class="search-container me-3">
                    <input type="text" 
                           class="form-control search-input" 
                           placeholder="Search by country"
                           [(ngModel)]="searchTerm"
                           (input)="onSearchChange()">
                    <i class="fas fa-search search-icon"></i>
                </div>

                <!-- Toggle Buttons -->
                <div class="d-flex gap-3">
                    <span class="view" (click)="toggleFullscreen()">
                        <i [ngClass]="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'" title="Zoom"></i>
                    </span>
                    <div class="ellipsis ml-2">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="globe-wrapper">
            <!-- Globe -->
            <div #globeContainer class="globe-container"></div>
            
            <!-- Zoom Controls -->
            <div class="zoom-container">
                <button (click)="zoomIn()">+</button>
                <button (click)="zoomOut()">-</button>
            </div>

            <!-- Country List -->
            <div class="country-list-wrapper">
                <div class="country-list-scroll">
                    <div class="country-item" 
                         *ngFor="let country of filteredCountries; trackBy: trackByCountry"
                         [class.selected]="selectedCountry?.code === country.code"
                         (click)="selectCountry(country)">
                        <div class="country-info">
                            <img [src]="'assets/images/flags/' + country.code.toLowerCase() + '.svg'" 
                                 class="flag-icon" 
                                 [alt]="country.country + ' flag'" />
                            <span class="country-name">{{ country.country }}</span>
                        </div>
                        <div class="country-stats">
                            <div class="stat-item">
                                <span class="stat-label">Unique Skills</span>
                                <span class="stat-value">{{ country.uniqueSkills }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Skill Supply (FTE)</span>
                                <span class="stat-value">{{ country.skillSupply }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="view-more-container">
                    <span class="view-more pointer">
                        View More&nbsp;&nbsp;
                        <i class="fa fa-angle-right"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<ng-template #infotemp>
    <lift-popover popoverTitle="" popoverText="">
        <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
</ng-template>


import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
import { LiftPopoverComponent } from '@lift/ui';

type SkillSupplyData = {
  country: string;
  region: string;
  code: string;
  lat: number;
  lng: number;
  uniqueSkills: number;
  skillSupply: number;
  isVisible?: boolean;
  labelSize?: 'major' | 'normal' | 'small';
};

const GLOBE_COLORS = {
  background: ['#4A9CB8', '#2E7D8A', '#1E5F73'],
  countries: {
    default: 'rgba(255, 255, 255, 0.3)',
    hover: 'rgba(255, 255, 255, 0.5)',
    highlighted: 'rgba(255, 193, 7, 0.4)'
  },
  stroke: {
    default: 'rgba(255, 255, 255, 0.5)',
    hover: 'rgba(255, 255, 255, 0.8)',
    highlighted: '#ffc107'
  },
  graticule: 'rgba(255, 255, 255, 0.2)',
  labels: '#fff'
};

const ROTATION_SPEED = 0.3;
const ZOOM_CONFIG = { initial: 1, step: 0.2, min: 0.8, max: 4 };
const HIGHLIGHT_DURATION = 4000;
const GRATICULE_STEP = 20;

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // Data Properties
  skillData: SkillSupplyData[] = [];
  filteredCountries: SkillSupplyData[] = [];
  searchTerm: string = '';
  selectedCountry: SkillSupplyData | null = null;

  // Globe Properties
  private svg: any;
  private projection: any;
  private path: any;
  private graticule: any;
  private countries!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, -10];
  private isRotating = true;
  private isDragging = false;
  private tooltip: any;
  private currentZoom: number = ZOOM_CONFIG.initial;
  private currentRadius = 280;
  private resizeObserver?: ResizeObserver;
  private highlightTimer?: number;

  // UI Properties
  isFullscreen = false;
  private isMobile = false;
  private isTablet = false;

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
    // Handle outside clicks if needed
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width >= 768 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const container = this.globeContainer?.nativeElement;
    if (!container) return 280;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const minDimension = Math.min(width, height);
    
    if (this.isMobile) {
      return Math.min(minDimension * 0.35, 140);
    } else if (this.isTablet) {
      return Math.min(minDimension * 0.4, 200);
    } else {
      return Math.min(minDimension * 0.45, 280);
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
    if (this.highlightTimer) {
      clearTimeout(this.highlightTimer);
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

    // Setup projection and path
    this.projection = d3.geoOrthographic()
      .scale(this.currentRadius)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(this.currentRotation);

    this.path = d3.geoPath().projection(this.projection);

    // Setup graticule (grid lines)
    this.graticule = d3.geoGraticule()
      .step([GRATICULE_STEP, GRATICULE_STEP]);

    // Clear existing SVG
    d3.select(globeDiv).selectAll('svg').remove();

    // Create main SVG
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add gradient definition
    const defs = this.svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'globeGradient')
      .attr('cx', '30%')
      .attr('cy', '30%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', GLOBE_COLORS.background[0]);
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', GLOBE_COLORS.background[1]);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', GLOBE_COLORS.background[2]);

    // Add globe sphere
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('fill', 'url(#globeGradient)')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1);

    // Add graticule (grid lines)
    this.svg.append('path')
      .datum(this.graticule)
      .attr('class', 'globe-graticule')
      .attr('d', this.path)
      .attr('stroke', GLOBE_COLORS.graticule)
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');

    // Load world data
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Setup tooltip
    this.setupTooltip(globeDiv);
    
    // Setup interactions
    this.setupInteractions();
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
        this.updateGlobe();
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
      // Transform the data to match our interface
      this.skillData = data.countries.map((c: any) => ({
        country: c.name,
        region: c.region,
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        uniqueSkills: Math.floor(Math.random() * 80) + 20, // Dummy data
        skillSupply: Math.floor(Math.random() * 50) + 5,   // Dummy data
        isVisible: true,
        labelSize: this.determineLabelSize(c.name)
      }));

      this.filteredCountries = [...this.skillData].sort((a, b) => 
        b.skillSupply - a.skillSupply
      );

      this.drawCountries();
      this.drawCountryLabels();
      this.startRotation();
    });
  }

  private determineLabelSize(countryName: string): 'major' | 'normal' | 'small' {
    const majorCountries = [
      'United States', 'China', 'India', 'Brazil', 'Russia', 
      'Canada', 'Australia', 'Germany', 'France', 'United Kingdom', 
      'Japan', 'South Africa', 'Mexico', 'Argentina', 'Egypt'
    ];
    
    const normalCountries = [
      'Spain', 'Italy', 'Turkey', 'Poland', 'Ukraine', 'Iran', 
      'Thailand', 'Myanmar', 'Kenya', 'Tanzania', 'Nigeria', 
      'Colombia', 'Venezuela', 'Peru', 'Chile', 'Kazakhstan'
    ];

    if (majorCountries.includes(countryName)) return 'major';
    if (normalCountries.includes(countryName)) return 'normal';
    return 'small';
  }

  private drawCountries() {
    this.svg.selectAll('.globe-country').remove();

    this.svg.selectAll('.globe-country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'globe-country')
      .attr('d', this.path)
      .attr('fill', GLOBE_COLORS.countries.default)
      .attr('stroke', GLOBE_COLORS.stroke.default)
      .attr('stroke-width', 0.3)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        this.handleCountryHover(event, d);
      })
      .on('mousemove', (event: any) => {
        this.moveTooltip(event);
      })
      .on('mouseout', () => {
        this.hideTooltip();
        if (!this.isDragging) {
          this.isRotating = true;
        }
      })
      .on('click', (event: any, d: any) => {
        this.handleCountryClick(d);
      });
  }

  private drawCountryLabels() {
    this.svg.selectAll('.globe-country-label').remove();

    const labels = this.svg.selectAll('.globe-country-label')
      .data(this.skillData.filter(d => d.isVisible))
      .enter()
      .append('text')
      .attr('class', (d: SkillSupplyData) => `globe-country-label ${d.labelSize}-country`)
      .text((d: SkillSupplyData) => d.country)
      .attr('font-size', (d: SkillSupplyData) => {
        if (d.labelSize === 'major') return '12px';
        if (d.labelSize === 'normal') return '10px';
        return '8px';
      })
      .attr('fill', GLOBE_COLORS.labels)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0, 0, 0, 0.7)');

    this.updateCountryLabels();
  }

  private updateCountryLabels() {
    this.svg.selectAll('.globe-country-label')
      .attr('transform', (d: SkillSupplyData) => {
        const coords = this.projection([d.lng, d.lat]);