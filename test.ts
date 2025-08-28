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

  fcvData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  private destroyRef = inject(DestroyRef);

  @ViewChild('chartsection') chartsection!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // ✅ Dummy data defined once here
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

    this.chartOptions = {
      chart: {
        type: 'pie',
        height: 260,
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        useHTML: true,
        text: `<span style="font-size:22px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By FCV Status</span>`,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderRadius: 10, // ✅ curved ends
          showInLegend: true,
          dataLabels: { enabled: false },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'FCV Status',
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
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }
}
