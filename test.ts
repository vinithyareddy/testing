focusOnCountry(country: CountryCost) {
  if (!country) return;

  // Convert lat/lng to [lon, lat] rotation for D3
  const targetRotation: [number, number] = [
    -country.lng, // D3 needs negative longitude
    -country.lat  // negative latitude
  ];

  // Smooth animation from currentRotation to target
  const start = [...this.currentRotation];
  const end = targetRotation;
  const duration = 1000; // 1 second
  const startTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const t = Math.min(1, (now - startTime) / duration);

    this.currentRotation[0] = start[0] + (end[0] - start[0]) * t;
    this.currentRotation[1] = start[1] + (end[1] - start[1]) * t;

    this.projection.rotate(this.currentRotation);
    this.updateCountries();

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  };

  this.isRotating = false; // pause auto rotation while focusing
  animate();
}


<tr *ngFor="let c of countryList" class="country-row" (click)="focusOnCountry(c)">
  <td class="country-info">
    <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
    {{ c.country }}
  </td>
  <td class="cost-col">${{ c.cost }}</td>
</tr>


<tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row" (click)="focusOnCountry(c)">
  <td class="country-info">
    <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
    {{ c.country }}
  </td>
  <td class="cost-col">${{ c.cost }}</td>
</tr>
