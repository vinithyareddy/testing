import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';

// TopoJSON + world data
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

  laborData = [
    { region: 'United States', cost: 57 },
    { region: 'Canada', cost: 7 },
    { region: 'Mexico', cost: 3 },
    { region: 'South America', cost: 3 },
    { region: 'Europe', cost: 11 },
    { region: 'Africa', cost: 19 },
    { region: 'Asia', cost: 20 },
    { region: 'Oceania', cost: 13 },
    { region: 'Antarctica', cost: 5 }
  ];

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    renderer.setClearColor(0x000000, 0); // transparent bg
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      globeDiv.offsetWidth / globeDiv.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    // 🌍 Base globe (light blue)
    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));

    // Convert TopoJSON → GeoJSON FeatureCollection
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as FeatureCollection<Geometry, any>;

    // helper: get cost for a region
    const getCost = (name: string) => {
      const found = this.laborData.find((d) => d.region === name);
      return found ? found.cost : null;
    };

    // helper: color scale
    const getColor = (name: string) => {
      const cost = getCost(name);
      if (cost === null) return 'lightgrey';
      if (cost > 40) return '#08306b';
      if (cost > 20) return '#2171b5';
      if (cost > 10) return '#6baed6';
      return '#c6dbef';
    };

    // 🗺️ Apply polygons with colors
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => getColor(d.properties.name))
      .polygonSideColor(() => 'rgba(0,0,0,0.1)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    // 💡 Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // 🎥 Renderer loop (NO ROTATION now)
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}
