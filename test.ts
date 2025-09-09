import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';

@Component({
  selector: 'app-labor-cost-globe',
  templateUrl: './labor-cost-globe.component.html',
  styleUrls: ['./labor-cost-globe.component.scss']
})
export class LaborCostGlobeComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  laborData = [
    { region: 'United States', cost: 57, lat: 37.0902, lng: -95.7129 },
    { region: 'Canada', cost: 7, lat: 56.1304, lng: -106.3468 },
    { region: 'Mexico', cost: 3, lat: 23.6345, lng: -102.5528 },
    { region: 'South America', cost: 3, lat: -14.235, lng: -51.9253 },
    { region: 'Europe', cost: 11, lat: 54.526, lng: 15.2551 },
    { region: 'Africa', cost: 19, lat: 1.3733, lng: 32.2903 },
    { region: 'Asia', cost: 20, lat: 34.0479, lng: 100.6197 },
    { region: 'Oceania', cost: 13, lat: -25.2744, lng: 133.7751 },
    { region: 'Antarctica', cost: 5, lat: -82.8628, lng: 135.0000 }
  ];

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000
    );
    camera.position.z = 300;

    const globe = new Globe()
      .pointOfView({ lat: 20, lng: 0, altitude: 2 })
      .labelsData(this.laborData)
      .labelLat('lat')
      .labelLng('lng')
      .labelText('region')
      .labelSize(1.5)
      .labelDotRadius(0.8)
      .labelColor(() => 'orange')
      .labelResolution(2)
      .labelLabel((d: any) => `${d.region}: $${d.cost}`);

    scene.add(globe);

    const ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();
  }
}

<div class="globe-wrapper">
  <div #globeContainer class="globe-container"></div>

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
        <tr *ngFor="let item of laborData">
          <td>{{ item.region }}</td>
          <td>\${{ item.cost }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #0a2e4d;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
}

.globe-container {
  width: 70%;
  height: 600px;
}

.legend {
  width: 28%;
  background: #0b3d91;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.legend h3 {
  margin-top: 0;
  font-size: 1.2rem;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 6px 10px;
  text-align: left;
}

thead {
  background: rgba(255, 255, 255, 0.2);
}
