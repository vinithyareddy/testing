<div class="budget-card-box-lg">
  <div class="budget-box-chart-lg">
    <!-- Header -->
    <div class="header-row">
      <div class="widget-heading">
        <span>
          Average Labor cost by Region
          <lift-popover popoverTitle="" popoverText="">
            <i class="far fa-info-circle ml-1"></i>
          </lift-popover>
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="content-area globe-container">
      <div class="globe-chart">
        <highcharts-chart
          [Highcharts]="Highcharts"
          [constructorType]="'mapChart'"
          [options]="chartOptions"
          style="width:100%; height:400px; display:block;">
        </highcharts-chart>
      </div>

      <div class="region-list">
        <h4>Average Labor cost by Region</h4>
        <table>
          <tbody>
            <tr *ngFor="let row of data">
              <td>
                <span *ngIf="row.flag" class="fi fi-{{row.flag}}"></span>
                &nbsp; {{ row.name }}
              </td>
              <td class="text-end">${{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="viewmore">
      <span>View More</span>
      <i class="fa fa-angle-right"></i>
    </div>
  </div>
</div>


.content-area.globe-container {
  display: flex;
  gap: 20px;
  border: 1px solid #ccd5df;
  border-radius: 10px;
  padding: 16px;
  background: #0a3358; // dark blue background
  color: #fff;

  .globe-chart { flex: 1; }

  .region-list {
    flex: 1;
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 12px;

    h4 {
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 15px;
      color: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      td {
        padding: 8px;
        color: #f9fafb;
        vertical-align: middle;
      }

      .text-end { text-align: right; }
      .fi { margin-right: 6px; }
    }
  }
}

import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';

HC_map(Highcharts);

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent {
  Highcharts: typeof Highcharts = Highcharts;

  // dummy data with flags
  data = [
    { code: 'US', name: 'United States', value: 57, flag: 'us' },
    { code: 'CA', name: 'Canada', value: 7, flag: 'ca' },
    { code: 'MX', name: 'Mexico', value: 3, flag: 'mx' },
    { code: 'BR', name: 'South America', value: 3, flag: '' },
    { code: 'EU', name: 'Europe', value: 11, flag: '' },
    { code: 'AF', name: 'Africa', value: 19, flag: '' },
    { code: 'AS', name: 'Asia', value: 20, flag: '' },
    { code: 'OC', name: 'Oceania', value: 13, flag: '' },
    { code: 'AN', name: 'Antarctica', value: 5, flag: '' }
  ];

  chartOptions: Highcharts.Options = {
    chart: { map: worldMap as any, backgroundColor: 'transparent' },
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
      data: this.data.map(d => [d.code, d.value]),
      name: 'Average Cost',
      states: { hover: { color: '#1E90FF' } }
    }]
  };
}


"node_modules/flag-icons/css/flag-icons.min.css",
