.globe-widget {
  display: flex;
  background: #0b2540; // dark blue background
  border-radius: 8px;
  overflow: hidden;
  color: #fff;
}

.globe-chart {
  flex: 1;
}

.region-list {
  flex: 1;
  padding: 16px;
  background: #0b2540;
  color: #fff;

  h4 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    .region-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      cursor: pointer;
      font-weight: 600;
    }

    .toggle {
      margin-right: 6px;
    }

    .country-list {
      margin-left: 20px;

      li {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
        font-weight: 400;
      }

      .flag {
        margin-right: 6px;
      }
    }

    .value {
      margin-left: auto;
    }
  }
}


<div class="globe-widget">
  <!-- Left: Globe -->
  <div class="globe-chart">
    <highcharts-chart
      [Highcharts]="Highcharts"
      [constructorType]="'mapChart'"
      [options]="chartOptions"
      style="width:100%; height:400px; display:block">
    </highcharts-chart>
  </div>

  <!-- Right: Region + Country List -->
  <div class="region-list">
    <h4>Average Labor cost by Region</h4>
    <ul>
      <li *ngFor="let r of data">
        <div class="region-row" (click)="toggleRegion(r)">
          <span class="toggle">{{ r.expanded ? '-' : '+' }}</span>
          <span class="region">{{ r.region }}</span>
          <span class="value">\${{ r.value }}</span>
        </div>
        <ul *ngIf="r.expanded && r.countries.length" class="country-list">
          <li *ngFor="let c of r.countries">
            <span class="flag">{{ c.flag }}</span>
            <span class="country">{{ c.name }}</span>
            <span class="value">\${{ c.value }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>


import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent {
  Highcharts: typeof Highcharts = Highcharts;

  // region + country dummy data
  data = [
    {
      region: 'North America',
      value: 67,
      expanded: true,
      countries: [
        { name: 'United States', flag: '🇺🇸', value: 57 },
        { name: 'Canada', flag: '🇨🇦', value: 7 },
        { name: 'Mexico', flag: '🇲🇽', value: 3 }
      ]
    },
    { region: 'South America', value: 3, expanded: false, countries: [] },
    { region: 'Europe', value: 11, expanded: false, countries: [] },
    { region: 'Africa', value: 19, expanded: false, countries: [] },
    { region: 'Asia', value: 20, expanded: false, countries: [] },
    { region: 'Oceania', value: 13, expanded: false, countries: [] },
    { region: 'Antarctica', value: 5, expanded: false, countries: [] }
  ];

  chartOptions: Highcharts.Options = {
    chart: {
      map: worldMap as any,
      backgroundColor: '#0b2540' // dark blue background like screenshot
    },
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    mapNavigation: {
      enabled: true,
      buttonOptions: { verticalAlign: 'bottom' }
    },
    tooltip: {
      pointFormat: 'Average Cost: ${point.value}'
    },
    series: [{
      type: 'map',
      mapData: worldMap as any,
      joinBy: ['iso-a2', 'code'],
      name: 'Average Cost',
      data: [
        ['US', 57], ['CA', 7], ['MX', 3],
        ['BR', 3], ['FR', 11], ['ZA', 19],
        ['CN', 20], ['AU', 13], ['AQ', 5]
      ],
      states: { hover: { color: '#1E90FF' } }
    }]
  };

  toggleRegion(region: any) {
    region.expanded = !region.expanded;
  }
}
