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

type AdminDivision = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
  type: 'state' | 'province' | 'region' | 'territory';
};

const CUSTOM_GLOBE_COLOR = '#84c9f6';
const STROKE_COLOR_COUNTRY = '#7e8790';
const FALLBACK_COLOR = '#e0e0e0';
const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

// External data sources for administrative divisions
const ADMIN_DATA_SOURCES = {
  // Natural Earth data for administrative divisions
  naturalEarth: 'https://cdn.jsdelivr.net/npm/world-atlas@3/countries-50m.json',
  usStates: 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json',
  worldAdmin: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv',
  
  // Alternative sources
  restCountries: 'https://restcountries.com/v3.1/all?fields=name,cca2,cca3,latlng,region,subregion',
  geoNames: 'http://api.geonames.org/countryInfoJSON?formatted=true&username=demo'
};

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
  private adminDivisions: FeatureCollection<Geometry, any> | null = null;
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

  // Dynamic admin divisions loaded from external sources
  private adminDivisionData: AdminDivision[] = [];
  private adminDivisionsCache = new Map<string, AdminDivision[]>();

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

  private async loadAdministrativeDivisions() {
    try {
      // Load US States first (most reliable source)
      await this.loadUSStates();
      
      // Load other administrative divisions using REST Countries API
      await this.loadWorldAdminDivisions();
      
      // Alternative: Load using GeoNames API
      // await this.loadGeoNamesData();
      
    } catch (error) {
      console.log('Using fallback administrative division data');
      this.loadFallbackAdminData();
    }
  }

  private async loadUSStates(): Promise<void> {
    try {
      const data: any = await this.http.get(ADMIN_DATA_SOURCES.usStates).toPromise();
      this.adminDivisions = topojson.feature(data, data.objects.states);
      
      // Extract state information from the topojson data
      const usStates: AdminDivision[] = this.adminDivisions.features.map((feature: any) => ({
        code: feature.properties.name.substring(0, 2).toUpperCase(), // Simplified code extraction
        name: feature.properties.name,
        lat: d3.geoCentroid(feature)[1],
        lng: d3.geoCentroid(feature)[0],
        countryCode: 'US',
        type: 'state' as const
      }));
      
      this.adminDivisionData.push(...usStates);
      this.adminDivisionsCache.set('US', usStates);
      
    } catch (error) {
      console.log('US states data not available:', error);
    }
  }

  private async loadWorldAdminDivisions(): Promise<void> {
    try {
      const countries: any = await this.http.get(ADMIN_DATA_SOURCES.restCountries).toPromise();
      
      // For major countries, we can extract region information
      countries.forEach((country: any) => {
        if (country.subregion && country.latlng) {
          const adminDiv: AdminDivision = {
            code: country.cca2,
            name: country.name.common,
            lat: country.latlng[0],
            lng: country.latlng[1],
            countryCode: country.cca2,
            type: 'region'
          };
          
          if (!this.adminDivisionsCache.has(country.cca2)) {
            this.adminDivisionsCache.set(country.cca2, []);
          }
          this.adminDivisionsCache.get(country.cca2)?.push(adminDiv);
        }
      });
      
    } catch (error) {
      console.log('World admin divisions not available:', error);
    }
  }

  private async loadGeoNamesData(): Promise<void> {
    try {
      // GeoNames API can provide administrative divisions
      // Note: Requires API key for production use
      const response: any = await this.http.get(
        'http://api.geonames.org/searchJSON?q=*&fclass=A&fcode=ADM1&maxRows=1000&username=demo'
      ).toPromise();
      
      const adminDivs: AdminDivision[] = response.geonames.map((item: any) => ({
        code: item.adminCode1 || item.toponymName.substring(0, 2).toUpperCase(),
        name: item.toponymName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        countryCode: item.countryCode,
        type: 'region'
      }));
      
      this.adminDivisionData.push(...adminDivs);
      
    } catch (error) {
      console.log('GeoNames data not available:', error);
    }
  }

  private loadFallbackAdminData(): void {
    // Minimal fallback data for major regions only
    const fallbackData: AdminDivision[] = [
      { code: 'CA', name: 'California', lat: 36.7783, lng: -119.4179, countryCode: 'US', type: 'state' },
      { code: 'TX', name: 'Texas', lat: 31.9686, lng: -99.9018, countryCode: 'US', type: 'state' },
      { code: 'FL', name: 'Florida', lat: 27.7663, lng: -81.6868, countryCode: 'US', type: 'state' },
      { code: 'NY', name: 'New York', lat: 40.7128, lng: -74.0060, countryCode: 'US', type: 'state' },
      { code: 'ON', name: 'Ontario', lat: 51.2538, lng: -85.3232, countryCode: 'CA', type: 'province' },
      { code: 'QC', name: 'Quebec', lat: 53.9214, lng: -73.2269, countryCode: 'CA', type: 'province' },
    ];
    
    this.adminDivisionData = fallbackData;
  }

  // Method to dynamically load admin divisions for a specific country
  private async loadAdminDivisionsForCountry(countryCode: string): Promise<AdminDivision[]> {
    if (this.adminDivisionsCache.has(countryCode)) {
      return this.adminDivisionsCache.get(countryCode) || [];
    }

    try {
      // For specific countries, you could load detailed subdivision data
      // Example for different data sources:
      
      if (countryCode === 'US') {
        return await this.loadUSStateDetails();
      } else if (countryCode === 'CA') {
        return await this.loadCanadianProvinces();
      } else if (countryCode === 'GB') {
        return await this.loadUKRegions();
      }
      
      // Generic approach for other countries
      return await this.loadGenericAdminDivisions(countryCode);
      
    } catch (error) {
      console.log(`Admin divisions for ${countryCode} not available:`, error);
      return [];
    }
  }

  private async loadUSStateDetails(): Promise<AdminDivision[]> {
    // This could load from a more detailed US states API
    // For now, return cached data
    return this.adminDivisionsCache.get('US') || [];
  }

  private async loadCanadianProvinces(): Promise<AdminDivision[]> {
    try {
      // Could load from Statistics Canada API or similar
      const response: any = await this.http.get(
        'https://api.example.com/canada/provinces' // Replace with actual API
      ).toPromise();
      
      return response.provinces.map((province: any) => ({
        code: province.code,
        name: province.name,
        lat: province.lat,
        lng: province.lng,
        countryCode: 'CA',
        type: 'province'
      }));
    } catch (error) {
      return []; // Return empty array if API fails
    }
  }

  private async loadUKRegions(): Promise<AdminDivision[]> {
    // Similar pattern for UK regions
    return [];
  }

  private async loadGenericAdminDivisions(countryCode: string): Promise<AdminDivision[]> {
    try {
      // Use GeoNames or similar service for generic country subdivisions
      const response: any = await this.http.get(
        `http://api.geonames.org/childrenJSON?geonameId=country&username=demo`
      ).toPromise();
      
      return response.geonames.map((item: any) => ({
        code: item.adminCode1 || item.name.substring(0, 2).toUpperCase(),
        name: item.name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        countryCode: countryCode,
        type: 'region'
      }));
    } catch (error) {
      return [];
    }
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
    this.loadUSStatesData();
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

  private loadUSStatesData() {
    // Try to load US states data from a CDN
    this.http.get('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .subscribe({
        next: (data: any) => {
          this.usStates = topojson.feature(data, data.objects.states);
          this.drawCountries(); // Redraw to include state boundaries
        },
        error: (error) => {
          console.log('US states data not available, using coordinates only:', error);
        }
      });
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
    this.svg.selectAll('.state-boundary').remove();

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

    // Draw US state boundaries if available
    if (this.usStates) {
      this.svg.selectAll('.state-boundary')
        .data(this.usStates.features)
        .enter()
        .append('path')
        .attr('class', 'state-boundary')
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', '#999')
        .attr('stroke-width', 0.3)
        .attr('opacity', 0.6);
    }

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
    this.svg.selectAll('.state-label').remove();
    this.svg.selectAll('.state-label-shadow').remove();

    const usedPositions: Array<{x: number, y: number}> = [];
    const minDistance = this.isMobile ? 20 : 25;

    // Get visible states based on current zoom level
    const visibleStates = this.getVisibleStates();

    visibleStates.forEach(state => {
      if (this.isPointInFrontHemisphere(state.lng, state.lat)) {
        const coordinates = [state.lng, state.lat];
        const projected = this.projection(coordinates);
        
        if (projected && projected[0] && projected[1] && !isNaN(projected[0]) && !isNaN(projected[1])) {
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

              const normalizedDistance = distance / maxDistance;
              const opacity = Math.max(0.4, Math.min(0.8, 1 - normalizedDistance * 0.4));

              // Add state code shadow
              const stateShadow = this.svg.append('text')
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
                .text(state.code);

              // Add state code label
              const stateLabel = this.svg.append('text')
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
                .text(state.code);
            }
          }
        }
      }
    });
  }

  private getVisibleStates(): StateInfo[] {
    // Only show state labels when zoomed in enough
    if (this.currentZoom < 1.5) {
      return [];
    }

    // Filter states based on what's currently visible and zoom level
    const currentCountry = this.getCurrentlyFocusedCountry();
    
    if (currentCountry === 'US' || currentCountry === 'United States') {
      // Show US states
      return this.stateData.filter(state => 
        state.countryCode === 'US' && 
        Math.abs(state.lng - (-this.currentRotation[0])) < 30 &&
        Math.abs(state.lat - (-this.currentRotation[1])) < 20
      );
    } else if (currentCountry === 'CA' || currentCountry === 'Canada') {
      // Show Canadian provinces
      return this.stateData.filter(state => 
        state.countryCode === 'CA' &&
        Math.abs(state.lng - (-this.currentRotation[0])) < 40 &&
        Math.abs(state.lat - (-this.currentRotation[1])) < 25
      );
    }

    return [];
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

    // Update state boundaries if they exist
    if (this.usStates) {
      this.svg.selectAll('.state-boundary')
        .attr('d', this.path);
    }

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