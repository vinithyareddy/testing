import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy data with regions
  laborData = [
    { country: 'United States of America', region: 'North America', cost: 57 },
    { country: 'Canada', region: 'North America', cost: 7 },
    { country: 'Mexico', region: 'North America', cost: 3 },
    { country: 'Brazil', region: 'South America', cost: 3 },
    { country: 'France', region: 'Europe', cost: 11 },
    { country: 'Nigeria', region: 'Africa', cost: 19 },
    { country: 'India', region: 'Asia', cost: 20 },
    { country: 'Australia', region: 'Oceania', cost: 13 },
    { country: 'Antarctica', region: 'Antarctica', cost: 5 }
  ];

  // ✅ Region → Color mapping
  regionColors: Record<string, string> = {
    'North America': '#1f77b4', // blue
    'South America': '#2ca02c', // green
    Europe: '#9467bd',          // purple
    Africa: '#d62728',          // red
    Asia: '#ff7f0e',            // orange
    Oceania: '#17becf',         // teal
    Antarctica: '#7f7f7f'       // grey
  };

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
    camera.position.z = 170;

    // Base globe
    const globe: any = new Globe().showGlobe(true).showGraticules(false);

    (globe as any).globeMaterial(
      new THREE.MeshPhongMaterial({ color: 0x87cefa })
    );

    // Helper to get region color
    const getColor = (name: string) => {
      const found = this.laborData.find((d) => d.country === name);
      if (!found) return 'lightgrey';
      return this.regionColors[found.region] || 'lightgrey';
    };

    // Convert TopoJSON → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // Apply polygons with region-based colors
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => getColor(d.properties.name))
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Render loop (no rotation)
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}
