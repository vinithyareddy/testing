import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from 'd3';

type CountryCost = {
  country: string;
  region: string;
  cost: number;
  code: string;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

const CUSTOM_GLOBE_COLOR = '#84c9f6';

const REGION_COLORS: Record<string, string> = {
  'North America': '#3c87d7',
  'South America': '#144c88',
  'Asia': '#343875ff',
  'Europe': '#375691ff',
  'Africa': '#83c083ff',
  'Oceania': '#9467bd',
  'Antarctic': '#8c564b',
  'Other': '#adcdee'
};
const COUNTRY_COLOR_RANGE: [string, string] = ['#8db4ddff', '#144c88'];
const STROKE_COLOR_COUNTRY = '#7e8790';
const FALLBACK_COLOR = '#e0e0e0';
const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };
const RADIUS = 300;

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule],
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  laborData: CountryCost[] = [];
  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];
  countryList: CountryCost[] = [];
  private svg: any;
  private projection: any;
  private path: any;
  private countries!: FeatureCollection<Geometry, any>;
  private currentRotation = [0, 0];
  private isRotating = true;
  private tooltip: any;
  private isDragging = false;
  currentZoom: number = ZOOM.initial;
  selectedView: string = 'By Region';
  showMenu: boolean = false;
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(COUNTRY_COLOR_RANGE);

  constructor(private http: HttpClient) { }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const v = new THREE.Vector3(x, y, z);
    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    return v;
  }

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.projection = d3.geoOrthographic()
      .scale(RADIUS)
      .translate([width / 2, height / 2])
      .clipAngle(90);
    this.path = d3.geoPath().projection(this.projection);
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', RADIUS)
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;
    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'tooltip-card')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.laborData = data.countries.map((c: any) => ({
        country: c.name,
        region: c.region,
        cost: c.cost ?? Math.floor(Math.random() * 2),
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, RADIUS)
      }));

      const minCost = d3.min(this.laborData, d => d.cost) || 0;
      const maxCost = d3.max(this.laborData, d => d.cost) || 1;

      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minCost, maxCost])
        .range(COUNTRY_COLOR_RANGE);

      this.showRegionData();
      this.drawCountries();
      this.startRotation();
    });

    const zoom = d3.zoom()
      .scaleExtent([ZOOM.min, ZOOM.max])
      .filter((event) => {
        return event.type === 'wheel';
      })
      .on('zoom', (event) => {
        this.currentZoom = event.transform.k;
        this.projection.scale(RADIUS * event.transform.k);
        this.updateCountries();
      });

    const drag = d3.drag()
      .filter((event) => {
        return event.type !== 'wheel';
      })
      .on('start', (event) => {
        this.isDragging = true;
        this.isRotating = false;
      })
      .on('drag', (event) => {
        const sensitivity = 0.25;
        this.currentRotation[0] += event.dx * sensitivity;
        this.currentRotation[1] -= event.dy * sensitivity;
        this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      })
      .on('end', (event) => {
        this.isDragging = false;
        setTimeout(() => {
          if (!this.isDragging) {
            this.isRotating = true;
          }
        }, 2000);
      });

    this.svg.call(zoom);
    this.svg.select('circle').call(drag);
  }

  private drawCountries() {
    this.svg.selectAll('.country').remove();

    this.svg.selectAll('.country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d))
      .attr('stroke', this.selectedView === 'By Country' ? STROKE_COLOR_COUNTRY : 'none')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        const entry = this.laborData.find(c => c.country === d.properties.name);

        if (entry) {
          let tooltipContent = '';

          if (this.selectedView === 'By Region') {
            // Find the region group to get the total cost
            const regionGroup = this.regionGroups.find(r => r.region === entry.region);
            const regionTotal = regionGroup ? regionGroup.total : entry.cost;
            
            tooltipContent = `
            <div class="tooltip-row tooltip-header">${entry.region}</div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${regionTotal}</b></span>
            </div>
          `;
          } else {
            // Country view - show individual country cost
            const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
            tooltipContent = `
            <div class="tooltip-row tooltip-header">
              <img src="${flagUrl}" />
              <span>${entry.country}</span>
            </div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${entry.cost}</b></span>
            </div>
          `;
          }

          const rect = this.globeContainer.nativeElement.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          this.tooltip.html(tooltipContent)
            .style('left', (x + 15) + 'px')
            .style('top', (y + 15) + 'px')
            .style('display', 'block');
        }
      })
      .on('mousemove', (event: any) => {
        const rect = this.globeContainer.nativeElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.tooltip.style('left', (x + 15) + 'px')
          .style('top', (y + 15) + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.style('display', 'none');
      });
  }

  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));

    this.svg.select('circle')
      .attr('r', RADIUS * this.currentZoom);
  }

  private getCountryColor(d: any): string {
    const countryName = d.properties.name;
    const entry = this.laborData.find(c => c.country === countryName);

    if (this.selectedView === 'By Region') {
      return entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
    } else {
      return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
    }
  }

  private startRotation() {
    const rotate = () => {
      if (this.isRotating) {
        this.currentRotation[0] += ROTATION_SPEED;
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      }
      requestAnimationFrame(rotate);
    };
    rotate();
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }

  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.projection.scale(RADIUS * this.currentZoom);
    this.updateCountries();
  }

  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.projection.scale(RADIUS * this.currentZoom);
    this.updateCountries();
  }

  setView(view: string) {
    this.selectedView = view;
    if (view === 'By Region') {
      this.showRegionData();
    } else {
      this.showCountryData();
    }
    this.drawCountries();
  }

  private showRegionData() {
    const grouped = this.laborData.reduce((acc, c) => {
      (acc[c.region] ||= []).push(c);
      return acc;
    }, {} as Record<string, CountryCost[]>);

    this.regionGroups = Object.entries(grouped).map(([region, arr]) => ({
      region,
      total: arr.reduce((s, x) => s + x.cost, 0),
      countries: arr,
      expanded: false
    }));

    this.countryList = [];
  }

  private showCountryData() {
    this.countryList = [...this.laborData].sort((a, b) => a.country.localeCompare(b.country));
    this.regionGroups = [];
  }

  private applyColors(mode: 'region' | 'country') {
    this.updateCountries();
  }
}