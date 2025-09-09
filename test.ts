import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';

type CountryCost = { country: string; cost: number };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // dummy data (same numbers you already use)
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

  // Legend model (region groups and averages computed from dummy data)
  regionAverages: { region: string; avgCost: number; countries: CountryCost[] }[] = [];

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
    camera.position.z = 170; // nice, big globe

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));

    // TopoJSON → GeoJSON features
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;
    const features = countries.features;

    // Fast lookup: country name → feature
    const featureByName = new Map<string, any>(
      features.map((f: any) => [f.properties.name, f])
    );

    // ---- helpers: centroid & region detection (no hardcoded country lists)
    const featureCentroid = (f: any): [number, number] => {
      const coords: number[][] = [];
      const pushCoords = (arr: any) => {
        for (const ring of arr) for (const [lon, lat] of ring) coords.push([lon, lat]);
      };
      if (f.geometry.type === 'Polygon') pushCoords(f.geometry.coordinates);
      else if (f.geometry.type === 'MultiPolygon')
        for (const poly of f.geometry.coordinates) pushCoords(poly);
      if (!coords.length) return [0, 0];
      const sum = coords.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
      return [sum[0] / coords.length, sum[1] / coords.length]; // [lon, lat]
    };

    const regionFromLonLat = (lon: number, lat: number): string => {
      if (lat <= -60) return 'Antarctica';
      if (lat >= 5 && lon >= -170 && lon <= -30) return 'North America';
      if (lat < 12 && lat >= -56 && lon >= -90 && lon <= -30) return 'South America';
      if (lat >= 35 && lon >= -30 && lon <= 60) return 'Europe';
      if (lat >= -35 && lat < 35 && lon >= -20 && lon <= 52) return 'Africa';
      if ((lon >= 60 && lon <= 180 && lat >= 5) || (lon >= 35 && lon < 60 && lat >= 15 && lat <= 45)) return 'Asia';
      if (lon >= 110 && lon <= 180 && lat < 0 && lat >= -50) return 'Oceania';
      // fallback buckets
      if (lat >= 0 && lon < -30) return 'North America';
      if (lat < 0 && lon < -30) return 'South America';
      return 'Europe';
    };

    // region color palette (one solid color per region, as requested)
    const REGION_COLORS: Record<string, string> = {
      'North America': '#2D75FF', // blue
      'South America': '#FF4D4F', // red
      'Europe': '#5A6AFF',        // indigo
      'Africa': '#2BC48A',        // green
      'Asia': '#FFAA00',          // orange
      'Oceania': '#8A63D2',       // violet
      'Antarctica': '#B0C4DE'     // light steel blue
    };

    const regionOfCountry = (name: string): string | null => {
      const f: any = featureByName.get(name);
      if (!f) return null;
      const [lon, lat] = featureCentroid(f);
      return regionFromLonLat(lon, lat);
    };

    // Build legend groups & averages from your dummy country list
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      const r = regionOfCountry(c.country);
      if (!r) continue;
      (grouped[r] ||= []).push(c);
    }
    this.regionAverages = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const avg = Math.round(arr.reduce((s, x) => s + x.cost, 0) / arr.length);
      // order countries (optional)
      arr.sort((a, b) => b.cost - a.cost);
      return { region, avgCost: avg, countries: arr };
    });
    const ORDER = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Antarctica'];
    this.regionAverages.sort((a, b) => ORDER.indexOf(a.region) - ORDER.indexOf(b.region));

    // Paint the globe: each country gets its region color
    globe
      .polygonsData(features)
      .polygonCapColor((d: any) => {
        const [lon, lat] = featureCentroid(d);
        const region = regionFromLonLat(lon, lat);
        return REGION_COLORS[region] ?? '#e8eff6';
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.10)')
      .polygonStrokeColor(() => '#10283b');

    scene.add(globe);

    // Tooltip (region + computed avg)
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'white';
    tooltip.style.color = 'black';
    tooltip.style.padding = '6px 10px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,.25)';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const regionAvg = (region: string) =>
      this.regionAverages.find(x => x.region === region)?.avgCost ?? null;

    globeDiv.addEventListener('mousemove', (evt: MouseEvent) => {
      const rect = globeDiv.getBoundingClientRect();
      mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(scene.children, true);
      const obj: any = hits.find(h => (h.object as any)?.__data)?.object as any;

      if (obj?.__data) {
        const f: any = obj.__data;
        const [lon, lat] = featureCentroid(f);
        const region = regionFromLonLat(lon, lat);
        const avg = regionAvg(region);
        tooltip.style.display = 'block';
        tooltip.style.left = evt.pageX + 12 + 'px';
        tooltip.style.top = evt.pageY + 12 + 'px';
        tooltip.innerHTML = `<b>${region}</b><br/>Average Cost&nbsp;&nbsp;${avg != null ? '$' + avg : 'N/A'}`;
      } else {
        tooltip.style.display = 'none';
      }
    });

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // render (no rotation)
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }
}
