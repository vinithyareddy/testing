// Responsive breakpoints
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;

// Mixins for consistent responsive design
@mixin mobile {
  @media (max-width: #{$mobile - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$mobile}) and (max-width: #{$tablet - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$desktop}) {
    @content;
  }
}

@mixin mobile-tablet {
  @media (max-width: #{$tablet - 1px}) {
    @content;
  }
}

// Header Icons - Responsive
.ellipsis {
  cursor: pointer;
  font-size: 18px;
  margin-left: 12px;
  margin-top: 1px;

  @include mobile {
    font-size: 16px;
    margin-left: 8px;
  }
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #0071bc;

  @include mobile {
    gap: 8px;
    margin-bottom: 8px;
    justify-content: center;
  }

  i {
    font-size: 16px;
    cursor: pointer;

    @include mobile {
      font-size: 14px;
    }
  }

  .fa-expand {
    margin-top: 7px;

    @include mobile {
      margin-top: 5px;
    }
  }
}

// Widget Header - Responsive Layout
.d-flex.justify-content-between.align-items-center.flex-wrap {
  @include mobile {
    flex-direction: column;
    gap: 15px;
    align-items: stretch !important;
  }

  .widget-heading {
    @include mobile {
      text-align: center;
      font-size: 1.1rem;
      margin-bottom: 0;
    }

    @include tablet {
      font-size: 1.2rem;
    }
  }

  .col-md-8 {
    @include mobile {
      flex: none;
      max-width: 100%;
    }
  }

  .col-md-4 {
    @include mobile {
      flex: none;
      max-width: 100%;
      justify-content: center !important;
    }
  }
}

// Main Widget Container - Responsive
.ss-widget {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  height: 800px;
  transition: all 0.3s ease;

  @include mobile {
    flex-direction: column;
    height: auto;
    min-height: 500px;
  }

  @include tablet {
    height: 600px;
  }

  &.mobile-layout {
    flex-direction: column;
    height: auto;
    min-height: 500px;

    .legend-wrapper {
      width: 100% !important;
      max-height: 300px;
      order: 2;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    }

    .globe-wrapper {
      order: 1;
      min-height: 400px;
      height: 50vh;
    }
  }
}

// Legend Section - Responsive
.legend-wrapper {
  width: 350px;
  padding: 15px;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  @include mobile {
    width: 100%;
    max-height: 300px;
    order: 2;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    padding: 12px;
  }

  @include tablet {
    width: 280px;
    padding: 12px;
  }

  &.mobile-legend {
    width: 100% !important;
    max-height: 300px;
    opacity: 1 !important;
    overflow: visible !important;
    order: 2;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
}

.legend-toggle {
  position: relative;
  display: flex;
  transition: width 0.3s ease;

  @include mobile {
    width: 100% !important;
    position: static;
    
    .toggle-btn {
      display: none; // Hide toggle button on mobile
    }
  }

  .legend-wrapper {
    width: 400px;
    transition: width 0.3s ease, opacity 0.3s ease;

    @include mobile {
      width: 100% !important;
      opacity: 1 !important;
      overflow: visible !important;
    }
  }

  &.collapsed .legend-wrapper {
    width: 0;
    opacity: 0;
    overflow: hidden;

    @include mobile {
      width: 100% !important;
      opacity: 1 !important;
      overflow: visible !important;
    }
  }

  .toggle-btn {
    position: absolute;
    top: 50%;
    right: -6%;
    transform: translateY(-50%);
    background: #fff;
    border: 1px solid #ddd;
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 23px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;

    @include tablet {
      width: 20px;
      height: 50px;
    }

    i {
      font-size: 14px;
      color: #374151;

      @include tablet {
        font-size: 12px;
      }
    }
  }
}

// Search Box - Responsive
.search-box {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  padding: 6px 10px;
  border-radius: 8px;
  margin-bottom: 12px;

  @include mobile {
    padding: 8px 12px;
    margin-bottom: 10px;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    font-size: 14px;
    color: #111827;

    @include mobile {
      font-size: 16px; // Larger for mobile usability
    }
  }

  i {
    color: #6b7280;
  }
}

// Country List - Responsive
.country-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  transition: max-height 0.3s ease;

  @include mobile {
    max-height: 200px;
    padding-right: 0;
  }

  @include tablet {
    max-height: 300px;
  }

  // Dynamic height adjustments
  &.mobile-scroll {
    max-height: 200px !important;
    overflow-y: auto !important;
  }

  &.tablet-scroll {
    max-height: 300px !important;
    overflow-y: auto !important;
  }

  &.desktop-scroll {
    max-height: none !important;
    overflow-y: auto !important;
  }
}

.country-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 5px;
  cursor: default;
  transition: background 0.2s ease;

  @include mobile {
    padding: 12px;
    margin-bottom: 8px;
  }

  @include tablet {
    padding: 8px 10px;
  }

  &:hover {
    background: #f9fafb;
  }
}

.country-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  width: 100%;

  .flag-icon {
    width: 22px;
    height: auto;
    margin-right: 8px;
    border-radius: 3px;

    @include mobile {
      width: 24px;
      margin-right: 10px;
    }
  }

  .country-name {
    font-weight: 600;
    font-size: 14px;
    color: #111827;

    @include mobile {
      font-size: 15px;
    }

    @include tablet {
      font-size: 13px;
    }
  }
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: #374151;
  width: 100%;

  @include mobile {
    gap: 4px;
  }

  .metric-labels,
  .metric-values {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    @include mobile {
      gap: 10px;
    }
  }

  .metric-labels {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;

    @include mobile {
      font-size: 13px;
    }
  }

  .metric-values {
    font-size: 14px;
    font-weight: 600;
    color: #111827;

    @include mobile {
      font-size: 15px;
    }

    @include tablet {
      font-size: 13px;
    }
  }
}

// Globe Wrapper - Responsive
.globe-wrapper {
  background: linear-gradient(90deg, #c9d4f0 0%, #b5d6ec 50%, #c9d4f0 100%);
  width: 100%;
  height: 100%;
  margin: 0;
  top: 0;
  position: relative;
  overflow: hidden;

  @include mobile {
    order: 1;
    min-height: 400px;
    height: 50vh;
  }

  @include tablet {
    min-height: 450px;
  }

  .zoom-container {
    position: absolute;
    bottom: 20px;
    right: 50px;
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;

    @include mobile {
      bottom: 15px;
      right: 15px;
      transform: scale(0.9);
    }

    @include tablet {
      bottom: 15px;
      right: 30px;
      transform: scale(0.95);
    }

    button {
      border: none;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      cursor: pointer;
      color: #214bcc;

      @include mobile {
        width: 40px;
        height: 40px;
        font-size: 28px;
      }

      @include tablet {
        width: 32px;
        height: 32px;
        font-size: 26px;
      }

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}

// Tooltip - Responsive
:host ::ng-deep .globe-tooltip {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  line-height: 1.5;
  max-width: 250px;
  pointer-events: none;
  overflow: hidden;
  padding: 0;

  @include mobile {
    max-width: 200px;
    font-size: 12px;
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f3f4f6;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;

    @include mobile {
      padding: 6px 10px;
      font-size: 13px;
      gap: 6px;
    }

    .flag-icon {
      width: 24px;
      height: 18px;
      object-fit: contain;
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;

      @include mobile {
        width: 20px;
        height: 15px;
        margin-right: 4px;
      }
    }
  }

  .tooltip-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 12px;

    @include mobile {
      padding: 5px 10px;
    }

    .label {
      font-size: 13px;
      color: #374151;

      @include mobile {
        font-size: 12px;
      }
    }

    .value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;

      @include mobile {
        font-size: 12px;
      }
    }
  }
}

// Canvas - Responsive
canvas {
  border-radius: 12px;
  cursor: default;

  @include mobile {
    border-radius: 8px;
  }
}

// Host styling
:host {
  display: block;
  margin: 16px 0;

  @include mobile {
    margin: 12px 0;
  }
}

// View button
.view {
  font-size: 18px;
  color: #0071bc;
  cursor: pointer;
  padding-right: 10px;

  @include mobile {
    font-size: 16px;
    padding-right: 8px;
  }
}

// Info icon
.lift-popover-icon {
  margin-top: -5px;
}

.far.fa-info-circle {
  font-size: 12px;
  margin-left: 4px;

  @include mobile {
    font-size: 11px;
  }
}

// Full View Mode - Responsive
.full-view {
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
  background-color: #fff;
  padding: 20px;

  @include mobile {
    padding: 10px;
  }

  @include tablet {
    padding: 15px;
  }

  .budget-card-box-lg {
    height: 820px !important;

    @include mobile {
      height: calc(100vh - 20px) !important;
    }

    @include tablet {
      height: calc(100vh - 30px) !important;
    }

    .budget-box-chart-lg {
      height: 800px !important;

      @include mobile {
        height: calc(100vh - 40px) !important;
      }

      @include tablet {
        height: calc(100vh - 50px) !important;
      }
    }

    .TableView {
      height: 650px !important;
      max-height: 680px;
      width: 100%;

      @include mobile {
        height: calc(100vh - 150px) !important;
        max-height: calc(100vh - 120px);
      }

      @include tablet {
        height: calc(100vh - 180px) !important;
        max-height: calc(100vh - 150px);
      }
    }
  }

  // Adjust widget in full view mode
  .ss-widget {
    @include mobile {
      height: calc(100vh - 120px);
      min-height: auto;
    }

    @include tablet {
      height: calc(100vh - 150px);
    }
  }
}

// View More Section - Responsive
.viewmore {
  @include mobile {
    text-align: center;
    margin-top: 15px !important;
    padding-top: 15px !important;
    font-size: 14px;
  }

  @include tablet {
    font-size: 15px;
  }
}

// Additional responsive utilities
@include mobile {
  .d-flex.gap-3 {
    gap: 8px !important;
  }
  
  .mt-1 {
    margin-top: 0.5rem !important;
  }
  
  .mt-3 {
    margin-top: 1rem !important;
  }
  
  .pt-3 {
    padding-top: 1rem !important;
  }
}

// Touch-friendly improvements
@include mobile {
  .country-card,
  .toggle-btn,
  .view,
  .ellipsis,
  .zoom-container button {
    min-height: 44px; // Apple's recommended touch target size
    display: flex;
    align-items: center;
  }
  
  .country-card {
    min-height: auto;
    padding: 15px 12px;
  }
}


import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, OnDestroy, HostListener } from '@angular/core';
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
export class SsByLocationComponent implements AfterViewInit, OnDestroy {
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
  private isHovering = false;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  private resizeObserver!: ResizeObserver;

  // Responsive state management
  isMobile = false;
  isTablet = false;
  private mediaQueryMobile!: MediaQueryList;
  private mediaQueryTablet!: MediaQueryList;

  // Responsive breakpoints
  private readonly breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  constructor(private http: HttpClient, private render: Renderer2) {
    // Initialize media queries
    this.setupMediaQueries();
  }

  // Handle window resize events
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.handleResize();
  }

  private setupMediaQueries() {
    if (typeof window !== 'undefined') {
      this.mediaQueryMobile = window.matchMedia('(max-width: 767px)');
      this.mediaQueryTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
      
      // Initial check
      this.updateResponsiveState();
      
      // Listen for changes
      this.mediaQueryMobile.addEventListener('change', () => this.updateResponsiveState());
      this.mediaQueryTablet.addEventListener('change', () => this.updateResponsiveState());
    }
  }

  private updateResponsiveState() {
    this.isMobile = this.mediaQueryMobile?.matches || false;
    this.isTablet = this.mediaQueryTablet?.matches || false;
    
    // Force legend to be visible on mobile
    if (this.isMobile) {
      this.legendCollapsed = false;
    }
    
    // Update legend layout when screen size changes
    this.updateLegendLayout();
    
    // Trigger globe resize if needed
    if (this.renderer && this.camera) {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    }
  }

  private handleResize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    if (!host || !this.renderer || !this.camera) return;

    const width = host.offsetWidth;
    const height = host.offsetHeight;

    // Update renderer size
    this.renderer.setSize(width, height);
    
    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Adjust zoom based on screen size for better mobile experience
    this.adjustZoomForScreenSize();

    // Update label scaling for different screen sizes
    this.updateLabelScaling();

    // Update legend layout for responsive behavior
    this.updateLegendLayout();
  }

  private adjustZoomForScreenSize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    let zoomMultiplier = 1;
    
    if (this.isMobile) {
      // Mobile devices - zoom out more to show more of the globe
      zoomMultiplier = 1.4;
    } else if (this.isTablet) {
      // Tablets - slight zoom adjustment
      zoomMultiplier = 1.15;
    }

    const adjustedZoom = this.currentZoom * zoomMultiplier;
    
    if (this.camera && this.controls) {
      this.camera.position.z = adjustedZoom;
      this.controls.update();
    }
  }

  private updateLabelScaling() {
    if (!this.labelGroup) return;
    
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    let scaleFactor = 1;
    
    if (width <= this.breakpoints.mobile) {
      scaleFactor = 0.7; // Smaller labels on mobile
    } else if (width <= this.breakpoints.tablet) {
      scaleFactor = 0.85; // Slightly smaller on tablets
    }

    this.labelGroup.children.forEach((label: any) => {
      const sprite = label as THREE.Sprite;
      const currentScale = sprite.scale.clone();
      sprite.scale.set(
        currentScale.x * scaleFactor,
        currentScale.y * scaleFactor,
        currentScale.z
      );
    });
  }

  private updateLegendLayout() {
    // Force legend to be responsive by triggering a re-render of the country list
    setTimeout(() => {
      // This will trigger Angular's change detection and apply responsive CSS
      this.addCountryLabels();
      
      // Force CSS classes update for responsive behavior
      const legendElement = document.querySelector('.legend-wrapper');
      const ssWidgetElement = document.querySelector('.ss-widget');
      
      if (legendElement && ssWidgetElement) {
        // Remove and re-add classes to trigger CSS updates
        if (this.isMobile) {
          ssWidgetElement.classList.add('mobile-layout');
          legendElement.classList.add('mobile-legend');
        } else {
          ssWidgetElement.classList.remove('mobile-layout');
          legendElement.classList.remove('mobile-legend');
        }
      }
      
      // Update legend scroll behavior
      this.updateLegendScrollBehavior();
    }, 50);
  }

  private updateLegendScrollBehavior() {
    const countryListElement = document.querySelector('.country-list') as HTMLElement;
    if (countryListElement) {
      if (this.isMobile) {
        // On mobile, limit height and enable scrolling
        countryListElement.style.maxHeight = '200px';
        countryListElement.style.overflowY = 'auto';
      } else if (this.isTablet) {
        // On tablet, slightly more height
        countryListElement.style.maxHeight = '300px';
        countryListElement.style.overflowY = 'auto';
      } else {
        // On desktop, use flex behavior
        countryListElement.style.maxHeight = 'none';
        countryListElement.style.overflowY = 'auto';
      }
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use requestAnimationFrame to avoid resize loops
          requestAnimationFrame(() => {
            this.handleResize();
          });
        }
      });

      this.resizeObserver.observe(this.globeContainer.nativeElement);
    }
  }

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
    
    // Adjust font size based on screen size
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    let adjustedFontSize = fontSize;
    
    if (width <= this.breakpoints.mobile) {
      adjustedFontSize = fontSize * 0.8;
    } else if (width <= this.breakpoints.tablet) {
      adjustedFontSize = fontSize * 0.9;
    }
    
    context.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = adjustedFontSize;
    const padding = 4;
    
    canvas.width = textWidth + (padding * 2);
    canvas.height = textHeight + (padding * 2);
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
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
    const baseScale = width <= this.breakpoints.mobile ? 2.5 : 3;
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

  private createIconSprite(
    color: string = '#0071bc',
    scaleX: number = 8,
    scaleY: number = 12
  ): THREE.Sprite {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    // Adjust icon size based on screen size
    let adjustedScaleX = scaleX;
    let adjustedScaleY = scaleY;
    
    if (width <= this.breakpoints.mobile) {
      adjustedScaleX = scaleX * 0.7;
      adjustedScaleY = scaleY * 0.7;
    } else if (width <= this.breakpoints.tablet) {
      adjustedScaleX = scaleX * 0.85;
      adjustedScaleY = scaleY * 0.85;
    }

    const size = 128;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = size;
    canvas.height = size;

    ctx.font = `900 ${size - 16}px "Font Awesome 6 Pro"`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uf3c5', size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      color: new THREE.Color(color)
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(adjustedScaleX, adjustedScaleY, 1);
    return sprite;
  }

  private updateLabelVisibility() {
    if (!this.labelGroup || !this.camera) return;

    const cameraPosition = this.camera.position.clone().normalize();
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    // Adjust minimum distance based on screen size
    let minDistance = 8;
    if (width <= this.breakpoints.mobile) {
      minDistance = 12; // Increase spacing on mobile
    } else if (width <= this.breakpoints.tablet) {
      minDistance = 10;
    }

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

  private createResponsiveTooltip(host: HTMLDivElement): HTMLDivElement {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.className = 'globe-tooltip';
    tooltip.style.zIndex = '2000';
    tooltip.style.display = 'none';
    
    // Add responsive styles
    tooltip.style.fontSize = 'clamp(12px, 2vw, 14px)';
    tooltip.style.maxWidth = '250px';
    tooltip.style.wordWrap = 'break-word';
    
    host.appendChild(tooltip);
    return tooltip;
  }

  private createResponsiveMouseHandler(tooltip: HTMLDivElement, earth: THREE.Mesh) {
    return (event: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number;
      
      // Handle both mouse and touch events
      if (event instanceof TouchEvent) {
        if (event.touches.length > 0) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          return;
        }
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      
      const rect = this.renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObject(earth);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        let closest: CountrySkill | null = null;
        let minDist = Infinity;
        
        // Adjust hover sensitivity based on screen size and device type
        let maxHoverDistance = 15;
        
        if (this.isMobile) {
          maxHoverDistance = 25; // Larger touch area on mobile
        } else if (this.isTablet) {
          maxHoverDistance = 20;
        }

        for (const c of this.countriesList) {
          if (!c.position) continue;
          const rotatedPos = c.position.clone().applyMatrix4(this.globeGroup.matrixWorld);
          const dist = point.distanceTo(rotatedPos);
          if (dist < minDist && dist < maxHoverDistance) {
            minDist = dist;
            closest = { ...c, position: rotatedPos };
          }
        }

        if (closest) {
          this.isHovering = true;
          this.positionTooltip(tooltip, closest, { clientX, clientY } as MouseEvent);
          return;
        }
      }

      this.isHovering = false;
      tooltip.style.display = 'none';
    };
  }

  private positionTooltip(tooltip: HTMLDivElement, country: CountrySkill, event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    const width = host.offsetWidth;
    
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <img class="flag-icon" src="assets/images/flags/${country.code.toLowerCase()}.svg"/>
        <span>${country.country}</span>
      </div>
      <div class="tooltip-row">
        <span class="label">Unique Skills</span>
        <span class="value">${country.uniqueSkills}</span>
      </div>
      <div class="tooltip-row">
        <span class="label">Skill Supply (FTE)</span>
        <span class="value">${country.skillSupply}</span>
      </div>
    `;

    // Responsive tooltip positioning
    let x = event.clientX - rect.left + 15;
    let y = event.clientY - rect.top + 15;
    
    // Prevent tooltip from going off-screen
    const tooltipRect = tooltip.getBoundingClientRect();
    if (x + tooltipRect.width > width) {
      x = event.clientX - rect.left - tooltipRect.width - 15;
    }
    if (y + tooltipRect.height > host.offsetHeight) {
      y = event.clientY - rect.top - tooltipRect.height - 15;
    }

    tooltip.style.left = `${Math.max(5, x)}px`;
    tooltip.style.top = `${Math.max(5, y)}px`;
    tooltip.style.display = 'block';
  }

  private updateRendererSize() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    if (host && this.renderer) {
      this.renderer.setSize(host.offsetWidth, host.offsetHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    }
  }

  private startAnimation() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      // Only rotate if not hovering and not focusing
      if (!this.isFocusing && !this.isHovering) {
        this.globeGroup.rotation.y += ROTATION_SPEED;
      }

      this.controls.update();
      this.updateLabelVisibility();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  ngAfterViewInit() {
    const host = this.globeContainer.nativeElement as HTMLDivElement;
    
    // Initialize renderer with responsive size
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.updateRendererSize();
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);

    // Set up resize observer
    this.setupResizeObserver();

    // Create tooltip with responsive positioning
    const tooltip = this.createResponsiveTooltip(host);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      host.offsetWidth / host.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.z = this.currentZoom;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.enableZoom = false;

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

      const handleMouseMove = this.createResponsiveMouseHandler(tooltip, earth);
      
      // Add both mouse and touch event listeners
      this.renderer.domElement.addEventListener('mousemove', handleMouseMove);
      this.renderer.domElement.addEventListener('touchstart', handleMouseMove);
      this.renderer.domElement.addEventListener('touchmove', handleMouseMove);
      
      this.renderer.domElement.addEventListener('mouseleave', () => {
        this.isHovering = false;
        tooltip.style.display = 'none';
      });
      
      this.renderer.domElement.addEventListener('touchend', () => {
        this.isHovering = false;
        tooltip.style.display = 'none';
      });
    });

    this.startAnimation();

    // Initial responsive adjustments
    this.adjustZoomForScreenSize();
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
    
    // Update legend layout after filtering
    setTimeout(() => {
      this.updateLegendScrollBehavior();
    }, 100);
  }

  // Enhanced zoom methods with responsive considerations
  zoomIn() {
    const zoomStep = this.isMobile ? ZOOM.step * 0.8 : ZOOM.step; // Smaller steps on mobile
    this.currentZoom = Math.max(this.currentZoom - zoomStep, ZOOM.min);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  zoomOut() {
    const zoomStep = this.isMobile ? ZOOM.step * 0.8 : ZOOM.step; // Smaller steps on mobile
    this.currentZoom = Math.min(this.currentZoom + zoomStep, ZOOM.max);
    this.updateCameraZoom();
    this.addCountryLabels();
  }

  private updateCameraZoom() {
    if (this.controls.object) this.controls.object.position.z = this.currentZoom;
  }

  // Enhanced legend toggle for responsive behavior
  toggleLegend() {
    if (!this.isMobile) {
      this.legendCollapsed = !this.legendCollapsed;
    }
    // On mobile, legend is always visible
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

    const pin = this.createIconSprite('#388dfcff', 5, 5);
    pin.position.copy(basePos.clone().normalize().multiplyScalar(RADIUS + 2));
    this.globeGroup.add(pin);
    
    setTimeout(() => {
      this.globeGroup.remove(pin);
      this.isFocusing = false;
    }, 2000);
  }

  // Enhanced fullPageView method
  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview === true) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
    
    // Trigger resize after fullscreen toggle with delay for DOM updates
    setTimeout(() => {
      this.handleResize();
      // Adjust legend state based on screen size in fullview
      if (this.fullview && this.isMobile) {
        this.legendCollapsed = false;
      }
    }, 150);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clean up media query listeners
    if (this.mediaQueryMobile) {
      this.mediaQueryMobile.removeEventListener('change', () => this.updateResponsiveState());
    }
    if (this.mediaQueryTablet) {
      this.mediaQueryTablet.removeEventListener('change', () => this.updateResponsiveState());
    }
  }
}