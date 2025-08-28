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
import HC_more from 'highcharts/highcharts-more';
import HC_solidGauge from 'highcharts/modules/solid-gauge';

// init Highcharts modules
HC_more(Highcharts);
HC_solidGauge(Highcharts);

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit, AfterViewInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  // ✅ Dummy data only here
  fcvData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  private destroyRef = inject(DestroyRef);

  @ViewChild('chartsection') chartsection!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Dummy values – replace with store/API later
    this.fcvData = [
      { name: 'FCV', value: 104, color: '#00796B' },
      { name: 'Non-FCV', value: 44, color: '#4DB6AC' },
    ];
  }

  ngAfterViewInit(): void {
    if (this.fcvData.length > 0) {
      this.onInitLoad(this.fcvData);
    }
  }

  loadWidget(type: string) {
    this.widgetType = type;
  }

  onInitLoad(data: any[]): void {
    this.ResponseFlag = true;

    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    const fcv = data.find((d) => d.name === 'FCV')?.value || 0;
    const nonFcv = data.find((d) => d.name === 'Non-FCV')?.value || 0;

    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        height: 260,
      },
      title: {
        useHTML: true,
        verticalAlign: 'middle',
        floating: true,
        y: 40,
        text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/>
               <span style="font-size:12px">By FCV Status</span>`,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
      },
      credits: { enabled: false },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        symbolRadius: 6,
        itemStyle: { fontSize: '12px' },
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [
          {
            outerRadius: '100%',
            innerRadius: '70%',
            shape: 'arc',
            borderWidth: 0,
            backgroundColor: '#eee', // neutral background track
          },
        ],
      },
      yAxis: {
        min: 0,
        max: total,
        lineWidth: 0,
        tickPositions: [],
      },
      plotOptions: {
        solidgauge: {
          dataLabels: { enabled: true, format: '{y} ({point.percentage:.0f}%)' },
          rounded: true, // ✅ curved ends
          innerRadius: '70%',
        },
      },
      series: [
        {
          type: 'solidgauge',
          name: 'FCV',
          data: [{ y: fcv, color: data[0].color }],
        },
        {
          type: 'solidgauge',
          name: 'Non-FCV',
          data: [{ y: nonFcv, color: data[1].color }],
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
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }
}
