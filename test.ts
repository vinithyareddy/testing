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
import { geoCentroid } from 'd3-geo';

type CountryCost = {
  country: string;
  region: string;
  cost: number;
  code: string;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

const DEFAULT_GLOBE_COLOR = '#84c9f6';
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
const STROKE_COLOR_REGION = '#84c9f6';
const FALLBACK_COLOR = '#e0e0e0';
const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };
const RADIUS = 100;

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

  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private scene!: THREE.Scene;
  private countryMeshes: THREE.Mesh[] = [];

  currentZoom: number = ZOOM.initial;
  selectedView: string = 'By Region';
  showMenu: boolean = false;

  private countryColorScale = d3.scaleLinear<string>()
    .domain([0, 1])
    .range(COUNTRY_COLOR_RANGE);

  constructor(private http: HttpClient) {}

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y =  radius * Math.cos(phi);
    const z =  radius * Math.sin(phi) * Math.sin(theta);

    const v = new THREE.Vector3(x, y, z);

    v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

    return v;
  }

  private createCountryGeometry(feature: any): THREE.BufferGeometry | null {
    try {
      const coordinates = feature.geometry.coordinates;
      const vertices: number[] = [];
      const indices: number[] = [];
      let vertexIndex = 0;

      const processRing = (ring: number[][]) => {
        const startIndex = vertexIndex;
        
        for (const [lng, lat] of ring) {
          if (isNaN(lat) || isNaN(lng)) continue;
          
          const vector = this.latLngToVector3(lat, lng, RADIUS + 0.1);
          vertices.push(vector.x, vector.y, vector.z);
          vertexIndex++;
        }

        // Create triangles for this ring (simple fan triangulation)
        for (let i = startIndex + 1; i < vertexIndex - 1; i++) {
          indices.push(startIndex, i, i + 1);
        }
      };

      if (feature.geometry.type === 'Polygon') {
        coordinates.forEach(processRing);
      } else if (feature.geometry.type === 'MultiPolygon') {
        coordinates.forEach((polygon: number[][][]) => {
          polygon.forEach(processRing);
        });
      }

      if (vertices.length === 0) return null;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      
      return geometry;
    } catch (error) {
      console.warn('Error creating geometry for feature:', error);
      return null;
    }
  }

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    this.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // Create a simple globe without polygon rendering
    this.globe = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .showAtmosphere(false);  // Disable atmosphere for cleaner look

    this.globe.globeMaterial(new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(DEFAULT_GLOBE_COLOR),
      transparent: false
    }));

    // Don't add polygon data to the globe - we'll handle this manually
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.scene.add(this.globe);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '13px';
    tooltip.style.zIndex = '10';
    tooltip.style.display = 'none';
    globeDiv.appendChild(tooltip);

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
      this.createCustomCountries('region');

      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(this.globe);
        if (intersects.length > 0) {
          const point = intersects[0].point;

          let closest: CountryCost | null = null;
          let minDist = Infinity;
          for (const c of this.laborData) {
            if (!c.position) continue;

            const rotatedPos = c.position.clone().applyMatrix4(this.globe.matrixWorld);
            const dist = point.distanceTo(rotatedPos);
            if (dist < minDist) {
              minDist = dist;
              closest = { ...c, position: rotatedPos };
            }
          }

          if (closest && closest.position) {
            const vector = closest.position.clone().project(camera);
            const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
            const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

            tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
            tooltip.style.display = 'block';
            return;
          }
        }

        tooltip.style.display = 'none';
      };

      renderer.domElement.addEventListener('mousemove', handleHover);
      renderer.domElement.addEventListener('click', handleHover);
      renderer.domElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      renderer.render(this.scene, camera);
    };
    animate();
  }

  private createCustomCountries(mode: 'region' | 'country') {
    // Remove existing country meshes
    this.countryMeshes.forEach(mesh => this.scene.remove(mesh));
    this.countryMeshes = [];

    this.countries.features.forEach(feature => {
      const geometry = this.createCountryGeometry(feature);
      if (!geometry) return;

      const countryName = feature.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);

      let color: string;
      if (mode === 'region') {
        color = entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
      } else {
        color = entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }

      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { country: countryName, entry };
      
      this.scene.add(mesh);
      this.countryMeshes.push(mesh);
    });
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateCameraZoom();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateCameraZoom();
  }

  private updateCameraZoom() {
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }

  setView(view: string) {
    this.selectedView = view;
    if (view === 'By Region') {
      this.showRegionData();
      this.createCustomCountries('region');
    } else {
      this.showCountryData();
      this.createCustomCountries('country');
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
}