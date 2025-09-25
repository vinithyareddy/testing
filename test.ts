private startRotation() {
  const rotate = () => {
    if (this.isRotating && !this.isDragging) {
      this.currentRotation[0] += ROTATION_SPEED;
      this.projection.rotate(this.currentRotation);

      // Re-render everything based on new projection
      this.updateCountries();
      this.updateStates();
    }
    requestAnimationFrame(rotate);
  };
  rotate();
}
