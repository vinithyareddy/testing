private drawStates() {
    if (!this.states) return;
  
    // Remove any old paths first
    this.svg.selectAll('.state-border').remove();
  
    // Draw paths (initial creation)
    this.svg
      .selectAll('.state-border')
      .data(this.states.features)
      .enter()
      .append('path')
      .attr('class', 'state-border')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.7)
      .style('pointer-events', 'none');
  }

  
  // --------------------------
// UPDATE STATE BORDERS (called every rotation/frame)
// --------------------------
private updateStateBorders() {
    if (!this.states || !this.svg) return;
    this.svg
      .selectAll<SVGPathElement, any>('.state-border')
      .attr('d', this.path); // re-project each state path
  }
  