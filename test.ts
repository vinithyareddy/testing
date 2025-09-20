import { HostListener } from '@angular/core';


@HostListener('window:resize', ['$event'])
onResize() {
  if (!this.renderer || !this.camera || !this.globeContainer) return;

  const host = this.globeContainer.nativeElement as HTMLDivElement;
  const width = host.clientWidth;
  const height = host.clientHeight;

  this.renderer.setSize(width, height);
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
}


this.renderer.setSize(host.clientWidth, host.clientHeight);
