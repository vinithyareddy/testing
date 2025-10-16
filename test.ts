import {
    CommonModule
  } from '@angular/common';
  import {
    HttpClient, HttpClientModule
  } from '@angular/common/http';
  import {
    FormsModule
  } from '@angular/forms';
  import {
    AfterViewInit, Component, ElementRef, Renderer2,
    ViewChild, OnDestroy, HostListener, NgZone, DestroyRef, inject
  } from '@angular/core';
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';
  import worldData from 'world-atlas/countries-50m.json';
  import { FeatureCollection, Geometry } from 'geojson';
  import { LiftPopoverComponent } from '@lift/ui';
  import { LiftSectionLoaderComponent } from '@lift/loaders';
  import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
  import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
  import { Store } from '@ngrx/store';
  import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
  import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  import { distinctUntilChanged, debounceTime } from 'rxjs';
  import * as _ from 'lodash';
  
  type CountrySkill = {
    country: string;
    code: string;
    region?: string;
    uniqueSkills: number;
    skillSupply: number;
    lat: number;
    lng: number;
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
    imports: [CommonModule, FormsModule, HttpClientModule,
              LiftPopoverComponent, LiftSectionLoaderComponent],
    styleUrls: ['./ss-by-location.component.scss']
  })
  export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  
    @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;
  
    widgetId = 'SKI_2';
    public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
    private destroyRef = inject(DestroyRef);
  
    // UI flags
    fullview = false;
    ResponseFlag = false;
    legendCollapsed = false;
    isMobile = false;
    isTablet = false;
  
    // Data
    countriesList: CountrySkill[] = [];
    filteredList: CountrySkill[] = [];
    searchTerm = '';
  
    // D3
    private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private projection!: d3.GeoProjection;
    private path!: d3.GeoPath<any, d3.GeoPermissibleObjects>;
    private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private countries!: FeatureCollection<Geometry, any>;
    private states!: FeatureCollection<Geometry, any>;
    private oceans!: FeatureCollection<Geometry, any>;
  
    // Globe control
    private resizeObserver?: ResizeObserver;
    private rotationTimer?: d3.Timer;
    private currentRotation: [number, number] = [0, 0];
    private currentZoom = ZOOM.initial;
    private currentRadius = 300;
    private isDragging = false;
    private isRotating = true;
  
    private countryColorScale = d3.scaleLinear<string>()
      .domain([0, 1])
      .range(['#d9ead3', '#38761d']);
  
    constructor(
      private http: HttpClient,
      private ngZone: NgZone,
      private render: Renderer2,
      public queryBuilder: SwfpQueryBuilderService,
      public store: Store<SwfpFilterState>,
      public apiService: SwfpApiService
    ) { }
  
    // -----------------------------
    // 🧭 Responsive Handling
    // -----------------------------
    @HostListener('window:resize')
    onWindowResize() {
      this.checkScreenSize();
      this.updateProjectionAndRedraw();
    }
  
    private checkScreenSize() {
      const width = window.innerWidth;
      this.isMobile = width <= 767;
      this.isTablet = width > 767 && width <= 1024;
    }
  
    private getResponsiveRadius(): number {
      const el = this.globeContainer?.nativeElement;
      if (!el) return 300;
      const minDim = Math.min(el.offsetWidth, el.offsetHeight);
      return this.isMobile ? minDim * 0.35 :
             this.isTablet ? minDim * 0.4 : minDim * 0.45;
    }
  
    // -----------------------------
    // 🧭 Initialization
    // -----------------------------
    ngAfterViewInit() {
      this.checkScreenSize();
  
      this.fiterDataFromUrl$
        .pipe(
          distinctUntilChanged((a, b) => _.isEqual(a, b)),
          debounceTime(150),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.ResponseFlag = false;
          const filters = this.queryBuilder.buildDynamicFilter(this.widgetId);
          this.apiService.getWidgetData(this.widgetId, filters)
            .subscribe(response => {
              this.ResponseFlag = true;
              this.prepareCountryData(response);
              this.initializeGlobeOnce();
            });
        });
    }
  
    private prepareCountryData(response: any[]) {
      // Map backend response to internal format
      this.countriesList = response.map((r: any) => ({
        country: r.duty_country_descr,
        code: r.country_code || 'UN',
        uniqueSkills: r.unique_skill_cnt || 0,
        skillSupply: r.skill_supply_fte || 0,
        lat: r.lat || 0,
        lng: r.lng || 0
      }));
      this.filteredList = [...this.countriesList];
  
      const min = d3.min(this.countriesList, d => d.uniqueSkills) ?? 0;
      const max = d3.max(this.countriesList, d => d.uniqueSkills) ?? 1;
  
      this.countryColorScale = d3.scaleLinear<string>()
        .domain([min, min + (max - min) * 0.25,
                 min + (max - min) * 0.5,
                 min + (max - min) * 0.75, max])
        .range(['#f5f0e4', '#dbd5c8ff', '#bed8ceff',
                '#99c5b4ff', '#87c3ab']);
    }
  
    // -----------------------------
    // 🌍 Globe Initialization (once)
    // -----------------------------
    private initializeGlobeOnce() {
      if (this.svg) { this.updateProjectionAndRedraw(); return; }
  
      const el = this.globeContainer.nativeElement;
      const { offsetWidth: width, offsetHeight: height } = el;
  
      this.currentRadius = this.getResponsiveRadius();
      this.projection = d3.geoOrthographic()
        .scale(this.currentRadius)
        .translate([width / 2, height / 2])
        .clipAngle(90);
  
      this.path = d3.geoPath().projection(this.projection);
      this.svg = d3.select(el)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
  
      // Background globe
      this.svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', this.currentRadius)
        .attr('fill', CUSTOM_GLOBE_COLOR)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);
  
      // Tooltip
      this.tooltip = d3.select(el)
        .append('div')
        .attr('class', 'globe-tooltip')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('display', 'none');
  
      // Load topojson (cached)
      this.countries = topojson.feature(
        worldData as any, (worldData as any).objects.countries
      ) as unknown as FeatureCollection<Geometry, any>;
  
      this.renderCountries();
      this.setupInteractions();
      this.setupResizeObserver();
      this.startRotation();
    }
  
    // -----------------------------
    // ✋ User Interaction
    // -----------------------------
    private setupInteractions() {
      const drag = d3.drag<SVGCircleElement, unknown>()
        .on('start', () => { this.isDragging = true; this.isRotating = false; })
        .on('drag', (event: any) => {
          const sens = this.isMobile ? 0.4 : 0.25;
          this.currentRotation[0] += event.dx * sens;
          this.currentRotation[1] -= event.dy * sens;
          this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));
          this.projection.rotate(this.currentRotation);
          this.updatePaths();
        })
        .on('end', () => {
          this.isDragging = false;
          // resume rotation after short delay
          setTimeout(() => { if (!this.isDragging) this.isRotating = true; }, 2000);
        });
  
      this.svg.select('circle').call(drag);
    }
  
    // -----------------------------
    // 🔁 Rotation
    // -----------------------------
    private startRotation() {
      this.ngZone.runOutsideAngular(() => {
        this.rotationTimer = d3.timer(() => {
          if (this.isRotating && !this.isDragging) {
            this.currentRotation[0] += ROTATION_SPEED;
            this.projection.rotate(this.currentRotation);
            this.updatePaths();
          }
        });
      });
    }
  
    // -----------------------------
    // 🖼 Rendering
    // -----------------------------
    private renderCountries() {
      if (!this.svg) return;
      const that = this;
  
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
        .on('mouseover', function (event, d: any) {
          that.isRotating = false;
          that.showTooltip(event, d);
        })
        .on('mousemove', (event: any) => this.moveTooltip(event))
        .on('mouseout', () => { this.hideTooltip(); this.isRotating = true; });
    }
  
    private updateProjectionAndRedraw() {
      if (!this.svg) return;
      const el = this.globeContainer.nativeElement;
      const { offsetWidth: width, offsetHeight: height } = el;
  
      this.currentRadius = this.getResponsiveRadius();
      this.projection
        .scale(this.currentRadius * this.currentZoom)
        .translate([width / 2, height / 2]);
      this.svg.attr('viewBox', `0 0 ${width} ${height}`);
      this.updatePaths();
    }
  
    private updatePaths() {
      if (!this.svg) return;
      this.svg.selectAll('.country')
        .attr('d', this.path)
        .attr('fill', (d: any) => this.getCountryColor(d));
      this.svg.select('circle')
        .attr('r', this.currentRadius * this.currentZoom);
    }
  
    private getCountryColor(d: any): string {
      const name = d.properties.name;
      const entry = this.countriesList.find(c => c.country === name);
      return entry ? this.countryColorScale(entry.uniqueSkills) : FALLBACK_COLOR;
    }
  
    // -----------------------------
    // 🧭 Tooltip
    // -----------------------------
    private showTooltip(event: any, d: any) {
      const entry = this.countriesList.find(c => c.country === d.properties.name);
      if (!entry) return;
      const html = `
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
        </div>`;
      this.tooltip.html(html).style('display', 'block');
      this.moveTooltip(event);
    }
  
    private moveTooltip(event: any) {
      const rect = this.globeContainer.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left + 12;
      const y = event.clientY - rect.top + 12;
      this.tooltip.style('left', `${x}px`).style('top', `${y}px`);
    }
  
    private hideTooltip() {
      this.tooltip.style('display', 'none');
    }
  
    // -----------------------------
    // 🔍 Legend, Zoom, Search
    // -----------------------------
    zoomIn() {
      this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
      this.updateProjectionAndRedraw();
    }
  
    zoomOut() {
      this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
      this.updateProjectionAndRedraw();
    }
  
    filterList() {
      const q = this.searchTerm.trim().toLowerCase();
      this.filteredList = !q
        ? [...this.countriesList]
        : this.countriesList.filter(c =>
            c.country.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
          );
    }
  
    toggleLegend() {
      if (!this.isMobile) this.legendCollapsed = !this.legendCollapsed;
    }
  
    // -----------------------------
    // 🧩 Resize Observer
    // -----------------------------
    private setupResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return;
      this.resizeObserver = new ResizeObserver(() => this.updateProjectionAndRedraw());
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  
    // -----------------------------
    // 🧹 Cleanup
    // -----------------------------
    ngOnDestroy() {
      this.rotationTimer?.stop();
      this.resizeObserver?.disconnect();
    }
  }
  