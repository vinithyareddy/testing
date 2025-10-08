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

  pageSize = 9;
  currentPage = 0;

  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];

  chartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: [],
      title: { text: '', style: { color: '#111827', fontWeight: '500', fontSize: '13px' } },
      labels: { style: { color: '#111827', fontWeight: '600', fontSize: '12px' } },
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: { text: 'Staff Count', style: { color: '#111827', fontWeight: '500', fontSize: '13px' } },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB',
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true },
      },
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '{series.name}: {point.y} FTE<br/>'
    },
    series: [],
  };

  constructor(private render: Renderer2, private mockService: MockDataService) {}

  ngOnInit() {
    console.log('🔍 Loading JSON...');
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ Loaded JSON Data:', data);

        if (!data || !Array.isArray(data)) {
          console.error('❌ JSON is not an array or empty');
          return;
        }

        // Ensure correct keys exist
        if (!('Awareness' in data[0])) {
          console.error('❌ JSON keys not matching expected structure (Awareness, Skilled, Advanced, Expert)');
          console.log('Received keys:', Object.keys(data[0]));
          return;
        }

        this.allCategories = data.map((d) => d.level);
        const awareness = data.map((d) => Number(d.Awareness));
        const skilled = data.map((d) => Number(d.Skilled));
        const advanced = data.map((d) => Number(d.Advanced));
        const expert = data.map((d) => Number(d.Expert));

        this.allSeriesData = [awareness, skilled, advanced, expert];
        console.log('📊 Categories:', this.allCategories);
        console.log('📊 Series data:', this.allSeriesData);

        this.updateChart();
      },
      error: (err) => console.error('❌ Error loading JSON:', err),
    });
  }

  updateChart() {
    const start = this.currentPage * this.pageSize;
    const end = Math.min(start + this.pageSize, this.allCategories.length);

    const pageCategories = this.allCategories.slice(start, end);
    const pageSeriesData = this.allSeriesData.map((s) => s.slice(start, end));

    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        ...(this.chartOptions.xAxis as Highcharts.XAxisOptions),
        categories: pageCategories,
      },
      series: pageSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 22,
        name: seriesNames[idx],
        color: colors[idx],
        showInLegend: true,
        data,
      })),
    };

    console.log('✅ Chart updated with:', this.chartOptions);
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


[
    { "level": "Level 1", "Awareness": 33, "Skilled": 56, "Advanced": 30, "Expert": 69 },
    { "level": "Level 2", "Awareness": 6,  "Skilled": 45, "Advanced": 5,  "Expert": 76 },
    { "level": "Level 3", "Awareness": 65, "Skilled": 87, "Advanced": 47, "Expert": 97 },
    { "level": "Level 4", "Awareness": 62, "Skilled": 31, "Advanced": 5,  "Expert": 75 },
    { "level": "Level 5", "Awareness": 73, "Skilled": 12, "Advanced": 84, "Expert": 0 },
    { "level": "Level 6", "Awareness": 90, "Skilled": 61, "Advanced": 50, "Expert": 62 },
    { "level": "Level 7", "Awareness": 20, "Skilled": 85, "Advanced": 24, "Expert": 98 },
    { "level": "Level 8", "Awareness": 30, "Skilled": 64, "Advanced": 57, "Expert": 69 },
    { "level": "Level 9", "Awareness": 26, "Skilled": 55, "Advanced": 13, "Expert": 3 }
  ]
  