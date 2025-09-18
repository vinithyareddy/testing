import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core'; // ADD OnDestroy here
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { FeatureCollection, Geometry } from 'geojson';
import * as d3 from 'd3';
import { LiftPopoverComponent } from '@lift/ui';

// ... keep all your existing types and constants as they are ...

@Component({
  selector: 'app-avg-labor-cost-region',
  templateUrl: './avg-labor-cost-region.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HighchartsChartModule, LiftPopoverComponent],
  styleUrls: ['./avg-labor-cost-region.component.scss']
})
export class AvgLaborCostRegionComponent implements AfterViewInit, OnDestroy { // ADD OnDestroy here
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  
  // ... keep all your existing properties as they are ...
  
  // ADD THESE NEW PROPERTIES after your existing ones:
  private resizeObserver!: ResizeObserver;
  private resizeTimeout: any;

  constructor(private http: HttpClient) { }

  // ADD THESE NEW METHODS before ngAfterViewInit:
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

  private setupResponsiveHandlers() {
    // Use ResizeObserver for better performance than window resize
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    
    this.resizeObserver.observe(this.globeContainer.nativeElement);
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

  // REPLACE your existing ngAfterViewInit method with this:
  ngAfterViewInit() {
    const globeDiv = this.globeContainer.nativeElement;
    const width = this.getGlobeWidth();  // CHANGED: use responsive width
    const height = this.getGlobeHeight(); // CHANGED: use responsive height
    const radius = Math.min(width, height) * 0.4; // CHANGED: responsive radius

    this.projection = d3.geoOrthographic()
      .scale(radius) // CHANGED: use responsive radius
      .translate([width / 2, height / 2])
      .clipAngle(90);
    
    this.path = d3.geoPath().projection(this.projection);
    
    // CHANGED: Create SVG with viewBox for automatic scaling
    this.svg = d3.select(globeDiv)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`) // CHANGED: add viewBox
      .attr('preserveAspectRatio', 'xMidYMid meet') // CHANGED: add preserveAspectRatio
      .style('width', '100%') // CHANGED: responsive width
      .style('height', '100%') // CHANGED: responsive height
      .style('max-width', '100%') // CHANGED: add max-width
      .style('max-height', '100%'); // CHANGED: add max-height

    this.svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', radius) // CHANGED: use responsive radius
      .attr('fill', CUSTOM_GLOBE_COLOR)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('class', 'globe-background'); // CHANGED: add class for easier selection

    this.countries = topojson.feature(
      worldData as any,
      (worldData as any).objects.countries
    ) as unknown as FeatureCollection<Geometry, any>;

    this.tooltip = d3.select(globeDiv)
      .append('div')
      .attr('class', 'tooltip-card')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('display', 'none');

    this.http.get<any>('assets/data/world-globe-data.json').subscribe(data => {
      this.laborData = data.countries.map((c: any) => ({
        country: c.name,
        region: c.region,
        cost: c.cost ?? Math.floor(Math.random() * 2),
        code: c.code,
        lat: c.lat,
        lng: c.lng,
        position: this.latLngToVector3(c.lat, c.lng, radius) // CHANGED: use responsive radius
      }));

      const minCost = d3.min(this.laborData, (d: any) => d.cost) || 0;
      const maxCost = d3.max(this.laborData, (d: any) => d.cost) || 1;

      this.countryColorScale = d3.scaleLinear<string>()
        .domain([minCost, maxCost])
        .range(COUNTRY_COLOR_RANGE);

      this.showRegionData();
      this.drawCountries();
      this.startRotation();
    });

    const zoom = d3.zoom()
      .scaleExtent([ZOOM.min, ZOOM.max])
      .filter((event: any) => {
        return event.type === 'wheel';
      })
      .on('zoom', (event: any) => {
        this.currentZoom = event.transform.k;
        this.updateGlobeDimensions(); // CHANGED: add responsive update
        this.updateCountries();
        this.updateGlobeBackground(); // CHANGED: add background update
      });

    const drag = d3.drag()
      .filter((event: any) => {
        return event.type !== 'wheel';
      })
      .on('start', (event: any) => {
        this.isDragging = true;
        this.isRotating = false;
      })
      .on('drag', (event: any) => {
        const sensitivity = 0.25;
        this.currentRotation[0] += event.dx * sensitivity;
        this.currentRotation[1] -= event.dy * sensitivity;
        this.currentRotation[1] = Math.max(-90, Math.min(90, this.currentRotation[1]));
        this.projection.rotate(this.currentRotation);
        this.updateCountries();
      })
      .on('end', (event: any) => {
        this.isDragging = false;
        setTimeout(() => {
          if (!this.isDragging) {
            this.isRotating = true;
          }
        }, 2000);
      });

    this.svg.call(zoom);
    this.svg.select('circle').call(drag);

    // ADD THIS LINE at the end of ngAfterViewInit:
    this.setupResponsiveHandlers();
  }

  // REPLACE your existing updateCountries method with this enhanced version:
  private updateCountries() {
    this.svg.selectAll('.country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d));

    // CHANGED: Update globe background radius responsively
    this.updateGlobeBackground();
  }

  // REPLACE your existing zoomIn method:
  zoomIn() {
    this.currentZoom = Math.min(this.currentZoom + ZOOM.step, ZOOM.max);
    this.updateGlobeDimensions(); // CHANGED: add responsive update
    this.updateCountries();
  }

  // REPLACE your existing zoomOut method:
  zoomOut() {
    this.currentZoom = Math.max(this.currentZoom - ZOOM.step, ZOOM.min);
    this.updateGlobeDimensions(); // CHANGED: add responsive update
    this.updateCountries();
  }

  // MODIFY your existing drawCountries method - find the mouseover event and REPLACE the tooltip positioning part:
  private drawCountries() {
    this.svg.selectAll('.country').remove();

    this.svg.selectAll('.country')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', this.path)
      .attr('fill', (d: any) => this.getCountryColor(d))
      .attr('stroke', this.selectedView === 'By Country' ? STROKE_COLOR_COUNTRY : 'none')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: any, d: any) => {
        const entry = this.laborData.find(c => c.country === d.properties.name);

        if (entry) {
          let tooltipContent = '';

          if (this.selectedView === 'By Region') {
            const regionGroup = this.regionGroups.find(r => r.region === entry.region);
            const regionTotal = regionGroup ? regionGroup.total : entry.cost;

            tooltipContent = `
            <div class="tooltip-row tooltip-header">${entry.region}</div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${regionTotal}</b></span>
            </div>
          `;
          } else {
            const flagUrl = `https://flagcdn.com/w20/${entry.code.toLowerCase()}.png`;
            tooltipContent = `
            <div class="tooltip-row tooltip-header">
              <img src="${flagUrl}" />
              <span>${entry.country}</span>
            </div>
            <div class="tooltip-row tooltip-body">
              <span>Average Cost</span>
              <span><b>$${entry.cost}</b></span>
            </div>
          `;
          }

          // REPLACE the tooltip positioning code with this:
          this.updateTooltipPosition(event, tooltipContent);
        }
      })
      .on('mousemove', (event: any) => {
        // REPLACE the mousemove tooltip positioning with this:
        const rect = this.globeContainer.nativeElement.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        // Ensure tooltip stays within container bounds
        const tooltipWidth = 160;
        const tooltipHeight = 80;
        
        if (x + tooltipWidth > containerWidth) {
          x = containerWidth - tooltipWidth - 10;
        }
        if (y + tooltipHeight > containerHeight) {
          y = y - tooltipHeight - 10;
        }
        
        this.tooltip.style('left', (x + 15) + 'px')
          .style('top', (y + 15) + 'px');
      })
      .on('mouseout', () => {
        this.tooltip.style('display', 'none');
      });
  }

  // ADD this new method after your existing methods:
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

  // ADD this new method at the very end, after toggleFullscreen():
  ngOnDestroy() {
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  // Keep all your other existing methods unchanged:
  // - latLngToVector3
  // - getCountryColor  
  // - startRotation
  // - expandRow
  // - setView
  // - showRegionData
  // - showCountryData
  // - applyColors
  // - focusOnCountry
  // - toggleFullscreen
}