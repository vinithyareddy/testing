import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { PopoverConfig } from '@lift/ui';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-swfp-by-location',
  templateUrl: './swfp-by-location.component.html',
  styleUrls: ['./swfp-by-location.component.scss'],
})
export class SwfpByLocationComponent implements OnInit, AfterViewInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  locationData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // ✅ Sample data (can later be replaced with API response)
    this.locationData = [
      { name: 'US', value: 101, color: '#a392d3' },     // lighter purple
      { name: 'Non-US', value: 112, color: '#523b92' }  // darker purple
    ];
  }

  ngAfterViewInit(): void {
    if (this.locationData.length > 0) {
      this.onInitLoad(this.locationData);
    }
  }

  loadWidget(type: string) {
    this.widgetType = type;
  }

  onInitLoad(data: any[]): void {
    this.ResponseFlag = true;
    const total = data.reduce((acc, cur) => acc + cur.value, 0);

    this.chartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        y: -10,
        text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By Location</span>`,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          size: '140%',
          borderRadius: 0, // ✅ makes partition line straight
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: 20,
            format: '{point.y} ({point.percentage:.0f}%)',
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Location',
          data: data.map(d => ({
            name: d.name,
            y: d.value,
            color: d.color
          }))
        },
      ],
    };
  }

  getDetailPage() {
    this.router.navigate(['location'], { relativeTo: this.route });
  }
}
