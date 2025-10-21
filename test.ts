// --- Permanent optimized version ---
private startRotationLoop() {
  this.zone.runOutsideAngular(() => {
    let lastFrame = 0;
    const frameInterval = 120; // ms → ~8 fps (smooth enough, silent console)

    const rotate = (timestamp: number) => {
      if (this.isRotating && !this.isDragging) {
        if (timestamp - lastFrame >= frameInterval) {
          this.currentRotation[0] += 0.6; // slightly faster for smoothness
          this.projection.rotate(this.currentRotation);

          // Update only projection transform, not all paths every frame
          this.svg.selectAll<SVGPathElement, any>('.country')
            .attr('d', this.path);
          this.svg.selectAll<SVGPathElement, any>('.state-border')
            .attr('d', this.path);

          lastFrame = timestamp;
        }
      }

      this.animationFrameId = requestAnimationFrame(rotate);
    };

    this.animationFrameId = requestAnimationFrame(rotate);
  });
}
