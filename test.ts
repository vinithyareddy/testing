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

type StateInfo = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
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
  private usStates: any = null;
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

  // State/Province data mapping
  private stateData: StateInfo[] = [
    // US States (major ones)
    { code: 'CA', name: 'California', lat: 36.7783, lng: -119.4179, countryCode: 'US' },
    { code: 'TX', name: 'Texas', lat: 31.9686, lng: -99.9018, countryCode: 'US' },
    { code: 'FL', name: 'Florida', lat: 27.7663, lng: -81.6868, countryCode: 'US' },
    { code: 'NY', name: 'New York', lat: 40.7128, lng: -74.0060, countryCode: 'US' },
    { code: 'PA', name: 'Pennsylvania', lat: 41.2033, lng: -77.1945, countryCode: 'US' },
    { code: 'IL', name: 'Illinois', lat: 40.3363, lng: -89.0022, countryCode: 'US' },
    { code: 'OH', name: 'Ohio', lat: 40.3888, lng: -82.7649, countryCode: 'US' },
    { code: 'GA', name: 'Georgia', lat: 33.76, lng: -84.39, countryCode: 'US' },
    { code: 'NC', name: 'North Carolina', lat: 35.771, lng: -78.638, countryCode: 'US' },
    { code: 'MI', name: 'Michigan', lat: 43.3266, lng: -84.5361, countryCode: 'US' },
    { code: 'NJ', name: 'New Jersey', lat: 40.314, lng: -74.756, countryCode: 'US' },
    { code: 'VA', name: 'Virginia', lat: 37.768, lng: -78.2057, countryCode: 'US' },
    { code: 'WA', name: 'Washington', lat: 47.042, lng: -122.893, countryCode: 'US' },
    { code: 'AZ', name: 'Arizona', lat: 33.7712, lng: -111.3877, countryCode: 'US' },
    { code: 'MA', name: 'Massachusetts', lat: 42.2373, lng: -71.5314, countryCode: 'US' },
    { code: 'TN', name: 'Tennessee', lat: 35.7449, lng: -86.7489, countryCode: 'US' },
    { code: 'IN', name: 'Indiana', lat: 40.5, lng: -86.25, countryCode: 'US' },
    { code: 'MO', name: 'Missouri', lat: 38.572954, lng: -92.189283, countryCode: 'US' },
    { code: 'MD', name: 'Maryland', lat: 39.161921, lng: -76.505206, countryCode: 'US' },
    { code: 'WI', name: 'Wisconsin', lat: 44.25, lng: -89.5, countryCode: 'US' },
    { code: 'CO', name: 'Colorado', lat: 39.550051, lng: -105.782067, countryCode: 'US' },
    { code: 'MN', name: 'Minnesota', lat: 46.39241, lng: -94.63623, countryCode: 'US' },
    { code: 'SC', name: 'South Carolina', lat: 33.76, lng: -81.035, countryCode: 'US' },
    { code: 'AL', name: 'Alabama', lat: 32.354668, lng: -86.732662, countryCode: 'US' },
    { code: 'LA', name: 'Louisiana', lat: 30.45809, lng: -91.140229, countryCode: 'US' },
    { code: 'KY', name: 'Kentucky', lat: 37.669789, lng: -84.6701, countryCode: 'US' },
    { code: 'OR', name: 'Oregon', lat: 44.931109, lng: -123.029159, countryCode: 'US' },
    { code: 'OK', name: 'Oklahoma', lat: 35.482309, lng: -97.534994, countryCode: 'US' },
    { code: 'CT', name: 'Connecticut', lat: 41.767, lng: -72.677, countryCode: 'US' },
    { code: 'UT', name: 'Utah', lat: 39.32098, lng: -111.093731, countryCode: 'US' },
    { code: 'NV', name: 'Nevada', lat: 38.4199, lng: -116.4069, countryCode: 'US' },
    { code: 'AR', name: 'Arkansas', lat: 34.9513, lng: -92.3809, countryCode: 'US' },
    { code: 'MS', name: 'Mississippi', lat: 32.354668, lng: -89.398528, countryCode: 'US' },
    { code: 'KS', name: 'Kansas', lat: 38.5111, lng: -96.8005, countryCode: 'US' },
    { code: 'NM', name: 'New Mexico', lat: 34.307144, lng: -106.018066, countryCode: 'US' },
    { code: 'NE', name: 'Nebraska', lat: 41.4925, lng: -99.9018, countryCode: 'US' },
    { code: 'WV', name: 'West Virginia', lat: 38.349497, lng: -81.633294, countryCode: 'US' },
    { code: 'ID', name: 'Idaho', lat: 44.240459, lng: -114.478828, countryCode: 'US' },
    { code: 'HI', name: 'Hawaii', lat: 21.30895, lng: -157.826182, countryCode: 'US' },
    { code: 'NH', name: 'New Hampshire', lat: 43.452492, lng: -71.563896, countryCode: 'US' },
    { code: 'ME', name: 'Maine', lat: 44.323535, lng: -69.765261, countryCode: 'US' },
    { code: 'RI', name: 'Rhode Island', lat: 41.82355, lng: -71.422132, countryCode: 'US' },
    { code: 'MT', name: 'Montana', lat: 46.595805, lng: -110.037336, countryCode: 'US' },
    { code: 'DE', name: 'Delaware', lat: 39.161921, lng: -75.526755, countryCode: 'US' },
    { code: 'SD', name: 'South Dakota', lat: 44.2853, lng: -99.4632, countryCode: 'US' },
    { code: 'ND', name: 'North Dakota', lat: 47.528912, lng: -99.784012, countryCode: 'US' },
    { code: 'AK', name: 'Alaska', lat: 61.385, lng: -152.2683, countryCode: 'US' },
    { code: 'VT', name: 'Vermont', lat: 44.26639, lng: -72.580536, countryCode: 'US' },
    { code: 'WY', name: 'Wyoming', lat: 42.7475, lng: -107.2085, countryCode: 'US' },
    
    // Canadian Provinces
    { code: 'ON', name: 'Ontario', lat: 51.2538, lng: -85.3232, countryCode: 'CA' },
    { code: 'QC', name: 'Quebec', lat: 53.9214, lng: -73.2269, countryCode: 'CA' },
    { code: 'BC', name: 'British Columbia', lat: 53.7267, lng: -127.6476, countryCode: 'CA' },
    { code: 'AB', name: 'Alberta', lat: 53.9333, lng: -116.5765, countryCode: 'CA' },
    { code: 'MB', name: 'Manitoba', lat: 53.7609, lng: -98.8139, countryCode: 'CA' },
    { code: 'SK', name: 'Saskatchewan', lat: 52.9399, lng: -106.4509, countryCode: 'CA' },
    { code: 'NS', name: 'Nova Scotia', lat: 44.6820, lng: -63.7443, countryCode: 'CA' },
    { code: 'NB', name: 'New Brunswick', lat: 46.5653, lng: -66.4619, countryCode: 'CA' },
    { code: 'NL', name: 'Newfoundland and Labrador', lat: 53.1355, lng: -57.6604, countryCode: 'CA' },
    { code: 'PE', name: 'Prince Edward Island', lat: 46.5107, lng: -63.4168, countryCode: 'CA' },
    { code: 'NT', name: 'Northwest Territories', lat: 61.9240, lng: -113.6458, countryCode: 'CA' },
    { code: 'YT', name: 'Yukon Territory', lat: 64.0685, lng: -139.0686, countryCode: 'CA' },
    { code: 'NU', name: 'Nunavut', lat: 70.2998, lng: -83.1076, countryCode: 'CA' }
  ];

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