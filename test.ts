import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountrySupply = {
  country: string;
  code: string;
  uniqueSkills: number;
  skillSupply: number;
};

@Component({
  selector: 'app-ss-by-location',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss'],
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesData: CountrySupply[] = [];
  filteredCountries: CountrySupply[] = [];

  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  currentZoom: number = 170;
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      globeDiv.offsetWidth / globeDiv.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    this.globe = new Globe().showGlobe(true).showGraticules(false);
    this.globe.globeMaterial(new THREE.MeshPhongMaterial({ color: '#84c9f6' }));

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Load JSON with all countries, assign random values
    this.http.get<any>('assets/data/world-globe-data.json').subscribe((data) => {
      this.countriesData = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills && c.uniqueSkills > 0
          ? c.uniqueSkills
          : Math.floor(Math.random() * 100) + 10, // random 10–110
        skillSupply: c.skillSupply && c.skillSupply > 0
          ? c.skillSupply
          : Math.floor(Math.random() * 50) + 5, // random 5–55
      }));

      this.filteredCountries = [...this.countriesData];
      this.applyColors();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += 0.002; // 🌍 auto-rotate
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  private applyColors() {
    if (!this.countries) return;

    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor((d: any) => {
        const entry = this.countriesData.find(
          (c) => c.country === d.properties.name
        );
        return entry ? '#2ca02c' : '#e0e0e0'; // ✅ green if exists, gray fallback
      })
      .polygonSideColor(() => '#84c9f6')
      .polygonStrokeColor(() => '#7e8790');
  }

  // ✅ Search filter
  filterCountries() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCountries = this.countriesData.filter((c) =>
      c.country.toLowerCase().includes(term)
    );
  }
}


<div class="ss-wrapper">
  <!-- Left: Country List -->
  <div class="country-list">
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search by country"
        [(ngModel)]="searchTerm"
        (input)="filterCountries()"
      />
      <i class="fas fa-search"></i>
    </div>

    <div class="country-scroll">
      <div *ngFor="let c of filteredCountries" class="country-item">
        <img
          [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'"
          class="flag-icon"
        />
        <div class="country-info">
          <div class="country-name">{{ c.country }}</div>
          <div class="metrics">
            <span>Unique Skills: {{ c.uniqueSkills }}</span>
            <span>Skill Supply (FTE): {{ c.skillSupply }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right: Globe -->
  <div class="globe-section">
    <div #globeContainer class="globe-container"></div>
  </div>
</div>


.ss-wrapper {
  display: flex;
  height: 800px;
  background: #154361;
  color: #fff;
  padding: 15px;
  gap: 15px;
}

.country-list {
  width: 30%;
  background: #fff;
  color: #000;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
  }

  i {
    margin-left: -25px;
    color: #888;
  }
}

.country-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: 700px;
  padding-right: 6px;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.flag-icon {
  width: 24px;
  height: 18px;
  border: 1px solid #ccc;
}

.country-info {
  display: flex;
  flex-direction: column;

  .country-name {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .metrics {
    font-size: 12px;
    color: #555;
    display: flex;
    flex-direction: column;
  }
}

.globe-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .globe-container {
    width: 100%;
    height: 100%;
  }
}
