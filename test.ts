import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LiftPopoverComponent } from '@lift/ui';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MockDataService } from 'app/services/mock-data.service';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LiftPopoverComponent,
    HighchartsChartModule,
  ],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  Highcharts: typeof Highcharts = Highcharts;

  pageSize = 9; // categories per page
  currentPage = 0;

  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];

  chartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: [],
      title: {
        text: '',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true }
      }
    },
    series: []
  };

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit() {
    // ✅ Load from JSON dynamically (no UI change)
    this.mockService.getSkillSupplyProficiency().subscribe((data: any[]) => {
      console.log('Proficiency JSON:', data);

      // Extract categories and data
      this.allCategories = data.map(d => d.proficiency || d.name);
      const values = data.map(d => Number(d.fte || d.value));

      // Simulate multiple series by scaling differently (until API gives real series)
      this.allSeriesData = [
        values.map(v => Math.round(v * 0.8)),
        values.map(v => Math.round(v * 1.0)),
        values.map(v => Math.round(v * 1.2)),
        values.map(v => Math.round(v * 0.6)),
      ];

      this.updateChart();
    });
  }

  updateChart() {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);

    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map(s => s.slice(start, end));

    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        ...(this.chartOptions.xAxis as Highcharts.XAxisOptions),
        categories: pageCategories
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 22,
        name: seriesNames[idx],
        color: colors[idx],
        showInLegend: true,
        data
      }))
    };
  }

  onLeftClick() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateChart();
    }
  }

  onRightClick() {
    if ((this.currentPage + 1) * this.pageSize < this.allCategories.length) {
      this.currentPage++;
      this.updateChart();
    }
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
