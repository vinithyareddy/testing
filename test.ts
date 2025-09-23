import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  private svg: any;
  private projection: any;
  private path: any;
  private countries!: FeatureCollection<Geometry, any>;
  private currentRotation: [number, number] = [0, 0];
  private isRotating = true;
  private isDragging = false;
  private resizeObserver?: ResizeObserver;
  private radius = 250;

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    this.initializeGlobe();
    this.startRotation();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

  private initializeGlobe(): void {
    const div = this.globeContainer.nativeElement;
    const width = div.offsetWidth;
    const height = div.offsetHeight;

    this.projection = d3.geoOrthographic()
      .scale(this.radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    d3.select(div).selectAll('svg').remove();
    this.svg = d3.select(div).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Globe background
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', this.radius)
      .attr('fill', '#b5e3b5')   // greenish texture
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // Countries
    this.countries = topojson.feature(worldData as any, (worldData as any).objects.countries) as FeatureCollection<Geometry, any>;

    this.drawCountries();

    // Equator line (dotted)
    const graticule = d3.geoGraticule().step([90, 90]); // 90° grid
    this.svg.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', this.path)
      .style('fill', 'none')
      .style('stroke', '#000')
      .style('stroke-dasharray', '3,3')
      .style('stroke-width', 0.7)
      .style('opacity', 0.5);
  }

  private drawCountries(): void {
    this.svg.selectAll('.country').remove();

    this.svg.selectAll('.country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', this.path)
      .attr('fill', '#7fc97f')   // continent fill
      .attr('stroke', '#333')
      .attr('stroke-width', 0.4);
  }

  private handleResize(): void {
    if (!this.svg) return;
    const div = this.globeContainer.nativeElement;
    const width = div.offsetWidth;
    const height = div.offsetHeight;

    this.projection
      .scale(this.radius)
      .translate([width / 2, height / 2]);

    this.svg.attr('viewBox', `0 0 ${width} ${height}`);

    this.updateCountries();
  }

  private updateCountries(): void {
    this.svg.selectAll('.country').attr('d', this.path);
    this.svg.selectAll('.graticule').attr('d', this.path);
  }

  private startRotation(): void {
    const rotate = () => {
      if (this.isRotating && !this.isDragging) {
        this.currentRotation[0] += 0.3; // slow rotation
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }
}


