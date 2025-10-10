import { Component, AfterViewInit, DestroyRef } from '@angular/core';
import { SwfpApiService } from 'src/app/shared/services/swfp-api.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import _ from 'lodash';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  widgetId = 'SKI_2';
  countriesList: any[] = [];
  filteredList: any[] = [];

  constructor(
    private apiService: SwfpApiService,
    private http: HttpClient,
    private destroyRef: DestroyRef
  ) {}

  private async loadCountryAndStateMaps() {
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

    return { countryMap, stateMap };
  }

  ngAfterViewInit() {
    this.fiterDataFromUrl$
      .pipe(
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.apiService.getWidgetData(this.widgetId).subscribe(async (response: any) => {
          console.log('API Response for SKI_2:', response);

          const { countryMap, stateMap } = await this.loadCountryAndStateMaps();

          this.countriesList = response.map((r: any) => {
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
}
