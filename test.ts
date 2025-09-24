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

  // Store label data to avoid recalculation
  private countryLabelData: Array<{feature: any, centroid: [number, number], name: string}> = [];
  private stateLabelData: Array<{feature: any, centroid: [number, number], label: string}> = [];

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
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
    if (this.svg) {
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
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

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
    this.updateStates();
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
        this.updateCountries();
        this.updateStates();
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

    this.globeContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
    }, { passive: true });
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
      this.initializeCountryLabels();
      this.drawCountries();
      this.startRotation();
    });

    // Load states/provinces
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(
        data,
        data.objects.ne_50m_admin_1_states_provinces
      ) as unknown as FeatureCollection<Geometry, any>;
      this.initializeStateLabels();
      this.drawStates();
    });
  }

  // Initialize country label data once
  private initializeCountryLabels() {
    this.countryLabelData = this.countries.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const name = feature.properties.name;
        return name ? { feature, centroid, name } : null;
      })
      .filter(Boolean);
  }

  // Initialize state label data once
  private initializeStateLabels() {
    if (!this.states) return;
    
    this.stateLabelData = this.states.features
      .map((feature: any) => {
        const centroid = d3.geoCentroid(feature);
        const props = feature.properties;
        const label = props.code_hasc || props.iso_3166_2 || props.name;
        return label ? { feature, centroid, label } : null;
      })
      .filter(Boolean);
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
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        this.isRotating = false;
        this.showTooltip(event, d);
      })
      .on('mousemove', (event: any) => this.moveTooltip(event))
      .on('mouseout', () => {
        if (!this.isDragging) {
          this.isRotating = true;
        }
        this.hideTooltip();
      });

    this.updateCountryLabels();
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
      .attr('stroke', '#aaa')
      .attr('stroke-width', 0.3);

    this.updateStateLabels();
  }

  // Calculate area of projected feature for label sizing
  private getProjectedArea(feature: any): number {
    const pathString = this.path(feature);
    if (!pathString) return 0;
    
    // Simple approximation of path area based on bounding box
    const bounds = this.path.bounds(feature);
    if (!bounds) return 0;
    
    const width = bounds[1][0] - bounds[0][0];
    const height = bounds[1][1] - bounds[0][1];
    return width * height;
  }

  // Determine if a point is visible on the front hemisphere
  private isPointVisible(centroid: [number, number]): boolean {
    const projected = this.projection(centroid);
    if (!projected) return false;
    
    // Check if the point is on the visible hemisphere
    const [lng, lat] = centroid;
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

  private updateStateLabels() {
    if (!this.stateLabelData.length) return;

    this.svg.selectAll('.state-label').remove();
    this.svg.selectAll('.state-label-shadow').remove();

    const usedPositions: Array<{ x: number; y: number }> = [];
    const baseMinDistance = this.isMobile ? 8 : 15;
    const minDistance = baseMinDistance / this.currentZoom;

    // Filter labels based on zoom level and visibility
    const visibleLabels = this.stateLabelData.filter(data => {
      if (!this.isPointVisible(data.centroid)) return false;
      
      const projected = this.projection(data.centroid);
      if (!projected) return false;
      
      // Calculate feature area for zoom-based filtering
      const area = this.getProjectedArea(data.feature);
      const minAreaThreshold = Math.max(20, 100 / (this.currentZoom * this.currentZoom));
      
      return area > minAreaThreshold;
    });

    visibleLabels.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;

      const [x, y] = projected;

      // Check for label overlap
      let canPlace = true;
      for (const pos of usedPositions) {
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist < minDistance) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) return;
      usedPositions.push({ x, y });

      const fontSize = Math.max(4, Math.min(8, 6 + this.currentZoom));

      // Shadow
      this.svg.append('text')
        .attr('class', 'state-label-shadow')
        .attr('x', x + 0.8)
        .attr('y', y + 0.8)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('fill', 'rgba(0,0,0,0.4)')
        .style('pointer-events', 'none')
        .text(data.label);

      // Main label
      this.svg.append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '500')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#2b2b2b')
        .style('stroke', 'white')
        .style('stroke-width', '0.6px')
        .style('paint-order', 'stroke fill')
        .text(data.label);
    });
  }

  private updateCountryLabels() {
    if (!this.countryLabelData.length) return;

    this.svg.selectAll('.country-label').remove();
    this.svg.selectAll('.country-label-shadow').remove();

    const usedPositions: Array<{ x: number; y: number }> = [];
    const baseMinDistance = this.isMobile ? 20 : 30;
    const minDistance = baseMinDistance / this.currentZoom;

    // Filter labels based on zoom level and visibility
    const visibleLabels = this.countryLabelData.filter(data => {
      if (!this.isPointVisible(data.centroid)) return false;
      
      const projected = this.projection(data.centroid);
      if (!projected) return false;
      
      // Calculate feature area for zoom-based filtering
      const area = this.getProjectedArea(data.feature);
      const minAreaThreshold = Math.max(100, 500 / (this.currentZoom * this.currentZoom));
      
      return area > minAreaThreshold;
    });

    visibleLabels.forEach((data) => {
      const projected = this.projection(data.centroid);
      if (!projected) return;

      const [x, y] = projected;

      // Check for label overlap
      let canPlace = true;
      for (const pos of usedPositions) {
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist < minDistance) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) return;
      usedPositions.push({ x, y });

      const fontSize = Math.max(6, Math.min(12, 8 + this.currentZoom * 1.5));

      // Shadow
      this.svg.append('text')
        .attr('class', 'country-label-shadow')
        .attr('x', x + 1)
        .attr('y', y + 1)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('fill', 'rgba(0,0,0,0.4)')
        .style('pointer-events', 'none')
        .text(data.name);

      // Main label
      this.svg.append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '600')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('paint-order', 'stroke fill')
        .text(data.name);
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

    this.updateCountryLabels();
  }

  private updateStates() {
    if (!this.states) return;
    this.svg.selectAll('.state')
      .attr('d', this.path);
    this.updateStateLabels();
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
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountries();
    this.updateStates();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountries();
    this.updateStates();
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
    this.projection.rotate(this.currentRotation);
    this.updateCountries();
    this.updateStates();

    this.svg.selectAll('.country-highlight').remove();

    const countryFeature = this.countries.features.find((feature: any) =>
      feature.properties.name === country.country
    );

    if (countryFeature) {
      const highlight = this.svg.append('path')
        .datum(countryFeature)
        .attr('class', 'country-highlight')
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', '#ff4444')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '8,4')
        .style('opacity', 0);

      highlight.transition()
        .duration(400)
        .style('opacity', 1);

      setTimeout(() => {
        highlight.transition()
          .duration(600)
          .style('opacity', 0)
          .remove();
        this.isRotating = true;
      }, 3000);
    } else {
      setTimeout(() => {
        this.isRotating = true;
      }, 1000);
    }
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