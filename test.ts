import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

// 🔹 Add these 3 lines
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
// 🔹 End

@Component({
  selector: 'app-swfp-by-fcv-status',
  templateUrl: './swfp-by-fcv-status.component.html',
  styleUrls: ['./swfp-by-fcv-status.component.scss']
})