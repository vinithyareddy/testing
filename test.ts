import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
export class SsByVolumeProficiencyLevelComponent implements OnInit, AfterViewInit {
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  categories: string[] = [];
  dataSeries: number[] = [];
  isChartReady = false;

  constructor(
    private render: Renderer2,
    private mockService: MockDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // 🟢 If chart initialized after view load, redraw once
    setTimeout(() => {
      if (this.isChartReady) this.cdr.detectChanges();
    }, 200);
  }

  loadData() {
    this.mockService.getSkillSupplyProficiency().subscribe({
      next: (data: any[]) => {
        console.log('✅ JSON Loaded:', data);

        if (data && data.length) {
          this.categories = data.map((d) => d.proficiency || d.name);
          this.dataSeries = data.map((d) => Number(d.fte || d.value));
          this.loadChart();
          this.isChartReady = true;
          this.cdr.detectChanges(); // force angular refresh
        } else {
          console.warn('⚠️ No data in JSON file');
        }
      },
      error: (err) => console.error('❌ Error loading JSON:', err)
    });
  }

  loadChart() {
    const colors = ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'];

    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacingTop: 10,
        spacingBottom: 20,
        animation: true
      },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: this.categories,
        title: {
          text: '',
          style: { color: '#111827', fontWeight: '500', fontSize: '13px' },
        },
        labels: {
          style: { color: '#111827', fontWeight: '600', fontSize: '12px' },
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
          dataLabels: {
            enabled: true,
            style: { fontWeight: '500', color: '#111827' }
          }
        }
      },
      legend: { enabled: false },
      series: [
        {
          type: 'column',
          name: 'FTE Count',
          colorByPoint: true,
          colors,
          data: this.dataSeries
        }
      ]
    };
  }

  fullPageView() {
    this.fullview = !this.fullview;
    this.fullview
      ? this.render.addClass(document.body, 'no-scroll')
      : this.render.removeClass(document.body, 'no-scroll');
  }
}
