// === Add this right after creating this.svg in initializeGlobe() ===
const defs = this.svg.append("defs");

// Ocean gradient
const oceanGradient = defs.append("radialGradient")
  .attr("id", "oceanGradient")
  .attr("cx", "50%")
  .attr("cy", "50%")
  .attr("r", "50%");

oceanGradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#b3e5fc");   // light center
oceanGradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#0288d1");   // darker edge

// Region texture (diagonal lines)
defs.append("pattern")
  .attr("id", "regionTexture")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 6)
  .attr("height", 6)
  .append("path")
  .attr("d", "M0,6 l6,-6 M-1,1 l2,-2 M5,7 l2,-2")
  .attr("stroke", "#999")
  .attr("stroke-width", 0.5);


  this.svg.append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', this.currentRadius)
  .attr('fill', 'url(#oceanGradient)')   // ✅ gradient fill
  .attr('stroke', '#ccc')
  .attr('stroke-width', 1);


  private getCountryColor(d: any): string {
    const countryName = d.properties.name;
    const entry = this.countriesList.find(c => c.country === countryName);
  
    // Calculate projected area to decide fill style
    const area = this.getProjectedArea(d);
  
    if (area < 60) {
      // Tiny countries get texture
      return "url(#regionTexture)";
    }
  
    if (entry && entry.region) {
      // Larger countries use region-based solid colors
      const REGION_COLORS: Record<string, string> = {
        'North America': '#a8dadc',
        'South America': '#e9c46a',
        'Europe': '#2a9d8f',
        'Africa': '#f4a261',
        'Asia': '#e76f51',
        'Oceania': '#8d99ae'
      };
      return REGION_COLORS[entry.region] || FALLBACK_COLOR;
    }
  
    return FALLBACK_COLOR;
  }
  