private startRotation() {
  this.ngZone.runOutsideAngular(() => {
    let lastTime = 0;
    const fps = 30; // target 30 frames per second (no need for 60)
    const interval = 1000 / fps;

    const rotate = (time: number) => {
      if (this.isRotating && !this.isDragging) {
        const elapsed = time - lastTime;
        if (elapsed > interval) {
          lastTime = time;
          this.currentRotation[0] += ROTATION_SPEED;
          this.projection.rotate(this.currentRotation);
          this.updateCountries(); // redraw countries
          this.updateStates();    // redraw states
        }
      }
      requestAnimationFrame(rotate);
    };

    requestAnimationFrame(rotate);
  });
}
