import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from 'd3';

type CountryCost = { country: string; region: string; cost: number; code: string };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy labor cost data
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
    { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
    { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
    { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
    { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
    { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' },
    { country: 'Germany', region: 'Europe', cost: 11, code: 'DE' },
    { country: 'Nigeria', region: 'Africa', cost: 19, code: 'NG' },
    { country: 'India', region: 'Asia', cost: 20, code: 'IN' },
    { country: 'Australia', region: 'Oceania', cost: 13, code: 'AU' },
    { country: 'Antarctica', region: 'Antarctica', cost: 5, code: 'AQ' }
  ];

  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];
  countryList: CountryCost[] = [];   // <-- flat country list

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7',
    'South America': '#144c88',
    'Other': '#adcdee' // fallback for all other regions
  };

  // ✅ Zoom + Filter state
  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  currentZoom: number = 170; // initial camera z
  selectedView: string = 'By Region';
  showMenu: boolean = false;

  // ✅ Color scale for country view
  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, d3.max(this.laborData, d => d.cost) || 100])
    .range(["#cce5ff", "#003366"]); // light → dark

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
    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') }));

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // default = region coloring
    this.applyRegionColors();

    scene.add(this.globe);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ initialize regionGroups
    this.showRegionData();

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

  // ✅ Zoom Buttons
  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - 20, 50); // clamp
    this.updateCameraZoom();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + 20, 400); // clamp
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
      this.applyRegionColors();
    } else {
      this.showCountryData();
      this.applyCountryColors();
    }
  }

  private showRegionData() {
    console.log("Switched to Region view");

    // regroup countries into regions
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }

    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.cost, 0);
      return { region, total, countries: arr, expanded: false };
    });

    this.countryList = []; // clear flat list
  }

  private showCountryData() {
    console.log("Switched to Country view");

    // flatten: simply use laborData directly
    this.countryList = [...this.laborData].sort((a, b) => a.country.localeCompare(b.country));

    this.regionGroups = []; // clear region groups
  }

  // ✅ Globe Coloring
  private getRegion(countryName: string): string {
    const northAmerica = [
      'United States of America', 'Canada', 'Mexico',
      'Guatemala', 'Belize', 'Honduras', 'El Salvador',
      'Nicaragua', 'Costa Rica', 'Panama',
      'Cuba', 'Haiti', 'Dominican Republic', 'Jamaica',
      'Bahamas', 'Trinidad and Tobago', 'Barbados',
      'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines',
      'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis'
    ];

    const southAmerica = [
      'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru',
      'Ecuador', 'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay',
      'Guyana', 'Suriname', 'French Guiana'
    ];

    if (northAmerica.includes(countryName)) return 'North America';
    if (southAmerica.includes(countryName)) return 'South America';
    return 'Other';
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
        const entry = this.laborData.find(c => c.country === d.properties.name);
        if (entry) {
          return this.countryColorScale(entry.cost); // cost-based color
        }
        return "#e0e0e0"; // fallback gray
      })
      .polygonSideColor(() => '#84c9f6');
  }
}
