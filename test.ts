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
    // Dummy values → only place we define them
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

    const fcvPercent = fcv / total;
    const nonFcvPercent = nonFcv / total;

    // ✅ Gradient for one slice, dynamically split
    const gradient = {
      linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
      stops: [
        [0, data[0].color],
        [fcvPercent, data[0].color],
        [fcvPercent, data[1].color],
        [1, data[1].color],
      ],
    };

    this.chartOptions = {
      chart: {
        type: 'pie',
        height: 260,
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        y: 40,
        text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/>
               <span style="font-size:12px">By FCV Status</span>`,
      },
      tooltip: {
        enabled: false, // disable since it's one slice
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderRadius: 10,
          dataLabels: { enabled: false },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
        },
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'FCV Split',
              y: 100, // always 100% for one slice
              color: gradient,
            },
          ],
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
