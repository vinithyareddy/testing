private raycaster = new THREE.Raycaster();
private mouse = new THREE.Vector2();
renderer.domElement.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  this.tooltipEl.nativeElement.style.left = event.clientX + 15 + 'px';
  this.tooltipEl.nativeElement.style.top = event.clientY + 15 + 'px';
});

this.raycaster.setFromCamera(this.mouse, camera);

// check intersections with labels (they are sprites in three-globe)
const intersects = this.raycaster.intersectObjects(scene.children, true);

let found = false;
for (const obj of intersects) {
  if (obj.object && obj.object.userData && obj.object.userData.code) {
    const country = this.countriesList.find(c => c.code === obj.object.userData.code);
    if (country) {
      this.tooltipEl.nativeElement.innerHTML = `
        <b>${country.country}</b><br/>
        Unique Skills: ${country.uniqueSkills}<br/>
        Skill Supply (FTE): ${country.skillSupply}
      `;
      this.tooltipEl.nativeElement.style.display = 'block';
      found = true;
      break;
    }
  }
}

if (!found) {
  this.tooltipEl.nativeElement.style.display = 'none';
}

this.globe
  .labelsData(labelData.map(d => ({ ...d, userData: { code: d.code } })))
  .labelText((d: any) => d.code)
  .labelLat((d: any) => d.lat)
  .labelLng((d: any) => d.lng)
  .labelAltitude(0.01)
  .labelSize(0.45)
  .labelDotRadius(0.12)
  .labelColor(() => 'rgba(0,0,0,0.8)')
  .labelResolution(2);
