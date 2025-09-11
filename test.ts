this.globe
  .polygonsData(this.countries.features)
  .polygonCapColor(() => 'rgba(0,0,0,0)')
  .polygonSideColor(() => 'rgba(0,0,0,0)')
  .polygonStrokeColor(() => 'rgba(0,0,0,0)')
  .polygonAltitude(0)
  .onPolygonHover((polygon: any) => {
    if (!polygon) {
      tooltip.style.display = 'none';
      return;
    }

    const countryName = polygon.properties?.name;
    const match = this.countriesList.find(
      c => c.country.toLowerCase() === (countryName || '').toLowerCase()
    );

    if (match) {
      // Position tooltip at polygon centroid
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(polygon.__threeObj.matrixWorld);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

      tooltip.innerHTML = `
        <b>${match.country}</b><br>
        Unique Skills: ${match.uniqueSkills}<br>
        Skill Supply: ${match.skillSupply}
      `;
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.style.display = 'block';
    } else {
      tooltip.style.display = 'none';
    }
  });
