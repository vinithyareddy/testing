import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { LiftPopoverComponent } from '@lift/ui';

@Component({
  selector: 'app-ss-by-volume-proficiency-level',
  templateUrl: './ss-by-volume-proficiency-level.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-volume-proficiency-level.component.scss'],
})
export class SsByVolumeProficiencyLevelComponent implements OnInit {
  fullview = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartData: any[] = [];

  constructor(private http: HttpClient, private render: Renderer2) {}

  ngOnInit() {
    // ✅ Load mock JSON now (replace this path later with API endpoint after KT)
    this.http.get<any[]>('assets/json/skill-supply-proficiency.json').subscribe((data) => {
      this.chartData = data;
      this.loadChart();
    });
  }

  loadChart() {
    if (!this.chartData || this.chartData.length === 0) return;

    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Skill Supply by Volume (FTE) and Proficiency Level' },
      credits: { enabled: false },
      xAxis: {
        categories: this.chartData.map((d) => d.proficiency),
        title: { text: 'Proficiency Level' },
      },
      yAxis: {
        min: 0,
        title: { text: 'FTE Count' },
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          dataLabels: { enabled: true },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Skill Supply (FTE)',
          data: this.chartData.map((d) => d.fte),
          colorByPoint: true,
          colors: ['#85CAF7', '#95DAD9', '#A392D3', '#6B70AF'],
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
