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
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;

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

  private createWorldTexture(mode: 'region' | 'country'): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const size = 1024; // High resolution texture
    canvas.width = size;
    canvas.height = size / 2; // 2:1 aspect ratio for equirectangular projection
    const ctx = canvas.getContext('2d')!;
    
    // Fill with default globe color
    ctx.fillStyle = DEFAULT_GLOBE_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create equirectangular projection
    const projection = d3.geoEquirectangular()
      .scale(size / (2 * Math.PI))
      .translate([size / 2, size / 4]);
    
    const path = d3.geoPath(projection, ctx as any);
    
    // Draw countries
    this.countries.features.forEach(feature => {
      const countryName = feature.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);
      
      let color: string;
      if (mode === 'region') {
        color = entry ? REGION_COLORS[entry.region] || REGION_COLORS['Other'] : REGION_COLORS['Other'];
      } else {
        color = entry ? this.countryColorScale(entry.cost) : FALLBACK_COLOR;
      }
      
      ctx.fillStyle = color;
      ctx.strokeStyle = mode === 'country' ? STROKE_COLOR_COUNTRY : STROKE_COLOR_REGION;
      ctx.lineWidth = 0.5;
      
      ctx.beginPath();
      path(feature as any);
      ctx.fill();
      ctx.stroke();
    });
    
    return canvas;
  }

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // Create simple sphere geometry for the globe
    const globeGeometry = new THREE.SphereGeometry(RADIUS, 64, 32);
    
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Create initial globe with texture
    const textureCanvas = this.createWorldTexture('region');
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    const globeMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: false
    });
    
    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.scene.add(this.globe);

    // Add lighting
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
      this.updateGlobeTexture('region');

      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

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
            const vector = closest.position.clone().project(this.camera);
            const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
            const y = (-vector.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;

            tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
            tooltip.style.display = 'block';
            return;
          }
        }

        tooltip.style.display = 'none';
      };

      this.renderer.domElement.addEventListener('mousemove', handleHover);
      this.renderer.domElement.addEventListener('click', handleHover);
      this.renderer.domElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private updateGlobeTexture(mode: 'region' | 'country') {
    const textureCanvas = this.createWorldTexture(mode);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false; // Disable mipmaps for sharper texture
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    if (this.globe.material.map) {
      this.globe.material.map.dispose();
    }
    
    this.globe.material.map = texture;
    this.globe.material.needsUpdate = true;
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
      this.updateGlobeTexture('region');
    } else {
      this.showCountryData();
      this.updateGlobeTexture('country');
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