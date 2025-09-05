import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import Globe from 'three-globe';

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements OnInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  laborData = [
    { region: 'North America', country: 'United States', avgCost: 57, lat: 37, lon: -95, flag: '🇺🇸' },
    { region: 'North America', country: 'Canada', avgCost: 7, lat: 56, lon: -106, flag: '🇨🇦' },
    { region: 'North America', country: 'Mexico', avgCost: 3, lat: 23, lon: -102, flag: '🇲🇽' },
    { region: 'South America', country: '', avgCost: 3, lat: -15, lon: -60, flag: '' },
    { region: 'Europe', country: '', avgCost: 11, lat: 54, lon: 15, flag: '' },
    { region: 'Africa', country: '', avgCost: 19, lat: 1, lon: 17, flag: '' },
    { region: 'Asia', country: '', avgCost: 20, lat: 34, lon: 100, flag: '' },
    { region: 'Oceania', country: '', avgCost: 13, lat: -25, lon: 133, flag: '' },
    { region: 'Antarctica', country: '', avgCost: 5, lat: -90, lon: 0, flag: '' }
  ];

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private globe!: any;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initGlobe();
  }

  initGlobe() {
    const width = this.globeContainer.nativeElement.offsetWidth;
    const height = this.globeContainer.nativeElement.offsetHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 250;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.globeContainer.nativeElement.appendChild(this.renderer.domElement);

    // Globe
    this.globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .pointsData(this.laborData)
      .pointLat('lat')
      .pointLng('lon')
      .pointAltitude(() => 0.05)
      .pointColor(() => 'orange')
      .pointLabel((d: any) => `${d.country || d.region}<br/>Cost: $${d.avgCost}`);

    this.scene.add(this.globe);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += 0.001; // slow rotation
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}


<div class="widget-container">
  <div #globeContainer class="globe"></div>

  <div class="legend">
    <h3>Average Labor cost by Region</h3>
    <table>
      <thead>
        <tr>
          <th>Region and Country</th>
          <th>Average Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of laborData">
          <td>{{ row.flag }} {{ row.country || row.region }}</td>
          <td>\${{ row.avgCost }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


.widget-container {
  display: flex;
  flex-direction: row;
  background-color: #0a4c78;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  min-height: 520px;
}

.globe {
  flex: 1;
  height: 500px;
}

.legend {
  flex: 1;
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.08);
  padding: 15px;
  border-radius: 6px;

  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 8px;
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      color: #ddd;
    }

    td {
      padding: 8px;
      font-size: 14px;
      color: #f5f5f5;
    }

    tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }
  }
}
