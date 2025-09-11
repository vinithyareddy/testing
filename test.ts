renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(this.globe.children, true);
  let foundCountry: CountrySkill | null = null;
  let intersectPoint: THREE.Vector3 | null = null;

  if (intersects.length > 0) {
    for (const intersect of intersects) {
      if (intersect.object && intersect.object.userData) {
        let countryName: string | null = null;
        let code: string | null = null;

        if (intersect.object.userData.label) {
          countryName = intersect.object.userData.label.country || null;
          code = intersect.object.userData.label.code || null;
        } else if (intersect.object.userData.polygon?.properties) {
          countryName = intersect.object.userData.polygon.properties.name || null;
          code = intersect.object.userData.polygon.id || null; // often ISO3 / numeric id
        }

        // Try match by code first
        if (code) {
          const match = this.countriesList.find(
            c => c.code.toLowerCase() === code.toLowerCase()
          );
          if (match) {
            foundCountry = match;
            intersectPoint = intersect.point.clone();
            break;
          }
        }

        // Fallback: try match by name
        if (!foundCountry && countryName) {
          const match = this.countriesList.find(
            c => c.country.trim().toLowerCase() === countryName.trim().toLowerCase()
          );
          if (match) {
            foundCountry = match;
            intersectPoint = intersect.point.clone();
            break;
          }
        }
      }
    }
  }

  if (foundCountry && intersectPoint) {
    // Convert 3D point → 2D screen coords
    const vector = intersectPoint.project(camera);
    const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

    tooltip.innerHTML = `
      <b>${foundCountry.country}</b><br>
      Unique Skills: ${foundCountry.uniqueSkills}<br>
      Skill Supply: ${foundCountry.skillSupply}
    `;
    tooltip.style.left = `${x + 15}px`;
    tooltip.style.top = `${y + 15}px`;
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});
