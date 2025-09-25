private updateTextureRotation() {
  const rotation = this.currentRotation[0]; // longitude rotation
  const tilt = this.currentRotation[1];     // latitude rotation

  this.svg.select('#globe-texture')
    .attr('patternTransform', `rotate(${rotation}, ${this.currentRadius}, ${this.currentRadius})`);
}
