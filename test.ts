<div class="ss-widget">
  <div class="legend-wrapper">
    <!-- Search -->
    <div class="search-box">
      <input type="text" placeholder="Search by country" [(ngModel)]="searchTerm" (input)="filterList()" />
      <i class="fas fa-search"></i>
    </div>

    <!-- Country List -->
    <div class="country-list">
      <div *ngFor="let c of filteredList" class="country-card">
        <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
        <div class="country-details">
          <div class="country-name">{{ c.country }}</div>
          <div class="metrics">
            <span>Unique Skills: <b>{{ c.uniqueSkills }}</b></span>
            <span>Skill Supply (FTE): <b>{{ c.skillSupply }}</b></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Globe -->
  <div class="globe-container" #globeContainer></div>
</div>


.ss-widget {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  height: 800px;
}

/* 📋 Left Panel */
.legend-wrapper {
  width: 30%;
  padding: 15px;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 10px;

  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 14px;
    color: #333;
  }

  i {
    color: #666;
  }
}

.country-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.country-card {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
}

.flag-icon {
  width: 24px;
  margin-right: 10px;
}

.country-details {
  flex: 1;

  .country-name {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 2px;
  }

  .metrics {
    font-size: 12px;
    color: #555;
    display: flex;
    flex-direction: column;
  }
}

/* 🌍 Globe */
.globe-container {
  width: 70%;
  height: 100%;
  background: #e0f2fe; // light blue
}


import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryData = { country: string; code: string; uniqueSkills: number; skillSupply: number };

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: CountryData[] = [];
  filteredList: CountryData[] = [];
  searchTerm: string = '';

  private controls!: OrbitControls;
  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = 250;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;

    this.globe = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // 🌍 satellite-style
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    this.countries = topojson.feature(worldData as any, (worldData as any).objects.countries) as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // 📊 Load JSON
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));
      this.filteredList = [...this.countriesList];
      this.globe.polygonsData(this.countries!.features);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  filterList() {
    this.filteredList = this.countriesList.filter(c =>
      c.country.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
