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
import { geoCentroid } from 'd3-geo';

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat?: number;
  lng?: number;
};

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip!: ElementRef;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';
  legendCollapsed = false;
  
  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private nameToCode = new Map<string, string>();
  private coordsByCode = new Map<string, { lat: number; lng: number }>();
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private scene!: THREE.Scene;

  currentZoom: number = ZOOM.initial;

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.initializeGlobe();
    this.loadCountryData();
  }

  private initializeGlobe() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(host.offsetWidth, host.offsetHeight);
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, host.offsetWidth / host.offsetHeight, 0.1, 1000);
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    // Hide the default globe surface
    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    }

    // Add custom Earth texture
    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load('https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg');
    const bumpTex = texLoader.load('https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png');

    const R = 100;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 75, 75),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        bumpMap: bumpTex,
        bumpScale: 0.4,
        specular: new THREE.Color(0x222222),
        shininess: 3
      })
    );

    earth.rotation.y = -Math.PI / 2;
    this.globe.add(earth);

    // Load world topology data
    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Add country polygons (invisible but interactive)
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(0.01); // Slight altitude for raycasting

    this.scene.add(this.globe);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);

    // Setup mouse event listeners
    this.setupMouseEvents();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += ROTATION_SPEED;
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private loadCountryData() {
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng
      }));
      this.filteredList = [...this.countriesList];

      // Build lookup maps
      for (const c of this.countriesList) {
        this.nameToCode.set(c.country, c.code);
        if (typeof c.lat === 'number' && typeof c.lng === 'number') {
          this.coordsByCode.set(c.code, { lat: c.lat, lng: c.lng });
        }
      }

      // Add country labels
      this.addCountryLabels();
      
      // Setup userData for polygons after data is loaded
      setTimeout(() => {
        this.setupPolygonUserData();
      }, 500);
    });
  }

  private addCountryLabels() {
    const labelData = this.countries.features
      .map((f: any) => {
        const name = f.properties.name as string;
        const code = this.nameToCode.get(name);
        if (!code) return null;

        const fixed = this.coordsByCode.get(code);
        let lat: number, lng: number;
        if (fixed) {
          ({ lat, lng } = fixed);
        } else {
          [lng, lat] = geoCentroid(f) as [number, number];
        }
        return { code, lat, lng, country: name };
      })
      .filter(Boolean) as { code: string; lat: number; lng: number; country: string }[];

    if (typeof (this.globe as any).labelsData === 'function') {
      this.globe
        .labelsData(labelData)
        .labelText((d: any) => d.code)
        .labelLat((d: any) => d.lat)
        .labelLng((d: any) => d.lng)
        .labelAltitude(0.012)
        .labelSize(0.95)
        .labelDotRadius(0.16)
        .labelColor(() => 'rgba(0,0,0,0.9)')
        .labelResolution(2);

      // Setup userData for labels after they're created
      setTimeout(() => {
        this.setupLabelUserData(labelData);
      }, 300);
    }
  }

  private setupPolygonUserData() {
    // Attach userData to polygons for raycasting
    if (this.globe && this.globe.children) {
      this.countries.features.forEach((feature: any, index: number) => {
        // Find matching globe children and attach polygon data
        this.globe.children.forEach((child: any) => {
          if (child.geometry && child.geometry.type === 'BufferGeometry') {
            if (!child.userData.polygon) {
              child.userData = { polygon: feature };
            }
          }
        });
      });
    }
  }

  private setupLabelUserData(labelData: any[]) {
    // Attach userData to labels for raycasting
    if (this.globe && this.globe.children) {
      labelData.forEach((label: any, index: number) => {
        // Find text mesh objects and attach label data
        this.globe.children.forEach((child: any) => {
          if (child.type === 'Mesh' && child.material && child.material.map) {
            if (!child.userData.label) {
              child.userData = { label };
            }
          }
        });
      });
    }
  }

  private setupMouseEvents() {
    const canvas = this.renderer.domElement;
    
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      this.updateMousePosition(event);
      this.handleMouseMove(event);
    });

    canvas.addEventListener('click', (event: MouseEvent) => {
      this.updateMousePosition(event);
      this.handleClick(event);
    });

    canvas.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  }

  private updateMousePosition(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handleMouseMove(event: MouseEvent) {
    const country = this.getIntersectedCountry();
    if (country) {
      this.showTooltip(country, event);
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.hideTooltip();
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  private handleClick(event: MouseEvent) {
    const country = this.getIntersectedCountry();
    if (country) {
      // Handle country click - you can add navigation or detailed view here
      console.log('Clicked on:', country);
      // Example: You could emit an event or navigate to a detail view
      // this.router.navigate(['/country-detail', country.code]);
    }
  }

  private getIntersectedCountry(): CountrySkill | null {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.globe.children, true);

    for (const intersect of intersects) {
      if (intersect.object && intersect.object.userData) {
        let countryName: string | null = null;

        // Check for label data
        if (intersect.object.userData.label) {
          countryName = intersect.object.userData.label.country;
        }
        // Check for polygon data
        else if (intersect.object.userData.polygon && intersect.object.userData.polygon.properties) {
          countryName = intersect.object.userData.polygon.properties.name;
        }

        if (countryName) {
          const match = this.countriesList.find(c => 
            c.country.trim().toLowerCase() === countryName!.trim().toLowerCase()
          );
          if (match) {
            return match;
          }
        }
      }
    }
    
    // Fallback: try to match by approximate position if direct userData matching fails
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Convert 3D point to lat/lng and find closest country
      const lat = Math.asin(point.y / 100) * 180 / Math.PI;
      const lng = Math.atan2(point.x, point.z) * 180 / Math.PI;
      
      // Find closest country by coordinates (simplified approach)
      let closestCountry: CountrySkill | null = null;
      let minDistance = Infinity;
      
      for (const country of this.countriesList) {
        if (country.lat !== undefined && country.lng !== undefined) {
          const distance = Math.sqrt(
            Math.pow(country.lat - lat, 2) + Math.pow(country.lng - lng, 2)
          );
          if (distance < minDistance && distance < 10) { // Within 10 degrees
            minDistance = distance;
            closestCountry = country;
          }
        }
      }
      
      return closestCountry;
    }

    return null;
  }

  private showTooltip(country: CountrySkill, event: MouseEvent) {
    const tooltip = this.tooltip.nativeElement;
    const rect = this.renderer.domElement.getBoundingClientRect();
    
    // Format tooltip content to match the second image
    tooltip.innerHTML = `
      <div class="country-header">
        <img src="https://flagcdn.com/20x15/${country.code.toLowerCase()}.png" 
             class="flag-icon" 
             alt="${country.country} flag"
             onerror="this.style.display='none'">
        <div class="country-name">${country.country}</div>
      </div>
      <div class="tooltip-metrics">
        <div class="metric-row">
          <span class="metric-label">Unique Skills</span>
          <span class="metric-value">${country.uniqueSkills}</span>
        </div>
        <div class="metric-row">
          <span class="metric-label">Skill Supply (FTE)</span>
          <span class="metric-value">${country.skillSupply}</span>
        </div>
      </div>
    `;

    // Position tooltip
    const x = event.clientX - rect.left + 15;
    const y = event.clientY - rect.top - 15; // Position above cursor
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';

    // Ensure tooltip stays within bounds
    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const containerRect = this.globeContainer.nativeElement.getBoundingClientRect();
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Adjust horizontal position if tooltip goes off-screen
      if (x + tooltipRect.width > containerRect.width - 10) {
        adjustedX = x - tooltipRect.width - 30;
      }
      
      // Adjust vertical position if tooltip goes off-screen
      if (y < 10) {
        adjustedY = event.clientY - rect.top + 25; // Position below cursor instead
      } else if (y + tooltipRect.height > containerRect.height - 10) {
        adjustedY = containerRect.height - tooltipRect.height - 10;
      }
      
      tooltip.style.left = adjustedX + 'px';
      tooltip.style.top = adjustedY + 'px';
    }, 0);
  }

  private hideTooltip() {
    this.tooltip.nativeElement.style.display = 'none';
  }

  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(c =>
        c.country.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
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
    if (this.controls && this.controls.object) {
      this.controls.object.position.z = this.currentZoom;
    }
  }

  // Method to handle country selection from sidebar
  selectCountry(country: CountrySkill) {
    if (country.lat !== undefined && country.lng !== undefined) {
      // Animate camera to focus on selected country
      const phi = (90 - country.lat) * Math.PI / 180;
      const theta = (country.lng + 180) * Math.PI / 180;

      const x = -100 * Math.sin(phi) * Math.cos(theta);
      const y = 100 * Math.cos(phi);
      const z = 100 * Math.sin(phi) * Math.sin(theta);

      // Update globe rotation to center the country
      this.globe.rotation.y = -country.lng * Math.PI / 180;
      this.globe.rotation.x = -country.lat * Math.PI / 180;
    }
  }

  // Cleanup method
  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
  }
}


// Tooltip styling - matches the second image style
.globe-tooltip {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  pointer-events: none;
  display: none;
  z-index: 2000;
  max-width: 250px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  // Flag and country header styling
  .country-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .flag-icon {
      width: 20px;
      height: auto;
      margin-right: 8px;
      border-radius: 2px;
    }
    
    .country-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }
  }

  // Metrics styling
  .tooltip-metrics {
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      color: #4b5563;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .metric-label {
        font-size: 12px;
      }
      
      .metric-value {
        font-weight: 600;
        color: #1f2937;
        font-size: 12px;
      }
    }
  }
}

// Also update the canvas cursor style
canvas {
  border-radius: 12px;
  cursor: default;
}

// Ensure tooltip appears above everything
:host ::ng-deep .globe-tooltip {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  z-index: 2000 !important;
}