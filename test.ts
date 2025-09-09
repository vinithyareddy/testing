<div class="globe-wrapper">
  <!-- Globe container -->
  <div #globeContainer class="globe-container"></div>

  <!-- Legend Table -->
  <div class="legend-wrapper">
    <h3 class="legend-title">Average Labor cost by Region</h3>

    <table class="legend-table">
      <thead>
        <tr>
          <th class="left">Region and Country</th>
          <th class="right">Average Cost</th>
        </tr>
      </thead>
      <tbody>
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
            <td class="cost-col">\${{ region.total }}</td>
          </tr>

          <!-- Expanded country rows -->
          <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
            <td class="country-info">
              <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
              {{ c.country }}
            </td>
            <td class="cost-col">\${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>


.globe-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #154361;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
}

.globe-container {
  width: 70%;
  height: 600px;
}

.legend-wrapper {
  width: 28%;
  display: flex;
  flex-direction: column;
}

.legend-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  color: #fff;
}

.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem;
  color: #000;
}

.legend-table th,
.legend-table td {
  padding: 10px;
}

.legend-table th.left {
  text-align: left;
}

.legend-table th.right,
.legend-table td.cost-col {
  text-align: right;
}

.legend-table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.pointer {
  cursor: pointer;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px; /* spacing between expand icon and text */
}

.expand-icon {
  font-size: 1rem;
  color: #154361;
}

.country-row td {
  background: #f9f9f9;
}

.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
}


// inside AvgLaborCostRegionComponent
regionGroups: { region: string; total: number; countries: CountryCost[]; expanded?: boolean }[] = [];

// ...

ngAfterViewInit() {
  // ... your globe setup code

  // build groups
  const grouped: Record<string, CountryCost[]> = {};
  for (const c of this.laborData) {
    (grouped[c.region] ||= []).push(c);
  }
  this.regionGroups = Object.keys(grouped).map(region => {
    const arr = grouped[region];
    const total = arr.reduce((s, x) => s + x.cost, 0);
    return { region, total, countries: arr, expanded: false }; // added expanded
  });

  // ...
}

// ✅ Expand / Collapse row toggle
expandRow(region: any) {
  region.expanded = !region.expanded;
}
