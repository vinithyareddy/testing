import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
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

  private destroyRef = inject(DestroyRef);

  @ViewChild('chartsection') chartsection!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // ✅ Data exactly from the picture
    this.locationData = [
      { name: 'US', value: 101, color: '#7d52a1' },     // lighter purple
      { name: 'Non-US', value: 112, color: '#432874' }  // darker purple
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
        text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By Location</span>`,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '80%',
          size: '150%',
          borderRadius: 10, // curved ends
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.y} ({point.percentage:.0f}%)',
          },
          startAngle: -90, // half donut
          endAngle: 90,
          center: ['50%', '75%'], // lower the chart
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Location',
          data: data.map((d) => ({
            name: d.name,
            y: d.value,
            color: d.color,
          })),
        },
      ],
    };
  }

  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }

  getDetailPage() {
    this.router.navigate(['location'], { relativeTo: this.route });
  }
}
