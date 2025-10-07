/* Make legend circles appear without side lines */
::ng-deep .highcharts-legend-item .highcharts-graph {
  display: none !important; /* removes line from legend symbol */
}

::ng-deep .highcharts-legend-item .highcharts-point {
  stroke-width: 0 !important; /* removes border */
  r: 5 !important; /* controls circle radius */
}
