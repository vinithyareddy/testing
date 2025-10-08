import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiftPopoverComponent } from '@lift/ui';

@Component({
  selector: 'app-swfp-by-gender',
  templateUrl: './swfp-by-gender.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule, LiftPopoverComponent],
  styleUrls: ['./swfp-by-gender.component.scss'],
})
export class SwfpbyGenderComponent implements OnInit {
  fullview = false;
  widgetType = 'ch';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  genderData: any[] = [];

  constructor(private http: HttpClient, private render: Renderer2) {}

  ngOnInit(): void {
    // ✅ Load mock JSON for gender widget (replace with API later)
    this.http.get<any[]>('assets/json/workforce-gender.json').subscribe((data) => {
      // Ensure structure matches Highcharts expected format
      this.genderData = data.map((item) => ({
        name: item.name || item.gender || item.category,
        y: item.value || item.fte,
      }));
      this.loadChart();
    });
  }

  loadWidget(type: any) {
    this.widgetType = type;
  }

  loadChart(): void {
    if (!this.genderData || this.genderData.length === 0) return;
    const totalCount = this.genderData.reduce((sum, item) => sum + item.y, 0);

    this.chartOptions = {
      chart: { type: 'pie' },
      title: {
        text: `<span style="font-size:22px;font-weight:bold">${totalCount}</span><br/><span style="font-size:12px">Workforce Supply (FTE) by Gender</span>`,
        useHTML: true,
      },
      tooltip: { pointFormat: '{point.y} ({point.percentage:.0f}%)' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '85%',
          showInLegend: true,
          dataLabels: { enabled: true, format: '{point.name}: {point.y}' },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Gender',
          data: this.genderData,
        },
      ],
    };
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
