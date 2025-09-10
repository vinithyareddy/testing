<tbody>
  <!-- Region View -->
  <ng-container *ngIf="selectedView === 'By Region'">
    <ng-container *ngFor="let region of regionGroups">
      <!-- Region row -->
      <tr (click)="expandRow(region)" class="pointer region-row">
        <td>
          <span class="cell-content">
            <i *ngIf="!region.expanded" class="far fa-plus-circle expand-icon"></i>
            <i *ngIf="region.expanded" class="far fa-minus-circle expand-icon"></i>
            {{ region.region }}
          </span>
        </td>
        <td class="cost-col">${{ region.total }}</td>
      </tr>

      <!-- Country rows (expanded) -->
      <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
        <td class="country-info">
          <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
          {{ c.country }}
        </td>
        <td class="cost-col">${{ c.cost }}</td>
      </tr>
    </ng-container>
  </ng-container>

  <!-- Country View -->
  <ng-container *ngIf="selectedView === 'By Country'">
    <tr *ngFor="let c of countryList" class="country-row">
      <td class="country-info">
        <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
        {{ c.country }}
      </td>
      <td class="cost-col">${{ c.cost }}</td>
    </tr>
  </ng-container>
</tbody>


<thead>
  <tr>
    <th class="left">
      {{ selectedView === 'By Region' ? 'Region and Country' : 'Location and Job' }}
    </th>
    <th class="right">Average Cost</th>
  </tr>
</thead>


// Legend data for rendering
regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];
countryList: CountryCost[] = [];   // <-- flat country list

// Dropdown Filter
setView(view: string) {
  this.selectedView = view;
  if (view === 'By Region') {
    this.showRegionData();
  } else {
    this.showCountryData();
  }
}

private showRegionData() {
  console.log("Switched to Region view");

  // regroup countries into regions
  const grouped: Record<string, CountryCost[]> = {};
  for (const c of this.laborData) {
    (grouped[c.region] ||= []).push(c);
  }

  this.regionGroups = Object.keys(grouped).map(region => {
    const arr = grouped[region];
    const total = arr.reduce((s, x) => s + x.cost, 0);
    return { region, total, countries: arr, expanded: false };
  });

  this.countryList = []; // clear flat list
}

private showCountryData() {
  console.log("Switched to Country view");

  // flatten: simply use laborData directly
  this.countryList = [...this.laborData].sort((a, b) => a.country.localeCompare(b.country));

  this.regionGroups = []; // clear region groups
}
