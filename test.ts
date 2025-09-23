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
  
  // D3.js globe properties
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
  private currentRadius = 300;
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(['#8db4ddff', '#144c88']);

  // State/administrative division properties
  private statesData: any = null;
  private provincesData: any = null;

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
    // Handle document clicks if needed
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
    this.loadAdministrativeDivisions();
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

  private loadAdministrativeDivisions() {
    // Try to load administrative divisions from Natural Earth data
    const divisionsUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_countries_admin.geojson';
    
    this.http.get(divisionsUrl).subscribe({
      next: (data: any) => {
        this.statesData = data;
        this.drawCountries(); // Redraw to include state labels
      },
      error: () => {
        // Fallback: use REST Countries API for basic country data
        this.loadCountryCentroids();
      }
    });
  }

  private loadCountryCentroids() {
    // Fallback method using country centroids for major subdivisions
    this.http.get('https://restcountries.com/v3.1/all?fields=name,cca2,latlng,subregion').subscribe({
      next: (countries: any[]) => {
        this.processCountryData(countries);
        this.drawCountries();
      },
      error: (error) => {
        console.log('Could not load country data:', error);
      }
    });
  }

  private processCountryData(countries: any[]) {
    // Extract major countries and create subdivision points
    const majorCountries = countries.filter(country => 
      ['US', 'CA', 'AU', 'BR', 'IN', 'CN', 'RU', 'DE', 'GB'].includes(country.cca2)
    );
    
    this.statesData = {
      type: "FeatureCollection",
      features: majorCountries.map(country => ({
        type: "Feature",
        properties: {
          NAME: country.name.common,
          ISO_A2: country.cca2,
          TYPE: "Country"
        },
        geometry: {
          type: "Point",
          coordinates: [country.latlng[1], country.latlng[0]]
        }
      }))
    };
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
      })
      .on('end', (event: any) => {
        this.isDragging = false;
        setTimeout(() => {
          if (!this.isDragging) {
            this.isRotating = true;
          }
        }, 2000);
      });

    this.svg.select('circle').call(drag);

    this.globeContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      // Handle wheel events if needed
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
      this.drawCountries();
      this.startRotation();
    });
  }

  private drawCountries() {
    this.svg.selectAll('.country').remove();
    this.svg.selectAll('.country-label').remove();
    this.svg.selectAll('.state-label').remove();

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

    this.addCountryLabels();
    this.addStateLabels();
  }

  private addCountryLabels() {
    this.svg.selectAll('.country-label').remove();
    this.svg.selectAll('.country-label-shadow').remove();

    // Filter and sort countries that should have labels
    let labeledCountries = this.countriesList.filter(country => {
      return country.uniqueSkills > 15 || country.skillSupply > 8;
    });

    // Sort by importance (skill supply + unique skills)
    labeledCountries.sort((a, b) => 
      (b.skillSupply + b.uniqueSkills) - (a.skillSupply + a.uniqueSkills)
    );

    // Keep track of used positions to avoid overlap
    const usedPositions: Array<{x: number, y: number}> = [];
    const minDistance = this.isMobile ? 25 : 35;

    labeledCountries.forEach(country => {
      // Only show labels for countries on the front hemisphere
      if (this.isPointInFrontHemisphere(country.lng, country.lat)) {
        const coordinates = [country.lng, country.lat];
        const projected = this.projection(coordinates);
        
        if (projected && projected[0] && projected[1] && !isNaN(projected[0]) && !isNaN(projected[1])) {
          const globeDiv = this.globeContainer.nativeElement;
          const centerX = globeDiv.offsetWidth / 2;
          const centerY = globeDiv.offsetHeight / 2;
          
          // Calculate distance from center
          const distance = Math.sqrt(
            Math.pow(projected[0] - centerX, 2) + Math.pow(projected[1] - centerY, 2)
          );
          
          // Show labels within the globe area
          const maxDistance = this.currentRadius * this.currentZoom * 0.9;
          
          if (distance <= maxDistance) {
            // Check for overlap with existing labels
            let canPlace = true;
            for (const pos of usedPositions) {
              const labelDistance = Math.sqrt(
                Math.pow(projected[0] - pos.x, 2) + Math.pow(projected[1] - pos.y, 2)
              );
              if (labelDistance < minDistance) {
                canPlace = false;
                break;
              }
            }

            if (canPlace) {
              // Add to used positions
              usedPositions.push({x: projected[0], y: projected[1]});

              // Calculate opacity based on distance from center
              const normalizedDistance = distance / maxDistance;
              const opacity = Math.max(0.6, Math.min(1, 1 - normalizedDistance * 0.3));

              // Add shadow first
              const shadow = this.svg.append('text')
                .attr('class', 'country-label-shadow')
                .attr('x', projected[0] + 0.5)
                .attr('y', projected[1] + 0.5)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .style('font-size', this.isMobile ? '8px' : '10px')
                .style('font-weight', '600')
                .style('font-family', 'Arial, sans-serif')
                .style('fill', 'rgba(0,0,0,0.5)')
                .style('pointer-events', 'none')
                .style('user-select', 'none')
                .style('opacity', opacity * 0.7)
                .text(country.country);

              // Add main label
              const label = this.svg.append('text')
                .attr('class', 'country-label')
                .attr('x', projected[0])
                .attr('y', projected[1])
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .style('font-size', this.isMobile ? '8px' : '10px')
                .style('font-weight', '600')
                .style('font-family', 'Arial, sans-serif')
                .style('fill', '#1a365d')
                .style('stroke', 'white')
                .style('stroke-width', '1.5px')
                .style('stroke-linejoin', 'round')
                .style('paint-order', 'stroke fill')
                .style('pointer-events', 'none')
                .style('user-select', 'none')
                .style('opacity', opacity)
                .text(country.country);
            }
          }
        }
      }
    });
  }

  private addStateLabels() {
    if (!this.statesData || this.currentZoom < 1.5) return;

    this.svg.selectAll('.state-label').remove();
    this.svg.selectAll('.state-label-shadow').remove();

    const usedPositions: Array<{x: number, y: number}> = [];
    const minDistance = this.isMobile ? 20 : 25;

    // Process features from the loaded geojson
    if (this.statesData.features) {
      this.statesData.features.forEach((feature: any) => {
        if (this.isFeatureVisible(feature)) {
          const coords = this.getFeatureCoordinates(feature);
          if (coords && this.isPointInFrontHemisphere(coords[0], coords[1])) {
            const projected = this.projection(coords);
            
            if (projected && projected[0] && projected[1]) {
              const globeDiv = this.globeContainer.nativeElement;
              const centerX = globeDiv.offsetWidth / 2;
              const centerY = globeDiv.offsetHeight / 2;
              
              const distance = Math.sqrt(
                Math.pow(projected[0] - centerX, 2) + Math.pow(projected[1] - centerY, 2)
              );
              
              const maxDistance = this.currentRadius * this.currentZoom * 0.85;
              
              if (distance <= maxDistance) {
                // Check for overlap
                let canPlace = true;
                for (const pos of usedPositions) {
                  const labelDistance = Math.sqrt(
                    Math.pow(projected[0] - pos.x, 2) + Math.pow(projected[1] - pos.y, 2)
                  );
                  if (labelDistance < minDistance) {
                    canPlace = false;
                    break;
                  }
                }

                if (canPlace) {
                  usedPositions.push({x: projected[0], y: projected[1]});
                  this.createStateLabel(projected, feature.properties, distance, maxDistance);
                }
              }
            }
          }
        }
      });
    }
  }

  private isFeatureVisible(feature: any): boolean {
    // Only show subdivisions for countries currently in focus
    const countryCode = feature.properties.ISO_A2 || feature.properties.ADM0_A3;
    const focusedCountry = this.getCurrentlyFocusedCountry();
    
    return countryCode === focusedCountry;
  }

  private getFeatureCoordinates(feature: any): [number, number] | null {
    if (feature.geometry.type === 'Point') {
      return feature.geometry.coordinates;
    } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      // Calculate centroid for polygons
      const centroid = this.calculateCentroid(feature.geometry);
      return centroid;
    }
    return null;
  }

  private calculateCentroid(geometry: any): [number, number] {
    // Simple centroid calculation for polygons
    let totalX = 0, totalY = 0, count = 0;
    
    const processCoordinates = (coords: any[]) => {
      coords.forEach(coord => {
        if (Array.isArray(coord[0])) {
          processCoordinates(coord);
        } else {
          totalX += coord[0];
          totalY += coord[1];
          count++;
        }
      });
    };

    if (geometry.type === 'Polygon') {
      processCoordinates(geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygon: any) => {
        processCoordinates(polygon[0]);
      });
    }

    return count > 0 ? [totalX / count, totalY / count] : [0, 0];
  }

  private createStateLabel(projected: [number, number], properties: any, distance: number, maxDistance: number) {
    const stateCode = this.extractStateCode(properties);
    if (!stateCode) return;

    const normalizedDistance = distance / maxDistance;
    const opacity = Math.max(0.4, Math.min(0.8, 1 - normalizedDistance * 0.4));

    // Add shadow
    const shadow = this.svg.append('text')
      .attr('class', 'state-label-shadow')
      .attr('x', projected[0] + 0.3)
      .attr('y', projected[1] + 0.3)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', this.isMobile ? '6px' : '8px')
      .style('font-weight', '500')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', 'rgba(0,0,0,0.4)')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', opacity * 0.6)
      .text(stateCode);

    // Add main label
    const label = this.svg.append('text')
      .attr('class', 'state-label')
      .attr('x', projected[0])
      .attr('y', projected[1])
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', this.isMobile ? '6px' : '8px')
      .style('font-weight', '500')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', '#2d4a3e')
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .style('stroke-linejoin', 'round')
      .style('paint-order', 'stroke fill')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', opacity)
      .text(stateCode);
  }

  private extractStateCode(properties: any): string | null {
    // Extract state/province code from various possible property names
    return properties.postal || 
           properties.code_hasc || 
           properties.iso_3166_2 || 
           properties.ADM1_CODE ||
           properties.NAME_1?.substring(0, 3).toUpperCase() ||
           properties.NAME?.substring(0, 2).toUpperCase() ||
           null;
  }

  private getCurrentlyFocusedCountry(): string | null {
    // Determine which country is currently in focus based on rotation
    const centerLng = -this.currentRotation[0];
    const centerLat = -this.currentRotation[1];

    // Check if we're looking at North America
    if (centerLng > -130 && centerLng < -60 && centerLat > 25 && centerLat < 70) {
      if (centerLng > -130 && centerLng < -95 && centerLat > 48) {
        return 'CA'; // Canada
      } else if (centerLng > -125 && centerLng < -65 && centerLat > 25 && centerLat < 50) {
        return 'US'; // United States
      }
    }
    
    // Check for other major countries with states/provinces
    if (centerLng > 70 && centerLng < 135 && centerLat > -45 && centerLat < -10) {
      return 'AU'; // Australia
    }
    if (centerLng > -75 && centerLng < -35 && centerLat > -35 && centerLat < 5) {
      return 'BR'; // Brazil
    }
    if (centerLng > 68 && centerLng < 97 && centerLat > 8 && centerLat < 37) {
      return 'IN'; // India
    }

    return null;
  }

  private isPointInFrontHemisphere(lng: number, lat: number): boolean {
    // Convert degrees to radians
    const lambda = (lng * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    
    // Get current rotation in radians
    const rotLambda = (this.currentRotation[0] * Math.PI) / 180;
    const rotPhi = (this.currentRotation[1] * Math.PI) / 180;
    
    // Apply rotation
    const adjustedLng = lambda + rotLambda;
    const adjustedLat = phi + rotPhi;
    
    // Calculate if point is in front hemisphere
    // For orthographic projection, we need to check the z-coordinate
    const cosPhi = Math.cos(adjustedLat);
    const cosLambda = Math.cos(adjustedLng);
    
    // Z coordinate determines if point faces viewer
    const z = cosPhi * cosLambda;
    
    // Only show points clearly in front (with margin for edge fading)
    return z > 0.3;
  }

  private isCountryVisible(lat: number, lng: number): boolean {
    // Simplified - just use the projection system and hemisphere check
    return this.isPointInFrontHemisphere(lng, lat);
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

  private createIconDataUrl(
    color: string = '#1a73e8',
    size: number = 64
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;
    ctx.font = `900 ${size - 12}px "Font Awesome 6 Pro"`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf3c5', size / 2, size / 2);
    return canvas.toDataURL('image/png');
  }

  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));

    this.svg.select('circle')
      .attr('r', this.currentRadius * this.currentZoom);

    // Update labels to rotate with the globe
    this.addCountryLabels();
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
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(this.currentRadius * this.currentZoom);
    this.updateCountries();
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

    // Remove any existing highlights
    this.svg.selectAll('.country-highlight').remove();

    // Find the country feature in the topojson data
    const countryFeature = this.countries.features.find((feature: any) => 
      feature.properties.name === country.country
    );

    if (countryFeature) {
      // Add highlighted country with dotted border
      const highlight = this.svg.append('path')
        .datum(countryFeature)
        .attr('class', 'country-highlight')
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', '#ff4444')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '8,4')
        .style('opacity', 0);

      // Animate the highlight appearance
      highlight.transition()
        .duration(400)
        .style('opacity', 1);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        highlight.transition()
          .duration(600)
          .style('opacity', 0)
          .remove();
        this.isRotating = true;
      }, 3000);
    } else {
      // If country not found, resume rotation immediately
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