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

  // --- dummy country costs (same numbers you’ve been using)
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

  // --- minimal country → region map (only what we need for the UI look)
  private regionMap: Record<string, string> = {
    'United States of America': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    'Brazil': 'South America',
    'France': 'Europe',
    'Nigeria': 'Africa',
    'India': 'Asia',
    'Australia': 'Oceania',
    'Antarctica': 'Antarctica'
  };

  // computed for the legend
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
    camera.position.z = 170;

    const globe: any = new Globe().showGlobe(true).showGraticules(false);
    (globe as any).globeMaterial(new THREE.MeshPhongMaterial({ color: 0x87cefa }));

    // Convert TopoJSON → GeoJSON
    const countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    // ---- compute region averages from dummy data (no hardcoded totals)
    const byRegion: Record<string, CountryCost[]> = {};
    for (const c of this.laborData) {
      const r = this.regionMap[c.country];
      if (!r) continue;
      if (!byRegion[r]) byRegion[r] = [];
      byRegion[r].push(c);
    }
    this.regionAverages = Object.keys(byRegion).map(region => {
      const costs = byRegion[region].map(x => x.cost);
      const avg = Math.round(costs.reduce((a, b) => a + b, 0) / costs.length);
      // sort countries optional (descending)
      byRegion[region].sort((a, b) => b.cost - a.cost);
      return { region, avgCost: avg, countries: byRegion[region] };
    });
    // control the order to mimic your screenshot
    const order = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Antarctica'];
    this.regionAverages.sort((a, b) => order.indexOf(a.region) - order.indexOf(b.region));

    // ---- region color scale (same palette, darker = higher avg)
    const colorForAvg = (avg: number) => {
      if (avg > 40) return '#08306b';
      if (avg > 20) return '#2171b5';
      if (avg > 10) return '#6baed6';
      return '#c6dbef';
    };
    const regionColor: Record<string, string> = {};
    for (const r of this.regionAverages) regionColor[r.region] = colorForAvg(r.avgCost);

    const countryToRegion = (name: string) => this.regionMap[name] ?? null;
    const regionAvg = (name: string) => {
      const r = countryToRegion(name);
      const hit = this.regionAverages.find(x => x.region === r);
      return hit?.avgCost ?? null;
    };

    // ---- paint countries by their region’s average
    globe
      .polygonsData(countries.features)
      .polygonCapColor((d: any) => {
        const r = countryToRegion(d.properties.name);
        return r ? regionColor[r] : '#e8eff6'; // neutral for others
      })
      .polygonSideColor(() => 'rgba(0,0,0,0.10)')
      .polygonStrokeColor(() => '#10283b');

    scene.add(globe);

    // ---- tooltip (version-safe: raycaster)
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

    const move = (evt: MouseEvent) => {
      const rect = globeDiv.getBoundingClientRect();
      mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const obj: any = hits.find(h => h.object?.__data)?.object?.__data;

      if (obj?.properties?.name) {
        const name = obj.properties.name;
        const r = countryToRegion(name);
        const avg = regionAvg(name);
        if (r && avg != null) {
          tooltip.style.display = 'block';
          tooltip.style.left = evt.pageX + 12 + 'px';
          tooltip.style.top = evt.pageY + 12 + 'px';
          tooltip.innerHTML = `<b>${r}</b><br/>Average Cost&nbsp;&nbsp;$${avg}`;
          return;
        }
      }
      tooltip.style.display = 'none';
    };
    globeDiv.addEventListener('mousemove', move);

    // lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // render loop (no rotation)
    const animate = () => {
      requestAnimationFrame(animate);
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
        <ng-container *ngFor="let r of regionAverages">
          <!-- region row -->
          <tr class="region-row">
            <td class="region-name">{{ r.region }}</td>
            <td class="cost">\${{ r.avgCost }}</td>
          </tr>
          <!-- country rows under region -->
          <tr class="country-row" *ngFor="let c of r.countries">
            <td class="country">• {{ c.country }}</td>
            <td class="cost">\${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>


.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
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
  margin: 0 0 8px;
  font-size: 1.2rem;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: rgba(255,255,255,0.1);
}

th, td {
  padding: 6px 10px;
  text-align: left;
}

thead {
  background: rgba(255,255,255,0.25);
}

.region-row td {
  font-weight: 700;
  background: rgba(255,255,255,0.15);
  border-top: 6px solid transparent;
}

.country-row td.country {
  padding-left: 18px;
  opacity: 0.95;
}

.cost { text-align: right; }
