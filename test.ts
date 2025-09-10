import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type CountryCost = { country: string; region: string; cost: number; code: string };

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // ✅ Dummy labor cost data
  laborData: CountryCost[] = [
    { country: 'United States of America', region: 'North America', cost: 57, code: 'US' },
    { country: 'Canada', region: 'North America', cost: 7, code: 'CA' },
    { country: 'Mexico', region: 'North America', cost: 3, code: 'MX' },
    { country: 'Brazil', region: 'South America', cost: 12, code: 'BR' },
    { country: 'Argentina', region: 'South America', cost: 9, code: 'AR' },
    { country: 'Colombia', region: 'South America', cost: 5, code: 'CO' },
    { country: 'Germany', region: 'Europe', cost: 11, code: 'DE' },
    { country: 'Nigeria', region: 'Africa', cost: 19, code: 'NG' },
    { country: 'India', region: 'Asia', cost: 20, code: 'IN' },
    { country: 'Australia', region: 'Oceania', cost: 13, code: 'AU' },
    { country: 'Antarctica', region: 'Antarctica', cost: 5, code: 'AQ' }
  ];

  regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];

  REGION_COLORS: Record<string, string> = {
    'North America': '#3c87d7',
    'South America': '#144c88',
    'Other': '#adcdee' // fallback for all other regions
  };

  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeDiv.offsetWidth, globeDiv.offsetHeight);
    globeDiv.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeDiv.offsetWidth / globeDiv.offsetHeight, 0.1, 1000);
    camera.position.z = 180;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    globe.globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color('#84c9f6') }));

    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // ✅ Region mapping function (kept full dummy lists for coloring)
    const getRegion = (countryName: string): string => {
      const northAmerica = [
        'United States of America', 'Canada', 'Mexico',
        'Guatemala', 'Belize', 'Honduras', 'El Salvador',
        'Nicaragua', 'Costa Rica', 'Panama',
        'Cuba', 'Haiti', 'Dominican Republic', 'Jamaica',
        'Bahamas', 'Trinidad and Tobago', 'Barbados',
        'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines',
        'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis'
      ];

      const southAmerica = [
        'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru',
        'Ecuador', 'Venezuela', 'Bolivia', 'Uruguay', 'Paraguay',
        'Guyana', 'Suriname', 'French Guiana'
      ];

      if (northAmerica.includes(countryName)) return 'North America';
      if (southAmerica.includes(countryName)) return 'South America';
      return 'Other';
    };

    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const region = getRegion(d.properties.name);
        return this.REGION_COLORS[region] || this.REGION_COLORS['Other'];
      })
      .polygonSideColor(() => '#84c9f6');

    scene.add(globe);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // ✅ Group data into regions for legend
    const grouped: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      (grouped[c.region] ||= []).push(c);
    }

    this.regionGroups = Object.keys(grouped).map(region => {
      const arr = grouped[region];
      const total = arr.reduce((s, x) => s + x.cost, 0);
      return { region, total, countries: arr, expanded: false };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  expandRow(region: any) {
    region.expanded = !region.expanded;
  }
}
