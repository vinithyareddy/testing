import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';

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
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
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
  private countryMeshes: Map<string, THREE.Object3D> = new Map();
  private labelMeshes: Map<string, THREE.Object3D> = new Map();

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

    // Add country polygons with slight visibility for interaction
    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,100,200,0.1)') // Slight blue tint for debugging
      .polygonSideColor(() => 'rgba(0,100,200,0.05)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0.2)')
      .polygonAltitude(0.02) // Higher altitude for better raycasting
      .onPolygonHover((polygon: any) => {
        // This callback helps with hover detection
        console.log('Polygon hover:', polygon ? polygon.properties.name : 'none');
      })
      .onPolygonClick((polygon: any) => {
        if (polygon) {
          console.log('Polygon clicked:', polygon.properties.name);
        }
      });

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
    this.http.get<any>('assets/data/world-globe-data.json').subscribe({
      next: (data) => {
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
          // Also add some common country name variations
          this.nameToCode.set(c.country.toLowerCase(), c.code);
          if (typeof c.lat === 'number' && typeof c.lng === 'number') {
            this.coordsByCode.set(c.code, { lat: c.lat, lng: c.lng });
          }
        }

        // Add country labels
        this.addCountryLabels();
        
        console.log('Countries loaded:', this.countriesList.length);
      },
      error: (error) => {
        console.error('Error loading country data:', error);
        // Fallback with sample data
        this.createSampleData();
      }
    });
  }

  private createSampleData() {
    // Sample data if JSON file is not available
    this.countriesList = [
      { country: 'United States', code: 'US', uniqueSkills: 57, skillSupply: 20, lat: 39.8283, lng: -98.5795 },
      { country: 'Canada', code: 'CA', uniqueSkills: 45, skillSupply: 15, lat: 56.1304, lng: -106.3468 },
      { country: 'United Kingdom', code: 'GB', uniqueSkills: 42, skillSupply: 18, lat: 55.3781, lng: -3.4360 },
      { country: 'Germany', code: 'DE', uniqueSkills: 50, skillSupply: 22, lat: 51.1657, lng: 10.4515 },
      { country: 'France', code: 'FR', uniqueSkills: 38, skillSupply: 16, lat: 46.2276, lng: 2.2137 },
      { country: 'Japan', code: 'JP', uniqueSkills: 48, skillSupply: 19, lat: 36.2048, lng: 138.2529 },
      { country: 'Australia', code: 'AU', uniqueSkills: 35, skillSupply: 14, lat: -25.2744, lng: 133.7751 },
      { country: 'Brazil', code: 'BR', uniqueSkills: 33, skillSupply: 12, lat: -14.2350, lng: -51.9253 },
      { country: 'India', code: 'IN', uniqueSkills: 52, skillSupply: 25, lat: 20.5937, lng: 78.9629 },
      { country: 'China', code: 'CN', uniqueSkills: 55, skillSupply: 28, lat: 35.8617, lng: 104.1954 }
    ];
    this.filteredList = [...this.countriesList];

    for (const c of this.countriesList) {
      this.nameToCode.set(c.country, c.code);
      this.nameToCode.set(c.country.toLowerCase(), c.code);
      if (typeof c.lat === 'number' && typeof c.lng === 'number') {
        this.coordsByCode.set(c.code, { lat: c.lat, lng: c.lng });
      }
    }

    this.addCountryLabels();
  }

  private addCountryLabels() {
    const labelData = this.countries.features
      .map((f: any) => {
        const name = f.properties.name as string;
        const code = this.nameToCode.get(name) || this.nameToCode.get(name.toLowerCase());
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
        .labelAltitude(0.015)
        .labelSize(1.0)
        .labelDotRadius(0.2)
        .labelColor(() => 'rgba(0,0,0,0.9)')
        .labelResolution(3)
        .onLabelHover((label: any) => {
          console.log('Label hover:', label ? label.country : 'none');
        })
        .onLabelClick((label: any) => {
          if (label) {
            console.log('Label clicked:', label.country);
          }
        });

      console.log('Labels added:', labelData.length);
    }
  }

  private setupMouseEvents() {
    const canvas = this.renderer.domElement;
    let isMouseDown = false;
    
    canvas.addEventListener('mousedown', () => {
      isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (!isMouseDown) { // Only show tooltip when not dragging
        this.updateMousePosition(event);
        this.handleMouseMove(event);
      }
    });

    canvas.addEventListener('click', (event: MouseEvent) => {
      this.updateMousePosition(event);
      this.handleClick(event);
    });

    canvas.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  private handleResize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    const height = host.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private updateMousePosition(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handleMouseMove(event: MouseEvent) {
    const country = this.getIntersectedCountry(event);
    if (country) {
      this.showTooltip(country, event);
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.hideTooltip();
      this.renderer.domElement.style.cursor = 'grab';
    }
  }

  private handleClick(event: MouseEvent) {
    const country = this.getIntersectedCountry(event);
    if (country) {
      console.log('Clicked on:', country.country, country);
    }
  }

  private getIntersectedCountry(event: MouseEvent): CountrySkill | null {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // First try to get country from globe's built-in hover detection
    const intersects = this.raycaster.intersectObjects(this.globe.children, true);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      
      // Convert 3D world position to latitude/longitude
      const radius = 100; // Globe radius
      const lat = Math.asin(point.y / radius) * (180 / Math.PI);
      const lng = Math.atan2(point.z, point.x) * (180 / Math.PI);
      
      // Find the closest country by coordinates
      let closestCountry: CountrySkill | null = null;
      let minDistance = Infinity;
      
      for (const country of this.countriesList) {
        if (country.lat !== undefined && country.lng !== undefined) {
          // Calculate distance using Haversine-like formula (simplified)
          const latDiff = country.lat - lat;
          const lngDiff = country.lng - lng;
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCountry = country;
          }
        }
      }
      
      // Only return country if it's reasonably close (within ~15 degrees)
      if (closestCountry && minDistance < 15) {
        return closestCountry;
      }
    }
    
    // Fallback: try to match against polygon features
    for (const feature of this.countries.features) {
      const countryName = feature.properties.name;
      const country = this.countriesList.find(c => 
        c.country.toLowerCase() === countryName.toLowerCase()
      );
      
      if (country) {
        // Simple bounding box check
        const [lng, lat] = geoCentroid(feature) as [number, number];
        const point = intersects[0]?.point;
        
        if (point) {
          const worldLat = Math.asin(point.y / 100) * (180 / Math.PI);
          const worldLng = Math.atan2(point.z, point.x) * (180 / Math.PI);
          
          if (Math.abs(worldLat - lat) < 10 && Math.abs(worldLng - lng) < 10) {
            return country;
          }
        }
      }
    }
    
    return null;
  }

  private showTooltip(country: CountrySkill, event: MouseEvent) {
    if (!this.tooltip || !this.tooltip.nativeElement) {
      console.warn('Tooltip element not found');
      return;
    }

    const tooltip = this.tooltip.nativeElement;
    const rect = this.renderer.domElement.getBoundingClientRect();
    
    // Format tooltip content
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
    const y = event.clientY - rect.top - 60; // Position above cursor
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';

    // Ensure tooltip stays within bounds
    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const containerRect = this.globeContainer.nativeElement.getBoundingClientRect();
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Adjust horizontal position
      if (x + tooltipRect.width > containerRect.width - 10) {
        adjustedX = x - tooltipRect.width - 30;
      }
      
      // Adjust vertical position
      if (y < 10) {
        adjustedY = event.clientY - rect.top + 25;
      } else if (y + tooltipRect.height > containerRect.height - 10) {
        adjustedY = containerRect.height - tooltipRect.height - 10;
      }
      
      tooltip.style.left = adjustedX + 'px';
      tooltip.style.top = adjustedY + 'px';
    }, 10);
  }

  private hideTooltip() {
    if (this.tooltip && this.tooltip.nativeElement) {
      this.tooltip.nativeElement.style.display = 'none';
      this.tooltip.nativeElement.style.opacity = '0';
    }
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

  selectCountry(country: CountrySkill) {
    if (country.lat !== undefined && country.lng !== undefined) {
      // Update globe rotation to center the country
      this.globe.rotation.y = -country.lng * Math.PI / 180;
      this.globe.rotation.x = -country.lat * Math.PI / 180;
      
      console.log('Selected country:', country.country);
    }
  }

  ngOnDestroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}