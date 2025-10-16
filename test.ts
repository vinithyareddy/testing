private updateCountryLabels() {
    this.svg.selectAll<SVGTextElement, any>('.country-label').each((d: any, i, nodes) => {
      const projected = this.projection(d.centroid);
      const el = d3.select(nodes[i]);
      if (projected) {
        el
          .attr('x', projected[0])
          .attr('y', projected[1])
          // hide labels on the far side of the globe
          .style('display', projected[2] && projected[2] < 0 ? 'none' : 'block');
      }
    });
  }

  
  private startRotationLoop() {
    this.zone.runOutsideAngular(() => {
      const rotate = () => {
        if (this.isRotating && !this.isDragging) {
          this.currentRotation[0] += 0.5;
          this.projection.rotate(this.currentRotation);
          this.updateCountries();
          this.updateCountryLabels();  // ✅ keeps labels in sync
        }
        this.animationFrameId = requestAnimationFrame(rotate);
      };
      rotate();
    });
  }
  