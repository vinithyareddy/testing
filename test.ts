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
import { ManagerHighchartService } from 'app/services/manager-highchart.service';

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss'],
})
export class SwfpByFcvStatusComponent implements OnInit, AfterViewInit {
  ResponseFlag = false;
  collapsed = false;
  widgetType = 'ch';

  PieChart: any = [];
  fcvData: any[] = [];

  config1: PopoverConfig = { showPopoverOnClick: true };

  private destroyRef = inject(DestroyRef);

  @ViewChild('chartsection') chartsection!: ElementRef;

  constructor(
    private highChartService: ManagerHighchartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Initialize dummy data here (no hardcoded in chart)
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

    const chartOptions = {
      chartTitle: 'Workforce Supply (FTE)',
      centerVal: total,
      centerTxt: 'By FCV Status',
      chartWidth: this.chartsection.nativeElement.offsetWidth - 30,
      chartHight: 260,
      legendVisible: true,
      donut: true,
      roundedEnds: true,
      dataseries: [
        {
          name: 'FCV Status',
          data: data.map((d) => ({
            name: d.name,
            y: d.value,
            color: d.color,
          })),
        },
      ],
    };

    this.PieChart = this.highChartService.GetDonutChart(chartOptions);
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
