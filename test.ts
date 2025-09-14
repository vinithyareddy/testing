import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
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

// Customizable globe color - change this to any color you want
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
  private globe!: THREE.Mesh;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private countries!: FeatureCollection<Geometry, any>;

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

  private createSmoothCountryTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Use solid globe color background
    ctx.fillStyle = CUSTOM_GLOBE_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a gradient at poles to blend smoothly
    const topGradient = ctx.createLinearGradient(0, 0, 0, 60);
    topGradient.addColorStop(0, CUSTOM_GLOBE_COLOR);
    topGradient.addColorStop(1, CUSTOM_GLOBE_COLOR);
    
    const bottomGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
    bottomGradient.addColorStop(0, CUSTOM_GLOBE_COLOR);
    bottomGradient.addColorStop(1, CUSTOM_GLOBE_COLOR);
    
    // Fill polar regions with solid color to avoid artifacts
    ctx.fillStyle = CUSTOM_GLOBE_COLOR;
    ctx.fillRect(0, 0, canvas.width, 60); // Top 60px
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60); // Bottom 60px
    
    // Draw countries only in the middle band (avoid polar regions)
    this.countries.features.forEach(feature => {
      const countryName = feature.properties.name;
      const entry = this.laborData.find(c => c.country === countryName);
      
      let color = REGION_COLORS['Other'];
      if (entry) {
        if (this.selectedView === 'By Region') {
          color = REGION_COLORS[entry.region] || REGION_COLORS['Other'];
        } else {
          color = this.countryColorScale(entry.cost);
        }
      }
      
      this.drawCountrySmooth(ctx, feature.geometry, canvas.width, canvas.height, color);
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  }

  private drawCountrySmooth(ctx: CanvasRenderingContext2D, geometry: any, width: number, height: number, color: string) {
    ctx.fillStyle = color;
    
    const coordinates = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    
    coordinates.forEach((polygon: any) => {
      polygon.forEach((ring: any) => {
        ctx.beginPath();
        let hasValidPoints = false;
        
        ring.forEach((coord: any, i: number) => {
          const lat = coord[1];
          const lng = coord[0];
          
          // Skip extreme polar regions to avoid line artifacts - more aggressive filtering
          if (Math.abs(lat) > 75) return; // Increased from 80 to 75 degrees
          
          const x = ((lng + 180) / 360) * width;
          const y = ((90 - lat) / 180) * height;
          
          // Additional check to ensure we're not near texture edges
          if (y < 120 || y > height - 120) return;
          
          if (!hasValidPoints) {
            ctx.moveTo(x, y);
            hasValidPoints = true;
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        if (hasValidPoints) {
          ctx.closePath();
          ctx.fill();
        }
      });
    });
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

    // Create perfect sphere
    const sphereGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(CUSTOM_GLOBE_COLOR) });
    this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(this.globe);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

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
      this.applyColors('region');

      // Tooltip using geographic distance (working approach)
      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObject(this.globe);
        if (intersects.length > 0) {
          let intersectionPoint = intersects[0].point;
          
          const inverseMatrix = new THREE.Matrix4().copy(this.globe.matrixWorld).invert();
          intersectionPoint = intersectionPoint.clone().applyMatrix4(inverseMatrix);
          
          const lat = Math.asin(intersectionPoint.y / RADIUS) * (180 / Math.PI);
          const lng = Math.atan2(-intersectionPoint.z, intersectionPoint.x) * (180 / Math.PI);
          
          let closest: CountryCost | null = null;
          let minDistance = Infinity;
          
          for (const country of this.laborData) {
            const dLat = (lat - country.lat) * Math.PI / 180;
            const dLng = (lng - country.lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                     Math.cos(country.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
                     Math.sin(dLng/2) * Math.sin(dLng/2);
            const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            
            if (distance < minDistance) {
              minDistance = distance;
              closest = country;
            }
          }

          if (closest && minDistance < 0.05) {
            tooltip.innerHTML = `<b>${closest.country}</b><br>Region: ${closest.region}<br>Avg Cost: $${closest.cost}`;
            tooltip.style.left = `${event.offsetX + 15}px`;
            tooltip.style.top = `${event.offsetY + 15}px`;
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
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
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
    if (this.camera) this.camera.position.z = this.currentZoom;
  }

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

  private applyColors(mode: 'region' | 'country') {
    if (!this.countries || this.laborData.length === 0) return;

    const texture = this.createSmoothCountryTexture();
    this.globe.material = new THREE.MeshBasicMaterial({ map: texture });
  }
}