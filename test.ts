<!-- Legend -->
<div class="legend-wrapper" [ngClass]="{ 'scrollable': selectedView === 'By Country' }">
  <h3 class="legend-title">Average Labor cost by Region</h3>
  <table class="legend-table">
    <thead>
      <tr>
        <th class="left">
          {{ selectedView === 'By Region' ? 'Region and Country' : 'Location and Job' }}
        </th>
        <th class="right">Average Cost</th>
      </tr>
    </thead>
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

          <!-- Country rows (expanded in region view) -->
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
  </table>
</div>


.legend-wrapper {
  margin-top: 120px;
  margin-right: 20px;
  width: 25%;
  display: flex;
  flex-direction: column;

  &.scrollable {
    max-height: 500px; // adjust based on design
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    background: #fff;

    /* Ensure header stays fixed */
    .legend-table thead {
      position: sticky;
      top: 0;
      background: #f8f9fa;
      z-index: 1;
    }
  }
}
