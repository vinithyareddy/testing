<div [ngClass]="{ 'full-view' : fullview }">
  <div class="budget-card-box-lg" #cartboxchartsection>
    <div class="budget-box-chart-lg">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <!-- Left Section-->
        <div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center"
          [ngClass]="{'text-center w-100': isMobile}">
          <span class="d-inline-flex">
            Skill Supply by Location
            <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
          </span>
        </div>

        <!-- Right Section -->
        <div class="col-md-4 d-flex justify-content-end align-items-center header-icons"
          [ngClass]="{'justify-content-center w-100': isMobile}">
          <!-- Toggle Buttons -->
          <div class="d-flex gap-3">
            <span (click)="fullPageView()" class="view">
              @if (!fullview) {
              <i class="fas fa-expand" title="Expand View" alt="Expand"></i>
              }
              @if (fullview) {
              <i class="fas fa-compress" title="Collapse View" alt="Collapse"></i>
              }
            </span>
            <div class="ellipsis ml-2">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader Section -->
      <ng-container *ngIf="!isDataLoaded">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Main Content - Only shown when data is loaded -->
      <ng-container *ngIf="isDataLoaded">
        <!-- Main Widget Container -->
        <div class="ss-widget" [ngClass]="{'mobile-layout': isMobile}">
          <!-- Legend Section -->
          <div class="legend-toggle" [class.collapsed]="legendCollapsed && !isMobile"
            [class.mobile-always-visible]="isMobile">
            <div class="legend-wrapper">
              <!-- Search Box -->
              <div class="search-box">
                <input type="text" [placeholder]="isMobile ? 'Search countries...' : 'Search by country'"
                  [(ngModel)]="searchTerm" (input)="filterList()" />
                <i class="fas fa-search"></i>
              </div>

              <!-- Country List -->
              <div class="country-list">
                <div *ngFor="let c of filteredList" class="country-card" (click)="focusOnCountry(c)"
                  [attr.aria-label]="'Focus on ' + c.country">
                  <div class="country-header">
                    <img [src]="'assets/images/flags/' + c.code.toLowerCase() + '.svg'" class="flag-icon"
                      [alt]="c.country + ' flag'" />
                    <div class="country-name">{{ c.country }}</div>
                  </div>
                  <div class="metrics">
                    <div class="metric-labels">
                      <span>{{ isMobile ? 'Skills' : 'Unique Skills' }}</span>
                      <span>{{ isMobile ? 'Supply' : 'Skill Supply (FTE)' }}</span>
                    </div>
                    <div class="metric-values">
                      <span>{{ c.uniqueSkills }}</span>
                      <span>{{ c.skillSupply }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle button for legend -->
            <button class="toggle-btn" (click)="toggleLegend()" [style.display]="isMobile ? 'none' : 'flex'"
              [attr.aria-label]="legendCollapsed ? 'Show legend' : 'Hide legend'">
              <i class="fas" [ngClass]="legendCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
            </button>
          </div>

          <!-- Globe Container -->
          <div #globeContainer class="globe-wrapper">
            <!--Zoom Controls -->
            <div class="zoom-container">
              <button (click)="zoomIn()" [attr.aria-label]="'Zoom in'"
                [style.font-size]="isMobile ? '32px' : '30px'">+</button>
              <button (click)="zoomOut()" [attr.aria-label]="'Zoom out'"
                [style.font-size]="isMobile ? '32px' : '30px'">-</button>
            </div>
          </div>

          <!-- Tooltip -->
          <div #tooltip class="globe-tooltip"></div>
        </div>

        <!-- View More Section -->
        <div class="viewmore pointer mt-3 pt-3">
          <span>{{ isMobile ? 'More' : 'View More' }}&nbsp;&nbsp;</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
  
  <ng-template #infotemp>
    <lift-popover class="lift-popover-icon" popoverTitle="" popoverText="">
      <span><i aria-hidden="true" class="far fa-info-circle"></i></span>
    </lift-popover>
  </ng-template>
</div>

.loader-img {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    
    @include mobile {
      min-height: 300px;
    }
    
    @include tablet {
      min-height: 350px;
    }
  }


  import { LiftSectionLoaderComponent } from '@lift/loaders';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent, LiftSectionLoaderComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  // ... existing properties ...
  isDataLoaded = false; // Add this property

  ngAfterViewInit() {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isDataLoaded = false; // Set to false when starting to load
        const dynamicFilters: string = this.queryBuilder.buildDynamicFilter(this.widgetId);
        this.apiService.getWidgetData(this.widgetId, dynamicFilters).subscribe(async (response: any) => {
          const countryJson = await this.http.get<any>('assets/json/world-globe-data.json').toPromise();
          const countryMap: Record<string, any> = {};
          countryJson.countries.forEach((c: any) => {
            countryMap[c.name.toLowerCase()] = c;
          });

          this.countriesList = response.map((r: any) => {
            const meta = countryMap[r.duty_country_descr?.toLowerCase()] || {};
            return {
              country: r.duty_country_descr,
              code: meta.code || 'UN',
              region: meta.region || 'Unknown',
              uniqueSkills: r.unique_skill_cnt || 0,
              skillSupply: r.skill_supply_fte || 0,
              lat: meta.lat || 0,
              lng: meta.lng || 0
            };
          });

          this.filteredList = [...this.countriesList];
          let minSkills = d3.min(this.countriesList, (d: any) => d.uniqueSkills) || 0;
          let maxSkills = d3.max(this.countriesList, (d: any) => d.uniqueSkills) || 1;
          if (maxSkills - minSkills < 20) {
            minSkills = 0;
            maxSkills = maxSkills * 2;
          }

          this.countryColorScale = d3.scaleLinear<string>()
            .domain([
              minSkills,
              minSkills + (maxSkills - minSkills) * 0.25,
              minSkills + (maxSkills - minSkills) * 0.5,
              minSkills + (maxSkills - minSkills) * 0.75,
              maxSkills
            ])
            .range([
              '#f5f0e4',
              '#dbd5c8ff',
              '#bed8ceff',
              '#99c5b4ff',
              '#87c3ab'
            ]);

          this.initializeGlobe();
          this.setupResizeObserver();
          
          this.http.get<any>('assets/json/globe-states.json').subscribe(data => {
            this.states = topojson.feature(
              data,
              data.objects.ne_50m_admin_1_states_provinces
            ) as unknown as FeatureCollection<Geometry, any>;
            this.initializeStateLabels();
            this.drawStates();
          });
          
          this.http.get<any>('assets/json/oceans.json').subscribe(data => {
            this.oceans = data;
            this.drawOceans();
          });

          this.initializeCountryLabels();
          this.drawEquator();
          this.drawCountries();
          this.startRotation();
          
          this.isDataLoaded = true; // Set to true when everything is loaded
        });
      });
  }
}