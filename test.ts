import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
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
  private svg: any;
  private projection: any;
  private path: any;
  private radius = 300;

  ngAfterViewInit() {
    this.initGlobe();
  }

  /** 🔁 Recalculate and re-render on window resize */
  @HostListener('window:resize')
  onResize() {
    this.renderGlobe();
  }

  /** 📦 Initialize SVG and base layers */
  private initGlobe() {
    const container = this.globeContainer.nativeElement;
    d3.select(container).selectAll('svg').remove(); // clear if any

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.radius = Math.min(width, height) / 2.1;

    // Projection setup
    this.projection = d3.geoOrthographic()
      .scale(this.radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Draw ocean sphere
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.radius)
      .attr('fill', '#8cc0f0');

    // Convert TopoJSON → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    );

    // Draw countries
    this.svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('fill', '#cfe8e3')
      .attr('stroke', '#555')
      .attr('stroke-width', 0.3);
  }

  /** 📐 Re-render when container resizes */
  private renderGlobe() {
    if (!this.svg) return;

    const container = this.globeContainer.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.radius = Math.min(width, height) / 2.1;

    this.projection
      .scale(this.radius)
      .translate([width / 2, height / 2]);

    this.svg
      .attr('width', width)
      .attr('height', height);

    this.svg.select('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.radius);

    this.svg.selectAll('path').attr('d', this.path);
  }
}
