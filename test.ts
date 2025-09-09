import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json'; // TS may need resolveJsonModule=true in tsconfig

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000
    );
    camera.position.z = 350;

    // 🌍 Flat-style globe (no texture)
    const globe: any = new Globe()
      .showGlobe(true)
      .showGraticules(false)
      .backgroundColor('rgba(0,0,0,0)'); // transparent so dashboard bg shows

    globe.setPointOfView({ lat: 20, lng: 0, altitude: 2 });

    // 🗺 Country polygons (light blue fill, darker border)
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ).features;

    globe
      .polygonsData(countries)
      .polygonCapColor(() => 'rgba(0,150,255,0.7)') // fill
      .polygonSideColor(() => 'rgba(0,150,255,0.3)')
      .polygonStrokeColor(() => '#003366'); // borders

    // 📌 Labels (your labor data)
    globe
      .labelsData(this.laborData)
      .labelLat('lat')
      .labelLng('lng')
      .labelText((d: any) => `${d.region}: $${d.cost}`)
      .labelSize(1.5)
      .labelDotRadius(0.8)
      .labelColor(() => 'orange')
      .labelResolution(2);

    scene.add(globe);

    // 💡 Lights (soft)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 🎥 Animate
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();
  }
}
