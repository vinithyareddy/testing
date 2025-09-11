npm install three three-globe mapbox-gl @types/mapbox-gl


import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'three-globe';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  private globe: any;
  private controls!: OrbitControls;

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.offsetWidth, host.offsetHeight);
    host.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      host.offsetWidth / host.offsetHeight,
      0.1,
      2000
    );
    camera.position.z = 350;

    // Controls
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;

    // ✅ Globe
    this.globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // Earth texture
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png') // Relief
      .showGraticules(true)
      .showAtmosphere(true);

    // Atmosphere glow
    this.globe.atmosphereColor('#00aaff');
    this.globe.atmosphereAltitude(0.25);

    scene.add(this.globe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      this.globe.rotation.y += 0.0015; // auto rotation
      this.controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
}
