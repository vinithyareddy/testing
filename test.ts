// =======================================
// Skill Supply by Location (3D Globe Widget)
// =======================================
// Version: Optimized (single init, adaptive labels, no timeouts)
// Features:
// - Smooth auto rotation using requestAnimationFrame
// - Country + state labels (adaptive visibility)
// - Red highlight + tooltip on hover or legend click
// - Depth-aware (no “behind” labels showing in front)
// - Responsive resize without re-render
// - Works with existing HTML + SCSS
// =======================================

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
  HostListener,
  NgZone,
  inject,
  DestroyRef
} from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LiftPopoverComponent } from '@lift/ui';
import { LiftSectionLoaderComponent } from '@lift/loaders';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
import * as _ from 'lodash';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// --------------------
// Type Declarations
// --------------------
type CountrySkill = {
  country: string;
  code: string;
  uniqueSkills: number;
  skillSupply: number;
  lat: number;
  lng: number;
};

@Component({
  selector: 'app-ss-by-location',
  standalone: true,
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent, LiftSectionLoaderComponent]
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

  widgetId = 'SKI_2';
  ResponseFlag = false;
  fullview = false;
  legendCollapsed = false;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';

  isMobile = false;
  isTablet = false;

  // Globe state
  currentZoom = 1;
  currentRadius = 300;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private projection!: d3.GeoProjection;
  private path!: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private countries!: FeatureCollection<Geometry, any>;
  private states!: FeatureCollection<Geometry, any>;
  private isDragging = false;
  private isRotating = true;
  private resizeObserver?: ResizeObserver;
  private colorScale!: d3.ScaleLinear<string, string>;
  private destroyRef = inject(DestroyRef);
  private animationFrameId: number | null = null;
  private currentRotation: [number, number, number] = [0, 0, 0];

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private renderer: Renderer2,
    public queryBuilder: SwfpQueryBuilderService,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {}

  // --------------------------
  // RESPONSIVE + RESIZE LOGIC
  // --------------------------
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.resizeGlobe();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    this.isMobile = width <= 767;
    this.isTablet = width > 767 && width <= 1024;
  }

  private getResponsiveRadius(): number {
    const el = this.globeContainer?.nativeElement;
    if (!el) return 300;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const min = Math.min(w, h);
    if (this.isMobile) return Math.min(min * 0.35, 150);
    if (this.isTablet) return Math.min(min * 0.4, 200);
    return Math.min(min * 0.45, 300);
  }

  // --------------------------
  // INIT
  // --------------------------
  ngAfterViewInit() {
    this.checkScreenSize();

    // Reactive filter watcher
    this.store
      .select(selectEncodedFilter)
      .pipe(distinctUntilChanged((a, b) => _.isEqual(a, b)), debounceTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchData());

    this.initResizeObserver();
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  // --------------------------
  // API + DATA FETCH
  // --------------------------
  private fetchData() {
    this.ResponseFlag = false;
    const dynamicFilter = this.queryBuilder.buildDynamicFilter(this.widgetId);

    this.apiService.getWidgetData(this.widgetId, dynamicFilter).subscribe((resp: any) => {
      this.ResponseFlag = true;

      // Load mapping data (country coordinates + codes)
      this.http.get<any>('assets/json/world-globe-data.json').subscribe(countryJson => {
        const countryMap: Record<string, any> = {};
        countryJson.countries.forEach((c: any) => (countryMap[c.name.toLowerCase()] = c));

        // Prepare dataset
        this.countriesList = resp.map((r: any) => {
          const meta = countryMap[r.duty_country_descr?.toLowerCase()] || {};
          return {
            country: r.duty_country_descr,
            code: meta.code || 'UN',
            uniqueSkills: r.unique_skill_cnt || 0,
            skillSupply: r.skill_supply_fte || 0,
            lat: meta.lat || 0,
            lng: meta.lng || 0
          };
        });

        this.filteredList = [...this.countriesList];
        this.updateColorScale();
        this.initializeGlobeOnce();
        this.updateCountries();
      });
    });
  }

  // --------------------------
  // COLOR SCALE (Dynamic)
  // --------------------------
  private updateColorScale() {
    const min = d3.min(this.countriesList, d => d.uniqueSkills) || 0;
    const max = d3.max(this.countriesList, d => d.uniqueSkills) || 1;
    this.colorScale = d3.scaleLinear<string>().domain([min, max]).range(['#e5efe5', '#2c7a3f']);
  }

  // --------------------------
  // INITIAL GLOBE SETUP
  // --------------------------
  private initializeGlobeOnce() {
    if (this.svg) return; // prevent re-creation

    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    this.projection = d3.geoOrthographic().scale(this.currentRadius).translate([width / 2, height / 2]).clipAngle(90);
    this.path = d3.geoPath().projection(this.projection);
    this.countries = topojson.feature(worldData as any, (worldData as any).objects.countries) as any;

    // Create base SVG
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Base globe sphere
    this.svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius)
      .attr('fill', '#70c7d9')
      .attr('stroke', '#ccc');

    // Tooltip div
    this.tooltip = d3
      .select(container)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.loadStates();
    this.setupInteractions();
    this.startRotationLoop();
  }

  // --------------------------
  // LOAD STATES GEOJSON
  // --------------------------
  private loadStates() {
    this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
      this.states = topojson.feature(data, data.objects.ne_50m_admin_1_states_provinces) as any;
    });
  }

  // --------------------------
  // COUNTRY + STATE RENDER
  // --------------------------
  private updateCountries() {
    if (!this.svg) return;

    const countriesSel = this.svg.selectAll<SVGPathElement, any>('.country').data(this.countries.features);

    countriesSel.exit().remove();

    countriesSel
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('stroke', '#7e8790')
      .attr('stroke-width', 0.5)
      .merge(countriesSel)
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d))
      .on('mouseover', (event: MouseEvent, d: any) => this.showTooltip(event, d))
      .on('mousemove', (event: MouseEvent) => this.moveTooltip(event))
      .on('mouseout', () => this.hideTooltip());

    // Update adaptive labels
    this.updateCountryLabels();
    this.updateStateLabels();
  }

  private getCountryColor(d: any) {
    const entry = this.countriesList.find(c => c.country === d.properties.name);
    return entry ? this.colorScale(entry.uniqueSkills) : '#e0e0e0';
  }

  // --------------------------
  // AUTO ROTATION LOOP
  // --------------------------
  private startRotationLoop() {
    this.zone.runOutsideAngular(() => {
      const rotate = () => {
        if (this.isRotating && !this.isDragging) {
          this.currentRotation[0] += 0.5;
          this.projection.rotate(this.currentRotation);
          this.updateCountries();
        }
        this.animationFrameId = requestAnimationFrame(rotate);
      };
      rotate();
    });
  }

  // --------------------------
  // INTERACTIONS + DRAG
  // --------------------------
  private setupInteractions() {
    const drag = d3
      .drag<SVGCircleElement, unknown>()
      .on('start', () => (this.isDragging = true))
      .on('drag', (event: any) => {
        const sensitivity = this.isMobile ? 0.4 : 0.25;
        this.currentRotation[0] += event.dx * sensitivity;
        this.currentRotation[1] -= event.dy * sensitivity;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      })
      .on('end', () => (this.isDragging = false));

    (this.svg.select('circle') as any).call(drag as any);
  }

  // --------------------------
  // LABEL VISIBILITY CHECK
  // --------------------------
  private isPointVisible(coord: [number, number]): boolean {
    const [lon, lat] = coord;
    const rotated = d3.geoRotation(this.currentRotation)([lon, lat]);
    return rotated[0] > -90 && rotated[0] < 90;
  }

  // --------------------------
  // LABELS (COUNTRY / STATE)
  // --------------------------
  private updateCountryLabels() {
    if (!this.countries) return;

    this.svg.selectAll('.country-label').remove();
    const usedPositions: Array<{ x: number; y: number }> = [];
    const visible = this.countries.features.filter((f: any) => {
      const centroid = d3.geoCentroid(f);
      return this.isPointVisible(centroid);
    });

    visible.forEach((f: any) => {
      const centroid = this.projection(d3.geoCentroid(f));
      if (!centroid) return;
      const [x, y] = centroid;
      const tooClose = usedPositions.some(p => Math.hypot(p.x - x, p.y - y) < 10);
      if (tooClose) return;
      usedPositions.push({ x, y });
      this.svg
        .append('text')
        .attr('class', 'country-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', '8px')
        .style('font-weight', '600')
        .style('fill', '#111')
        .style('stroke', 'white')
        .style('stroke-width', '0.6px')
        .style('paint-order', 'stroke fill')
        .text(f.properties.name);
    });
  }

  private updateStateLabels() {
    if (!this.states || this.currentZoom < 1.2) {
      this.svg.selectAll('.state-label').remove();
      return;
    }

    this.svg.selectAll('.state-label').remove();
    const visibleStates = this.states.features.filter((s: any) => {
      const centroid = d3.geoCentroid(s);
      return this.isPointVisible(centroid);
    });

    visibleStates.forEach((s: any) => {
      const centroid = this.projection(d3.geoCentroid(s));
      if (!centroid) return;
      const [x, y] = centroid;
      const label = s.properties?.name || '';
      this.svg
        .append('text')
        .attr('class', 'state-label')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('font-size', '6px')
        .style('font-weight', '500')
        .style('fill', '#333')
        .style('stroke', 'white')
        .style('stroke-width', '0.5px')
        .text(label);
    });
  }

  // --------------------------
  // TOOLTIP + LEGEND ACTIONS
  // --------------------------
  private showTooltip(event: MouseEvent, d: any) {
    const entry = this.countriesList.find(c => c.country === d.properties.name);
    if (!entry) return;
    const content = `
      <div class="tooltip-header">
        <img class="flag-icon" src="assets/images/flags/${entry.code.toLowerCase()}.svg"/>
        <span>${entry.country}</span>
      </div>
      <div class="tooltip-row"><span class="label">Unique Skills</span><span class="value">${entry.uniqueSkills}</span></div>
      <div class="tooltip-row"><span class="label">Skill Supply (FTE)</span><span class="value">${entry.skillSupply}</span></div>`;
    this.tooltip.html(content).style('display', 'block');
    this.moveTooltip(event);
  }

  private moveTooltip(event: MouseEvent) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left + 15;
    const y = event.clientY - rect.top + 15;
    this.tooltip.style('left', `${x}px`).style('top', `${y}px`);
  }

  private hideTooltip() {
    this.tooltip.style('display', 'none');
  }

  // Called when clicking a country from legend
  focusOnCountry(country: CountrySkill) {
    if (!country) return;
    this.isRotating = false;
    this.currentRotation = [-country.lng, -country.lat, 0];
    this.projection.rotate(this.currentRotation);
    this.updateCountries();

    // Red dashed highlight
    const feature = this.countries.features.find((f: any) => f.properties.name === country.country);
    if (feature) {
      this.svg
        .append('path')
        .datum(feature)
        .attr('class', 'country-highlight')
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', '#ff4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,3')
        .transition()
        .duration(3000)
        .style('opacity', 0)
        .remove();
    }

    // Tooltip near country centroid
    const centroid = this.projection([country.lng, country.lat]);
    if (centroid) {
      const fakeEvent = {
        clientX: centroid[0] + this.globeContainer.nativeElement.getBoundingClientRect().left,
        clientY: centroid[1] + this.globeContainer.nativeElement.getBoundingClientRect().top
      } as MouseEvent;
      this.showTooltip(fakeEvent, { properties: { name: country.country } });
      setTimeout(() => this.hideTooltip(), 2500);
    }

    setTimeout(() => (this.isRotating = true), 3000);
  }

  // --------------------------
  // ZOOM + RESIZE
  // --------------------------
  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + 0.2, 3);
    this.resizeGlobe();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - 0.2, 0.5);
    this.resizeGlobe();
  }

  private initResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.resizeGlobe());
    this.resizeObserver.observe(this.globeContainer.nativeElement);
  }

  private resizeGlobe() {
    if (!this.svg || !this.projection) return;
    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    this.projection.scale(this.currentRadius * this.currentZoom).translate([width / 2, height / 2]);
    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    this.svg
      .select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.currentRadius * this.currentZoom);
    this.updateCountries();
  }

  // --------------------------
  // LEGEND + SEARCH + FULLVIEW
  // --------------------------
  filterList() {
    const q = (this.searchTerm || '').toLowerCase();
    this.filteredList = this.countriesList.filter(
      c => c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }

  toggleLegend() {
    if (!this.isMobile) this.legendCollapsed = !this.legendCollapsed;
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) this.renderer.addClass(document.body, 'no-scroll');
    else this.renderer.removeClass(document.body, 'no-scroll');
    this.resizeGlobe();
  }
}
