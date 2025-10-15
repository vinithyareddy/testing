import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {

  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

  ngAfterViewInit() {
    this.drawBasicGlobe();
  }

  private drawBasicGlobe() {
    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const radius = Math.min(width, height) / 2.1;

    // Create projection and path
    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Clear anything existing
    d3.select(container).selectAll('svg').remove();

    // Append base SVG with numeric width/height
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Draw ocean circle (base sphere)
    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', '#8cc0f0')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 0.5);

    // Convert topojson → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    );

    // Draw countries
    svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#cfe8e3')
      .attr('stroke', '#444')
      .attr('stroke-width', 0.3);

    console.log('✅ Basic globe rendered');
  }
}
