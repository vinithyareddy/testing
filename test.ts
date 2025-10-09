http://localhost:4200/assets/json/skill-supply-proficiency.json


import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
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
    HighchartsChartModule
  ],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss']
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  fullview = false;
  viewMode: 'chart' | 'table' = 'chart';
  updateFlag = false;

  allCategories: string[] = [];
  allSeriesData: number[][] = [[], [], [], []];

  chartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      categories: [],
      labels: {
        style: { color: '#111827', fontWeight: '600', fontSize: '12px' }
      },
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Staff Count',
        style: { color: '#111827', fontWeight: '500', fontSize: '13px' }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D1D5DB'
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: { fontWeight: '500', fontSize: '13px' }
    },
    plotOptions: {
      column: {
        groupPadding: 0.2,
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: { fontSize: '11px', color: '#111827', textOutline: 'none' }
        }
      }
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '{series.name}: {point.y} FTE<br/>'
    },
    series: []
  };

  constructor(
    private render: Renderer2,
    private mockService: MockDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fetch JSON data
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);
        if (!data?.length) {
          console.error('❌ JSON empty or invalid');
          return;
        }

        // Extract chart data
        this.allCategories = data.map((d) => d.level);
        const awareness = data.map((d) => Number(d.Awareness));
        const skilled = data.map((d) => Number(d.Skilled));
        const advanced = data.map((d) => Number(d.Advanced));
        const expert = data.map((d) => Number(d.Expert));
        this.allSeriesData = [awareness, skilled, advanced, expert];

        // Now build the chart
        this.updateChart();
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  updateChart(): void {
    const seriesNames = ['Awareness', 'Skilled', 'Advanced', 'Expert'];
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        ...(this.chartOptions.xAxis as Highcharts.XAxisOptions),
        categories: this.allCategories
      },
      series: this.allSeriesData.map((data, idx) => ({
        type: 'column',
        pointWidth: 22,
        name: seriesNames[idx],
        color: colors[idx],
        data
      }))
    };

    console.log('📊 Chart Options Updated:', this.chartOptions);
    this.updateFlag = true;
    this.cdr.detectChanges();
  }

  fullPageView(): void {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}
