// … keep your imports as is …
import * as THREE from 'three';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';

// … keep your constants …
const CUSTOM_GLOBE_COLOR = '#84c9f6';
const STROKE_COLOR_COUNTRY = '#7e8790';
const FALLBACK_COLOR = '#e0e0e0';
const ROTATION_SPEED = 0.5;
const ZOOM = { initial: 1, step: 0.2, min: 0.5, max: 3 };

@Component({
  selector: 'app-ss-by-location',
  templateUrl: './ss-by-location.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LiftPopoverComponent],
  styleUrls: ['./ss-by-location.component.scss']
})
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  // … keep all your properties as is …

  // THREE.js fields ⬇️
  private renderer?: THREE.WebGLRenderer;    // ⬅️ MODIFIED
  private scene?: THREE.Scene;               // ⬅️ MODIFIED
  private camera?: THREE.PerspectiveCamera;  // ⬅️ MODIFIED
  private earthMesh?: THREE.Mesh;            // ⬅️ MODIFIED

  ngAfterViewInit() {
    this.setupResizeObserver();
    this.initializeGlobe();
    this.loadData();
  }

  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    // === NEW: THREE.js setup for textured globe ===
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.z = this.currentRadius * 3;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    globeDiv.innerHTML = ''; // clear container
    globeDiv.appendChild(this.renderer.domElement);

    // Load texture
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('assets/images/globe-texture.png');

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: new THREE.Color(CUSTOM_GLOBE_COLOR), // tint
      combine: THREE.MultiplyOperation
    });

    const geometry = new THREE.SphereGeometry(this.currentRadius, 64, 64);
    this.earthMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.earthMesh);

    // Add light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x666666));

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.isRotating && !this.isDragging && this.earthMesh) {
        this.earthMesh.rotation.y += ROTATION_SPEED * 0.005;
      }
      this.renderer?.render(this.scene!, this.camera!);
    };
    animate();

    // === Keep your D3 SVG overlay ===
    d3.select(globeDiv).selectAll('svg').remove();
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // REMOVE old circle (ocean fill) ⬅️ MODIFIED
    // this.svg.append('circle') … was here → no longer needed

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    d3.select(globeDiv).selectAll('.globe-tooltip').remove();
    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'globe-tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.setupInteractions();
  }

  private handleResize() {
    if (!this.renderer || !this.camera || !this.scene || !this.svg) return;

    const globeDiv = this.globeContainer.nativeElement;
    const width = globeDiv.offsetWidth;
    const height = globeDiv.offsetHeight;
    this.currentRadius = this.getResponsiveRadius();

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.projection
      .scale(this.currentRadius * this.currentZoom)
      .translate([width / 2, height / 2]);

    this.svg.attr('viewBox', `0 0 ${width} ${height}`);

    this.updateCountries();
    this.updateStates();
  }

  // … keep all your other methods as is …
}
