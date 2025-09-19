import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import { OrbitControls } from 'three-stdlib';
import { LiftPopoverComponent } from '@lift/ui';

type CountrySkill = {
  country: string;
  code: string;
  region?: string;
  uniqueSkills: number;
  skillSupply: number;
  lat: number;
  lng: number;
  position?: THREE.Vector3;
};

const ROTATION_SPEED = 0.002;
const ZOOM = { initial: 170, step: 20, min: 50, max: 400 };
const RADIUS = 100;

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  fullview = false;

  countriesList: CountrySkill[] = [];
  filteredList: CountrySkill[] = [];
  searchTerm = '';
  legendCollapsed = false;
  private controls!: OrbitControls;
  private globe: any;
  private countries!: FeatureCollection<Geometry, any>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private labelGroup!: THREE.Group;
  private globeGroup!: THREE.Group;
  private lastZoom: number = ZOOM.initial;
  currentZoom: number = ZOOM.initial;
  private isFocusing = false;

  constructor(private http: HttpClient, private render: Renderer2) { }

  private latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  private getCountryPosition(lat: number, lng: number, radius: number = RADIUS): THREE.Vector3 {
    return this.latLngToVector3(lat, lng, radius);
  }

  private createTextSprite(text: string, color: string = '#1f2937', fontSize: number = 18): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;
    const padding = 4;
    canvas.width = textWidth + (padding * 2);
    canvas.height = textHeight + (padding * 2);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `bold ${fontSize}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = 'rgba(0, 0, 0, 0.9)';
    context.shadowBlur = 3;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      depthTest: true,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    const baseScale = 3;
    const scaleX = Math.max(baseScale, textWidth * 0.015);
    const scaleY = baseScale * 0.8;
    sprite.scale.set(scaleX, scaleY, 1);
    return sprite;
  }

  private addCountryLabels() {
    if (this.labelGroup) this.globeGroup.remove(this.labelGroup);
    this.labelGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);
    this.countriesList.forEach(country => {
      if (country.position) {
        const label = this.createTextSprite(country.code, '#ffffff', 26);
        const labelPosition = country.position.clone().normalize();
        labelPosition.multiplyScalar(RADIUS + 0.5);
        label.position.copy(labelPosition);
        (label as any).userData = { country };
        this.labelGroup.add(label);
      }
    });
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;
    const cameraPosition = this.camera.position.clone().normalize();
    const minDistance = 8;
    this.labelGroup.children.forEach((label: any, i: number) => {
      const sprite = label as THREE.Sprite;
      const labelDirection = label.position.clone().normalize();
      const dot = labelDirection.dot(cameraPosition);
      sprite.visible = true;
      if (sprite.visible) {
        const opacity = Math.max(0.3, Math.min(1.0, dot));
        (sprite.material as THREE.SpriteMaterial).opacity = opacity;
        for (let j = 0; j < i; j++) {
          const other = this.labelGroup.children[j] as THREE.Sprite;
          if (other.visible && label.position.distanceTo(other.position) < minDistance) {
            sprite.visible = false;
            break;
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.className = 'globe-tooltip';
    tooltip.style.zIndex = '2000';
    tooltip.style.display = 'none';
    host.appendChild(tooltip);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.z = this.currentZoom;

    // MODIFIED: OrbitControls configuration to disable zoom
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    
    // DISABLE ZOOM: Comment out or set to false/0 to disable mouse zoom
    this.controls.enableZoom = false;  // Disables all zoom (mouse wheel and pinch)
    // Alternative: Keep zoom enabled but set zoomSpeed to 0
    // this.controls.zoomSpeed = 0;
    
    // Optional: Disable other interactions if needed
    // this.controls.enablePan = false;  // Disables panning (right-click drag)
    // this.controls.enableRotate = false;  // Disables rotation (left-click drag)

    this.globe = new Globe().showGraticules(true).showAtmosphere(true);
    this.globe.atmosphereColor('#9ec2ff').atmosphereAltitude(0.25);

    if (typeof (this.globe as any).showGlobe === 'function') {
      this.globe.showGlobe(false);
    } else if (typeof (this.globe as any).globeMaterial === 'function') {
      this.globe.globeMaterial(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
    }

    const texLoader = new THREE.TextureLoader();
    const earthTex = texLoader.load(
      'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg'
    );
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 75, 75),
      new THREE.MeshPhongMaterial({
        map: earthTex,
        specular: new THREE.Color(0x222222),
        shininess: 3
      })
    );

    this.globeGroup = new THREE.Group();
    this.globeGroup.add(this.globe);
    this.globeGroup.add(earth);
    this.scene.add(this.globeGroup);
    this.labelGroup = new THREE.Group();
    this.globeGroup.add(this.labelGroup);

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.globe
      .polygonsData(this.countries.features)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(0,0,0,0)')
      .polygonAltitude(0);

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 3, 5);
    this.scene.add(dir);

    this.http.get<any>('assets/json/world-globe-data.json').subscribe(data => {
      this.countriesList = data.countries.map((c: any) => ({
        country: c.name,
        code: c.code,
        region: c.region,
        uniqueSkills: c.uniqueSkills > 0 ? c.uniqueSkills : Math.floor(Math.random() * 100),
        skillSupply: c.skillSupply > 0 ? c.skillSupply : Math.floor(Math.random() * 50),
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, RADIUS)
      }));

      this.filteredList = [...this.countriesList];
      this.addCountryLabels();

      const handleHover = (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
          (event.offsetX / renderer.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(earth);

        if (intersects.length > 0) {
          const point = intersects[0].point;
          let closest: CountrySkill | null = null;
          let minDist = Infinity;

          for (const c of this.countriesList) {
            if (!c.position) continue;
            const rotatedPos = c.position.clone().applyMatrix4(this.globeGroup.matrixWorld);
            const dist = point.distanceTo(rotatedPos);
            if (dist < minDist) {
              minDist = dist;
              closest = { ...c, position: rotatedPos };
            }
          }

          if (closest) {
            const vector = closest.position!.clone().project(this.camera);
            const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
            const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

            tooltip.innerHTML = `
              <div class="tooltip-header">
                <img src="https://flagcdn.com/24x18/${closest.code.toLowerCase()}.png" />
                <span>${closest.country}</span>
              </div>
              <div class="tooltip-row">
                <span class="label">Unique Skills</span>
                <span class="value">${closest.uniqueSkills}</span>
              </div>
              <div class="tooltip-row">
                <span class="label">Skill Supply (FTE)</span>
                <span class="value">${closest.skillSupply}</span>
              </div>
            `;

            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
            tooltip.style.display = 'block';
            return;
          }
        }
        tooltip.style.display = 'none';
      };

      renderer.domElement.addEventListener('mousemove', handleHover);
      renderer.domElement.addEventListener('click', handleHover);
      renderer.domElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (!this.isFocusing) {
        this.globeGroup.rotation.y += ROTATION_SPEED;
      }
      this.controls.update();
      
      // MODIFIED: Removed zoom change detection since zoom is disabled
      // const currentZ = this.camera.position.z;
      // if (Math.abs(currentZ - this.lastZoom) > 5) {
      //   this.currentZoom = currentZ;
      //   this.addCountryLabels();
      //   this.lastZoom = currentZ;
      // }
      
      this.updateLabelVisibility();
      renderer.render(this.scene, this.camera);
    };
    animate();
  }

  filterList() {
    const q = (this.searchTerm || '').toLowerCase().trim();
    this.filteredList = !q
      ? [...this.countriesList]
      : this.countriesList.filter(
        c =>
          c.country.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    this.addCountryLabels();
  }

  zoomIn() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  zoomOut() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  private updateCameraZoom() {
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }

  focusOnCountry(country: CountrySkill) {
    if (!country) return;
    this.isFocusing = true;
    const basePos = this.latLngToVector3(country.lat, country.lng, RADIUS);
    const worldPos = basePos.clone().applyMatrix4(this.globeGroup.matrixWorld);
    const distance = this.camera.position.length();
    const dir = worldPos.clone().normalize();
    this.camera.position.copy(dir.multiplyScalar(distance));
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    highlight.position.copy(basePos);
    this.globeGroup.add(highlight);

    setTimeout(() => {
      this.globeGroup.remove(highlight);
      this.isFocusing = false;
    }, 2000);
  }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }
}