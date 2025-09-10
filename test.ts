import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountrySkill = {
  country: string;
  code: string;
  uniqueSkills: number;
  skillSupply: number;
};

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];

  private globe: any;
  private controls!: OrbitControls;
  private countries: FeatureCollection<Geometry, any> | undefined;

  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
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
    camera.position.z = 300;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;

    // 🌍 Globe base
    this.globe = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .backgroundColor('#0d2c46'); // match first widget bg

    this.globe.globeMaterial(new THREE.MeshPhongMaterial({ color: '#5dade2' }));

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Load JSON with skill data
    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));

      this.filteredList = [...this.countriesList];

      this.globe
        .polygonsData(this.countries.features)
        .polygonCapColor(() => '#2ecc71')
        .polygonSideColor(() => '#154361')
        .polygonStrokeColor(() => '#fff')
        .labelsData(this.countries.features)
        .labelLat((d: any) => d.properties.latitude || 0)
        .labelLng((d: any) => d.properties.longitude || 0)
        .labelText((d: any) => d.properties.name)
        .labelSize(1.2)
        .labelDotRadius(0.3)
        .labelColor(() => 'white');
    });

    // 🎥 Animate
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += 0.002;
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  onSearchChange() {
    this.filteredList = this.countriesList.filter(c =>
      c.country.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}


<div class="ss-wrapper">
  <!-- Sidebar -->
  <div class="sidebar">
    <h3>Skill Supply by Location</h3>
    <input
      type="text"
      placeholder="Search by country"
      [(ngModel)]="searchTerm"
      (input)="onSearchChange()"
    />
    <div class="country-list">
      <div *ngFor="let c of filteredList" class="country-item">
        <img [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'" />
        <div class="country-info">
          <strong>{{ c.country }}</strong>
          <p>Unique Skills {{ c.uniqueSkills }}</p>
          <p>Skill Supply (FTE) {{ c.skillSupply }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Globe -->
  <div class="globe-container" #globeContainer></div>
</div>


.ss-wrapper {
  display: flex;
  height: 800px;
  background: #0d2c46;
  color: #fff;
}

.sidebar {
  width: 320px;
  padding: 15px;
  background: #0d2c46;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  input {
    margin-bottom: 10px;
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .country-list {
    flex: 1;
    overflow-y: auto;
  }

  .country-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    color: #000;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  img {
    width: 24px;
    height: auto;
  }

  .country-info {
    p {
      margin: 0;
      font-size: 0.8rem;
    }
  }
}

.globe-container {
  flex: 1;
  aspect-ratio: 1 / 1;
}
