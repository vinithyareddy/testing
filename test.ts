import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Globe from 'globe.gl';

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  styleUrls: ['./ss-by-location.component.scss'],
  standalone: true
})
export class SsByLocationComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  ngAfterViewInit() {
    const globe = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // ocean + land
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')     // relief
      .showAtmosphere(true)
      .atmosphereColor('lightskyblue')
      .atmosphereAltitude(0.25)
      .backgroundColor('#ffffff')  // white background like your screenshot
      .showGraticules(true);       // latitude/longitude lines

    // Render into container
    globe(this.globeContainer.nativeElement);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.8;
  }
}


<div #globeContainer class="globe-wrapper"></div>


.globe-wrapper {
  width: 100%;
  height: 80vh;       // make it large
  margin: auto;
  position: relative;
  background: #f5f8fa; // soft background
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

canvas {
  border-radius: 12px;
}
