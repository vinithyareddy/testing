import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { FeatureCollection, Geometry } from 'geojson';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {

  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private projection!: d3.GeoProjection;
  private path!: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  private radius = 300;

  ngAfterViewInit() {
    this.drawBasicGlobe();
  }

  @HostListener('window:resize')
  onResize() {
    this.redrawGlobe();
  }

  private drawBasicGlobe() {
    const container = this.globeContainer.nativeElement;
    d3.select(container).selectAll('svg').remove();

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    this.radius = Math.min(width, height) / 2.1;

    // 🌍 Projection setup
    this.projection = d3.geoOrthographic()
      .scale(this.radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    // 🖼️ Base SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // 🌊 Ocean sphere
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.radius)
      .attr('fill', '#8cc0f0')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 0.4);

    // 🗺️ Countries (convert topojson → geojson)
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as FeatureCollection<Geometry, any>;

    // ✅ Draw countries safely
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

  private redrawGlobe() {
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
