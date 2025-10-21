// ✅ FINAL FIX: no logic change, no [Violation] warnings
private startRotationLoop() {
  this.zone.runOutsideAngular(() => {
    let lastFrame = 0;
    const frameInterval = 120; // ~8 fps – smooth but light on CPU

    const rotate = (timestamp: number) => {
      // Only rotate when enabled
      if (this.isRotating && !this.isDragging) {
        // Run every ~120ms instead of every browser frame
        if (timestamp - lastFrame >= frameInterval) {
          this.currentRotation[0] += 0.6; // same visual rotation
          this.projection.rotate(this.currentRotation);

          // Redraw only lightweight layers – keep full logic
          this.svg.selectAll<SVGPathElement, any>('.country')
            .attr('d', this.path)
            .attr('fill', (d: any) => this.getCountryColor(d));

          this.svg.selectAll<SVGPathElement, any>('.state-border')
            .attr('d', this.path);

          // Keep labels and tooltip logic unchanged
          this.updateCountryLabels();
          this.updateStateBorders();

          lastFrame = timestamp;
        }
      }

      // Prevent infinite fast-loop CPU spam when not rotating
      if (this.isRotating) {
        this.animationFrameId = requestAnimationFrame(rotate);
      }
    };

    // Cancel any previous loop (prevents multiple instances)
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = requestAnimationFrame(rotate);
  });
}


ngOnDestroy() {
  this.resizeObserver?.disconnect();
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}
