// 1. Container-based responsive approach using CSS Container Queries
.budget-card-box-lg {
  // Use container queries for true component-level responsiveness
  container-type: inline-size;
  width: 100%;
  min-height: 600px;
  
  // Base responsive units
  font-size: clamp(12px, 1.5vw, 16px);
  
  .budget-box-chart-lg {
    width: 100%;
    height: 100%;
  }
}

// 2. Flexible Grid System for the main layout
.globe-wrapper {
  display: grid;
  grid-template-columns: 1fr min(300px, 25%);
  gap: clamp(10px, 2vw, 20px);
  padding: clamp(10px, 2vw, 15px);
  min-height: clamp(400px, 50vh, 800px);
  
  // Auto-adjust based on available space
  @container (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
}

// 3. Responsive Globe Container
.globe-container {
  width: 100%;
  height: 100%;
  min-height: clamp(300px, 40vh, 600px);
  aspect-ratio: 1;
  
  // SVG will automatically scale
  svg {
    width: 100% !important;
    height: 100% !important;
  }
}

// 4. Adaptive Legend
.legend-wrapper {
  width: 100%;
  margin-top: 0;
  
  @container (min-width: 769px) {
    margin-top: clamp(60px, 15vh, 120px);
  }
  
  .legend-title {
    font-size: clamp(14px, 2vw, 18px);
    margin-bottom: clamp(8px, 1vw, 15px);
  }
  
  .legend-table {
    font-size: clamp(11px, 1.2vw, 14px);
    
    th, td {
      padding: clamp(6px, 1vw, 10px);
    }
  }
  
  &.scrollable .legend-table {
    max-height: clamp(300px, 40vh, 500px);
  }
}

// 5. Responsive Header Section
.d-flex.justify-content-between {
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 16px);
  
  .widget-heading {
    flex: 1 1 auto;
    min-width: 200px;
    
    span {
      font-size: clamp(14px, 1.8vw, 18px);
    }
  }
  
  .header-icons {
    flex-shrink: 0;
    gap: clamp(8px, 1vw, 10px);
  }
}

// 6. Responsive Dropdown
.custom-dropdown {
  .btn {
    min-width: clamp(120px, 15vw, 200px);
    padding: clamp(4px, 0.5vw, 8px) clamp(8px, 1vw, 12px);
    font-size: clamp(12px, 1.3vw, 14px);
  }
}

// 7. Adaptive Zoom Controls
.zoom-container {
  position: absolute;
  bottom: clamp(10px, 2vh, 20px);
  left: clamp(10px, 2vw, 20px);
  
  button {
    width: clamp(30px, 4vw, 40px);
    height: clamp(30px, 4vw, 40px);
    font-size: clamp(16px, 2vw, 20px);
    margin: clamp(1px, 0.2vw, 2px) 0;
  }
}

// 8. Responsive Typography Scale
.title-with-icon i {
  font-size: clamp(11px, 1.2vw, 13px);
}

.header-icons {
  i {
    font-size: clamp(14px, 1.5vw, 16px);
  }
  
  .ellipsis {
    font-size: clamp(16px, 1.8vw, 18px);
    margin-left: clamp(8px, 1vw, 12px);
  }
}

// 9. Fullscreen Mode Responsiveness
.budget-card-box-lg.fullscreen {
  .globe-wrapper {
    height: calc(100vh - 120px); // Account for header
    grid-template-columns: 1fr clamp(250px, 30vw, 400px);
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      height: calc(100vh - 80px);
    }
  }
  
  .legend-wrapper {
    max-height: 70vh;
    overflow-y: auto;
  }
}

// 10. Handle very small screens
@media (max-width: 480px) {
  .globe-wrapper {
    grid-template-columns: 1fr !important;
    padding: 8px;
  }
  
  .legend-wrapper {
    margin-top: 0 !important;
    
    .legend-table {
      font-size: 12px;
      
      th, td {
        padding: 6px 4px;
      }
    }
  }
  
  .header-icons {
    justify-content: center !important;
    width: 100%;
    margin-top: 10px;
  }
}

// 11. Print styles (bonus)
@media print {
  .budget-card-box-lg {
    .zoom-container,
    .header-icons,
    .viewmore {
      display: none !important;
    }
    
    .globe-wrapper {
      grid-template-columns: 1fr 300px;
      break-inside: avoid;
    }
  }
}




// Add these methods and modifications to your component

export class AvgLaborCostRegionComponent implements AfterViewInit {
  // ... existing properties

  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.initializeGlobe();
    this.setupResponsiveHandlers();
  }

  private initializeGlobe() {
    const globeDiv = this.globeContainer.nativeElement;
    
    // Get initial dimensions
    this.updateGlobeDimensions();
    
    // Create SVG with viewBox for automatic scaling
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('viewBox', `0 0 ${this.getGlobeWidth()} ${this.getGlobeHeight()}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%')
      .style('max-width', '100%')
      .style('max-height', '100%');

    // Rest of your globe initialization...
    this.initializeProjectionAndPaths();
    this.loadData();
  }

  private setupResponsiveHandlers() {
    // Use ResizeObserver for better performance than window resize
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    
    this.resizeObserver.observe(this.globeContainer.nativeElement);
  }

  private getGlobeWidth(): number {
    const container = this.globeContainer.nativeElement;
    return container.offsetWidth || 600; // fallback width
  }

  private getGlobeHeight(): number {
    const container = this.globeContainer.nativeElement;
    return container.offsetHeight || 600; // fallback height
  }

  private updateGlobeDimensions() {
    const width = this.getGlobeWidth();
    const height = this.getGlobeHeight();
    
    // Calculate responsive radius based on container size
    const responsiveRadius = Math.min(width, height) * 0.4; // 40% of smallest dimension
    
    // Update projection
    if (this.projection) {
      this.projection
        .scale(responsiveRadius * this.currentZoom)
        .translate([width / 2, height / 2]);
    }
  }

  private initializeProjectionAndPaths() {
    const width = this.getGlobeWidth();
    const height = this.getGlobeHeight();
    const radius = Math.min(width, height) * 0.4;

    this.projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection);

    // Create responsive globe background
    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius)
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('class', 'globe-background');
  }

  private handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateGlobeDimensions();
      this.updateViewBox();
      this.updateCountries();
      this.updateGlobeBackground();
    }, 100);
  }

  private resizeTimeout: any;

  private updateViewBox() {
    const width = this.getGlobeWidth();
    const height = this.getGlobeHeight();
    
    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
  }

  private updateGlobeBackground() {
    const width = this.getGlobeWidth();
    const height = this.getGlobeHeight();
    const radius = Math.min(width, height) * 0.4 * this.currentZoom;

    this.svg.select('.globe-background')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius);
  }

  // Override existing zoomIn method to be responsive
  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateGlobeDimensions();
    this.updateCountries();
    this.updateGlobeBackground();
  }

  // Override existing zoomOut method to be responsive
  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateGlobeDimensions();
    this.updateCountries();
    this.updateGlobeBackground();
  }

  // Update tooltip positioning to be responsive
  private updateTooltipPosition(event: any, content: string) {
    const rect = this.globeContainer.nativeElement.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    // Ensure tooltip stays within container bounds
    const tooltipWidth = 160; // approximate tooltip width
    const tooltipHeight = 80; // approximate tooltip height
    
    if (x + tooltipWidth > containerWidth) {
      x = containerWidth - tooltipWidth - 10;
    }
    if (y + tooltipHeight > containerHeight) {
      y = y - tooltipHeight - 10;
    }
    
    this.tooltip
      .html(content)
      .style('left', (x + 15) + 'px')
      .style('top', (y + 15) + 'px')
      .style('display', 'block');
  }

  ngOnDestroy() {
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}