import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
import { LiftPopoverComponent } from '@lift/ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SwfpFilterState } from 'app/core/swfp-filter-state/swfp-filter-state';
import { selectEncodedFilter } from 'app/core/swfp-filter-state/swfp-filters.selectors';
import { SwfpApiService } from 'app/modules/shared/swfp-shared/services/swfp-api.service';
import { SwfpQueryBuilderService } from 'app/modules/shared/swfp-shared/services/swfp-query-builder.service';
import { SwfpFilterService } from 'app/modules/shared/swfp-shared/services/swfp-filter.service';
import { SwfpModuleEnum } from 'app/enums/swfp-module.enum';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DestroyRef, inject } from '@angular/core';

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat: number;
  lng: number;
  stateCode?: string | null;
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
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  widgetId: string = 'SKI_2';
  public fiterDataFromUrl$ = this.store.select(selectEncodedFilter);
  private destroyRef = inject(DestroyRef);
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
  private oceans!: FeatureCollection<Geometry, any>;
  private countryColorScale = d3.scaleLinear<string>().domain([0, 1]).range(['#d9ead3', '#38761d']);
  private countryLabelData: Array<{ feature: any; centroid: [number, number]; name: string }> = [];
  private stateLabelData: Array<{ feature: any; centroid: [number, number]; label: string }> = [];
  isMobile = false;
  isTablet = false;
  private mediaQueryMobile!: MediaQueryList;
  private mediaQueryTablet!: MediaQueryList;
  private readonly breakpoints = { mobile: 768, tablet: 1024, desktop: 1200 };

  constructor(
    private http: HttpClient,
    private render: Renderer2,
    public store: Store<SwfpFilterState>,
    public apiService: SwfpApiService
  ) {
    this.setupMediaQueries();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.checkScreenSize();
    this.handleResize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {}

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
    if (this.isMobile) this.legendCollapsed = false;
    if (this.svg) setTimeout(() => this.handleResize(), 100);
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
    if (this.isMobile) return Math.min(minDimension * 0.35, 150);
    else if (this.isTablet) return Math.min(minDimension * 0.4, 200);
    else return Math.min(minDimension * 0.45, 300);
  }

  ngAfterViewInit() {
    this.fiterDataFromUrl$
      .pipe(distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)), debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.apiService.getWidgetData(this.widgetId).subscribe(async (apiData: any[]) => {
          console.log('API Response for SKI_2:', apiData);

          const [countryJson, stateJson] = await Promise.all([
            this.http.get<any>('assets/json/world-globe-data.json').toPromise(),
            this.http.get<any>('assets/json/state-codes.json').toPromise()
          ]);

          const countryMap: Record<string, any> = {};
          countryJson.countries.forEach((c: any) => {
            countryMap[c.name.toLowerCase()] = c;
          });

          const stateMap: Record<string, any> = {};
          stateJson.states.forEach((s: any) => {
            stateMap[s.name.toLowerCase()] = s;
          });

          this.countriesList = apiData.map((r: any) => {
            const meta = countryMap[r.duty_country_descr?.toLowerCase()] || {};
            const stateMeta = stateMap[r.state_name?.toLowerCase()] || {};
            return {
              country: r.duty_country_descr,
              code: meta.code || 'UN',
              region: meta.region || 'Unknown',
              uniqueSkills: r.unique_skill_cnt || 0,
              skillSupply: r.skill_supply_fte || 0,
              lat: meta.lat || 0,
              lng: meta.lng || 0,
              stateCode: stateMeta.state_code || null
            };
          });

          this.filteredList = [...this.countriesList];
          this.initializeCountryLabels();
          this.drawCountries();
          this.drawOceans();
          this.drawEquator();
          this.startRotation();
        });
      });

    this.setupResizeObserver();
    this.initializeGlobe();
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mediaQueryMobile) this.mediaQueryMobile.removeEventListener('change', () => this.updateResponsiveState());
    if (this.mediaQueryTablet) this.mediaQueryTablet.removeEventListener('change', () => this.updateResponsiveState());
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

    this.projection = d3.geoOrthographic().scale(this.currentRadius).translate([width / 2, height / 2]).clipAngle(90);
    this.projection.rotate([0, 0]);
    this.path = d3.geoPath().projection(this.projection);

    d3.select(globeDiv).selectAll('svg').remove();
    this.svg = d3.select(globeDiv).append('svg').attr('width', '100%').attr('height', '100%').attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    const defs = this.svg.append('defs');
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 50).attr('result', 'blur1');
    filter.append('feFlood').attr('flood-color', '#d5fcff').attr('flood-opacity', 1).attr('result', 'flood1');
    filter.append('feComposite').attr('in', 'flood1').attr('in2', 'blur1').attr('operator', 'in').attr('result', 'glow1');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 15).attr('result', 'blur2');
    filter.append('feFlood').attr('flood-color', '#ebffff').attr('flood-opacity', 1).attr('result', 'flood2');
    filter.append('feComposite').attr('in', 'flood2').attr('in2', 'blur2').attr('operator', 'in').attr('result', 'glow2');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'glow1');
    feMerge.append('feMergeNode').attr('in', 'glow2');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    this.svg.append('circle').attr('cx', width / 2).attr('cy', height / 2).attr('r', this.currentRadius).attr('fill', CUSTOM_GLOBE_COLOR).attr('stroke', '#ccc').attr('stroke-width', 1).style('filter', 'url(#glow)');

    this.countries = topojson.feature(worldData as any, (worldData as any).objects.countries) as unknown as FeatureCollection<Geometry, any>;
    d3.select(globeDiv).selectAll('.globe-tooltip').remove();
    this.tooltip = d3.select(globeDiv).append('div').attr('class', 'globe-tooltip').style('position', 'absolute').style('pointer-events', 'none').style('display', 'none');
    this.setupInteractions();
  }

  // 🔹 the rest of your code (drawCountries, updateCountries, tooltips, zoom, etc.) remains exactly the same.
  // Nothing else is changed.
}
