import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from 'd3';

type CountryCost = { country: string; region: string; cost: number; code: string };

// ✅ Constants
const DEFAULT_GLOBE_COLOR = '#84c9f6';
const REGION_COLORS: Record<string, string> = {
  'North America': '#3c87d7',
  'South America': '#144c88',
  'Other': '#adcdee'
};
const COUNTRY_COLOR_RANGE: [string, string] = ['#bcd3ebff', '#144c88'];
const STROKE_COLOR_COUNTRY = '#7e8790';
const STROKE_COLOR_REGION = '#84c9f6';
const FALLBACK_COLOR = '#e0e0e0';
const REGION_OTHER = 'Other';

const INITIAL_ZOOM = 170;
const ZOOM_STEP = 20;
const MIN_ZOOM = 50;
const MAX_ZOOM = 400;

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

  // Globe + camera state
  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  currentZoom: number = INITIAL_ZOOM;
  selectedView: string = 'By Region';
  showMenu: boolean = false;

  // Color scale for country view
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 100]) // default, updated later
    .range(COUNTRY_COLOR_RANGE);

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGlobe(true).showGraticules(false);
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color(DEFAULT_GLOBE_COLOR) }));

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Load JSON data
    this.http.get<{ countries: any[] }>('assets/data/world-skill-data.json')
      .subscribe(data => {
        this.laborData = data.countries.map(c => ({
          country: c.name,
          region: c.subregion || c.region || REGION_OTHER,
          code: c.code,
          cost: c.skillSupply || 0   // ✅ map skillSupply → cost
        }));

        // update scale based on actual values
        const maxCost = d3.max(this.laborData, d => d.cost) || 100;
        this.countryColorScale.domain([0, maxCost]);

        this.showRegionData();
        this.applyColors('region');
      });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }

  // ✅ Zoom
  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM_STEP, MIN_ZOOM);
    this.updateCameraZoom();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM_STEP, MAX_ZOOM);
    this.updateCameraZoom();
  }

  private updateCameraZoom() {
    if (this.controls.object) {
      this.controls.object.position.z = this.currentZoom;
    }
  }

  // ✅ Dropdown Filter
  setView(view: string) {
    this.selectedView = view;
    if (view === 'By Region') {
      this.showRegionData();
      this.applyColors('region');
    } else {
      this.showCountryData();
      this.applyColors('country');
    }
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

  // ✅ Globe Coloring
  private applyColors(mode: 'region' | 'country') {
    if (!this.countries) return;

    this.globe.polygonsData(this.countries.features)
      .polygonCapColor((d: any) => {
        if (mode === 'region') {
          const region = d.properties.continent || d.properties.subregion || REGION_OTHER;
          return REGION_COLORS[region] || REGION_COLORS[REGION_OTHER];
        } else {
          const entry = this.laborData.find(c => c.country === d.properties.name);
          return entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
        }
      })
      .polygonSideColor(() => DEFAULT_GLOBE_COLOR)
      .polygonStrokeColor(() => mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION);
  }
}
