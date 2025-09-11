import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import skillsData from '../../assets/skills.json';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements OnInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  data = skillsData;
  tooltip = { show: false, x: 0, y: 0, data: {} as any };

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private globe!: any;

  ngOnInit() {
    this.initGlobe();
  }

  initGlobe() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.globeContainer.nativeElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.z = 400;

    this.globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .pointsData(this.data)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor(() => 'orange')
      .pointAltitude(0.05)
      .pointRadius(1.5);

    this.scene.add(this.globe);

    const ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(1, 1, 1);
    this.scene.add(dir);

    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += 0.001;
      this.renderer.render(this.scene, this.camera);
    };
    animate();

    this.renderer.domElement.addEventListener('mousemove', this.onHover.bind(this));
  }

  onHover(event: MouseEvent) {
    const mouse = new THREE.Vector2(
      (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.globe.children, true);

    if (intersects.length > 0) {
      const d = intersects[0].object['__data'];
      if (d) {
        this.tooltip = { show: true, x: event.clientX + 10, y: event.clientY + 10, data: d };
      }
    } else {
      this.tooltip.show = false;
    }
  }

  focusCountry(country: any) {
    this.camera.position.set(
      country.lng > 0 ? 200 : -200,
      100,
      200
    );
    this.tooltip = { show: true, x: window.innerWidth / 3, y: window.innerHeight / 2, data: country };
  }

  closeTooltip() {
    this.tooltip.show = false;
  }
}


<div class="container">
  <!-- Left scroll list -->
  <div class="sidebar">
    <input class="search" placeholder="Search by country" />
    <div class="country-list">
      <div *ngFor="let c of data" class="country-item" (click)="focusCountry(c)">
        <span class="flag">{{c.flag}}</span>
        <div class="info">
          <div>{{c.country}}</div>
          <small>Unique Skills: {{c.uniqueSkills}}</small><br>
          <small>Skill Supply (FTE): {{c.skillSupply}}</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Globe -->
  <div #globeContainer class="globe-container"></div>

  <!-- Tooltip -->
  <div *ngIf="tooltip.show" 
       class="tooltip" 
       [style.left.px]="tooltip.x" 
       [style.top.px]="tooltip.y">
    <div class="tooltip-header">
      {{tooltip.data.flag}} {{tooltip.data.country}}
      <button class="close-btn" (click)="closeTooltip()">×</button>
    </div>
    <div>Unique Skills: {{tooltip.data.uniqueSkills}}</div>
    <div>Skill Supply (FTE): {{tooltip.data.skillSupply}}</div>
  </div>
</div>


.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: #f9f9f9;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
}

.country-list {
  flex: 1;
  overflow-y: auto;
}

.country-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.country-item:hover {
  background: #f0f0f0;
}

.flag {
  font-size: 24px;
  margin-right: 10px;
}

.info {
  font-size: 14px;
  color: #444;
}

.globe-container {
  flex: 1;
  background: radial-gradient(#1c1c2b, #000);
}

.tooltip {
  position: absolute;
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  color: #333;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  pointer-events: auto;
  z-index: 100;
  min-width: 200px;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 6px;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}
