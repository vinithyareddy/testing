import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from 'd3';

type CountryCost = {
  name: string;
  code: string;
  region: string;
  subregion: string;
  lat: number;
  lng: number;
  uniqueSkills: number;
  skillSupply: number;
};

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // Data holders
  laborData: CountryCost[] = [];
  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];
  countryList: CountryCost[] = [];

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7',
    'South America': '#144c88',
    'Other': '#adcdee'
  };

  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  currentZoom: number = 170;
  selectedView: string = 'By Region';
  showMenu: boolean = false;

  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 100]) // will be updated after data load
    .range(["#bcd3ebff", "#144c88"]);

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.http.get<{ countries: CountryCost[] }>('/assets/data/world-skill-data.json')
      .subscribe(data => {
        this.laborData = data.countries;

        // update scale based on max value
        const maxSupply = d3.max(this.laborData, d => d.skillSupply) || 100;
        this.countryColorScale.domain([0, maxSupply]);

        this.initGlobe();
        this.showRegionData();
      });
  }

  private initGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;

    this.globe = new Globe().showGlobe(true).showGraticules(false);
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') }));

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.applyRegionColors();
    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

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

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - 20, 50);
    this.updateCameraZoom();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + 20, 400);
    this.updateCameraZoom();
  }

  private updateCameraZoom() {
    if (this.controls.object) {
      this.controls.object.position.z = this.currentZoom;
    }
  }

  setView(view: string) {
    this.selectedView = view;
    if (view === 'By Region') {
      this.showRegionData();
      this.applyRegionColors();
    } else {
      this.showCountryData();
      this.applyCountryColors();
    }
  }

  private showRegionData() {
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }

    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.skillSupply, 0);
      return { region, total, countries: arr, expanded: false };
    });

    this.countryList = [];
  }

  private showCountryData() {
    this.countryList = [...this.laborData].sort((a, b) => a.name.localeCompare(b.name));
    this.regionGroups = [];
  }

  private getRegion(countryName: string): string {
    // You can map here if needed, fallback = "Other"
    return this.laborData.find(c => c.name === countryName)?.region || 'Other';
  }

  private applyRegionColors() {
    if (!this.countries) return;

    this.globe.polygonsData(this.countries.features)
      .polygonCapColor((d: any) => {
        const region = this.getRegion(d.properties.name);
        return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
      })
      .polygonSideColor(() => '#84c9f6');
  }

  private applyCountryColors() {
    if (!this.countries) return;

    this.globe.polygonsData(this.countries.features)
      .polygonCapColor((d: any) => {
        const entry = this.laborData.find(c => c.name === d.properties.name);
        return entry ? this.countryColorScale(entry.skillSupply) : "#e0e0e0";
      })
      .polygonSideColor(() => '#84c9f6')
      .polygonStrokeColor(() => '#7e8790');
  }
}
