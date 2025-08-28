import { AfterViewInit, Component, OnInit } from '@angular/core';
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

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  fcvData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Dummy data (replace with service/API later)
    this.fcvData = [
      { name: 'FCV', value: 104, color: '#95dad9' },
      { name: 'Non-FCV', value: 44, color: '#3e9b9a' },
    ];
  }

  ngAfterViewInit(): void {
    if (this.fcvData.length > 0) {
      this.onInitLoad(this.fcvData);
    }
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
        text: `<span style="font-size:30px; font-weight:bold">${total}</span><br/><span style="font-size:12px">By FCV Status</span>`,
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.0f}%)',
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          size: '140%',
          borderRadius: 0,
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

  getDetailPage() {
    this.router.navigate(['fcv-status'], { relativeTo: this.route });
  }
}
