import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryCost = { country: string; cost: number };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  laborData: CountryCost[] = [
    { country: 'United States of America', cost: 57 },
    { country: 'Canada', cost: 7 },
    { country: 'Mexico', cost: 3 },
    { country: 'Brazil', cost: 3 },
    { country: 'France', cost: 11 },
    { country: 'Nigeria', cost: 19 },
    { country: 'India', cost: 20 },
    { country: 'Australia', cost: 13 },
    { country: 'Antarctica', cost: 5 }
  ];

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

    // Mouse-drag to rotate
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;     // like your reference widget
    controls.rotateSpeed = 0.6;

    // Base globe
    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));
    if ((globe as any).controls) (globe as any).controls(controls);

    // TopoJSON → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;
    const features = countries.features;

    // helpers to estimate continent/region from centroid
    const centroid = (f: any): [number, number] => {
      const pts: number[][] = [];
      const add = (arr: any) => { for (const r of arr) for (const [x, y] of r) pts.push([x, y]); };
      if (f.geometry.type === 'Polygon') add(f.geometry.coordinates);
      else if (f.geometry.type === 'MultiPolygon') for (const p of f.geometry.coordinates) add(p);
      if (!pts.length) return [0, 0];
      const s = pts.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
      return [s[0] / pts.length, s[1] / pts.length]; // [lon, lat]
    };
    const regionFromLonLat = (lon: number, lat: number): string => {
      if (lat <= -60) return 'Antarctica';
      if (lat >= 5 && lon >= -170 && lon <= -30) return 'North America';
      if (lat < 12 && lat >= -56 && lon >= -90 && lon <= -30) return 'South America';
      if (lat >= 35 && lon >= -30 && lon <= 60) return 'Europe';
      if (lat >= -35 && lat < 35 && lon >= -20 && lon <= 52) return 'Africa';
      if ((lon >= 60 && lon <= 180 && lat >= 5) || (lon >= 35 && lon < 60 && lat >= 15 && lat <= 45)) return 'Asia';
      if (lon >= 110 && lon <= 180 && lat < 0 && lat >= -50) return 'Oceania';
      return 'Europe';
    };
    const REGION_COLORS: Record<string, string> = {
      'North America': '#2D75FF',
      'South America': '#FF4D4F',
      'Europe': '#5A6AFF',
      'Africa': '#2BC48A',
      'Asia': '#FFAA00',
      'Oceania': '#8A63D2',
      'Antarctica': '#B0C4DE'
    };

    // Paint countries by region
    globe
      .polygonsData(features)
      .polygonCapColor((d: any) => {
        const [lon, lat] = centroid(d);
        const region = regionFromLonLat(lon, lat);
        return REGION_COLORS[region] ?? '#e8eff6';
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.10)')
      .polygonStrokeColor(() => '#10283b');

    scene.add(globe);

    // Center initial view on the Americas
    const americasPOV = { lat: 15, lng: -80, altitude: 2.2 };
    if ((globe as any).pointOfView) (globe as any).pointOfView(americasPOV);
    else if ((globe as any).setPointOfView) (globe as any).setPointOfView(americasPOV);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Resize handling (keeps centered)
    window.addEventListener('resize', () => {
      const w = globeDiv.offsetWidth, h = globeDiv.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Render loop (no auto-rotation; user drags with mouse)
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}
