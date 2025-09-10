import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import Globe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

type Country = {
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
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  countriesList: Country[] = [];
  filteredList: Country[] = [];

  private globe: any;
  private countries: FeatureCollection<Geometry, any> | undefined;
  private controls!: OrbitControls;

  currentZoom = 170;

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

    // 🌍 Globe base
    this.globe = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // satellite-like look
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    scene.add(this.globe);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // 📂 Load data from JSON
    this.http.get<any>('assets/data/world-globe-data.json').subscribe((data) => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        uniqueSkills: c.uniqueSkills && c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply && c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50)
      }));

      this.filteredList = [...this.countriesList];

      this.globe
        .polygonsData(this.countries.features)
        .polygonCapColor(() => '#2ca02c') // green like screenshot
        .polygonSideColor(() => '#154361')
        .polygonStrokeColor(() => '#111')
        .labelsData(this.countries.features)
        .labelLat((d: any) => d.properties.lat || 0)
        .labelLng((d: any) => d.properties.lng || 0)
        .labelText((d: any) => d.properties.name)
        .labelSize(0.8)
        .labelColor(() => 'white')
        .labelResolution(2);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  // 🔎 Search filter
  filterCountries(term: string) {
    const lower = term.toLowerCase();
    this.filteredList = this.countriesList.filter(c =>
      c.country.toLowerCase().includes(lower)
    );
  }
}


<div class="ss-wrapper">
  <!-- Left Sidebar -->
  <div class="sidebar">
    <h3>Skill Supply by Location</h3>
    <input
      type="text"
      placeholder="Search by country"
      (input)="filterCountries($event.target.value)"
    />

    <div class="country-list">
      <div *ngFor="let c of filteredList" class="country-card">
        <div class="flag-name">
          <img
            [src]="'https://flagcdn.com/24x18/' + c.code.toLowerCase() + '.png'"
            alt="{{ c.country }}"
          />
          <span>{{ c.country }}</span>
        </div>
        <div class="skills">
          <div>Unique Skills <strong>{{ c.uniqueSkills }}</strong></div>
          <div>Skill Supply (FTE) <strong>{{ c.skillSupply }}</strong></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Globe -->
  <div class="globe-wrapper">
    <div #globeContainer class="globe-container"></div>
    <div class="zoom-buttons">
      <button (click)="currentZoom = currentZoom - 20">+</button>
      <button (click)="currentZoom = currentZoom + 20">-</button>
    </div>
  </div>
</div>


.ss-wrapper {
  display: flex;
  background: #154361;
  color: #fff;
  height: 100%;
}

.sidebar {
  width: 25%;
  padding: 15px;
  background: #fff;
  color: #000;
  overflow-y: auto;

  h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    padding: 6px 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .country-list {
    max-height: 700px;
    overflow-y: auto;
  }

  .country-card {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;

    .flag-name {
      display: flex;
      align-items: center;
      gap: 8px;

      img {
        width: 20px;
        height: 15px;
      }
    }

    .skills {
      font-size: 0.85rem;
      margin-top: 4px;

      div {
        display: flex;
        justify-content: space-between;
      }

      strong {
        margin-left: 8px;
      }
    }
  }
}

.globe-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .globe-container {
    width: 100%;
    height: 800px;
  }

  .zoom-buttons {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;

    button {
      margin: 2px 0;
      background: #fff;
      border: 1px solid #ccc;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
