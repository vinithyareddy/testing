<div class="globe-wrapper">
  <!-- Globe container -->
  <div #globeContainer class="globe-container"></div>

  <!-- Legend Table -->
  <div class="legend-wrapper">
    <h3 class="legend-title">Average Labor cost by Region</h3>

    <table class="legend-table">
      <thead>
        <tr>
          <th>Region and Country</th>
          <th>Average Cost</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let region of regionGroups">
          <!-- Region row -->
          <tr (click)="expandRow(region)" class="pointer">
            <td>
              <span class="cell-content">
                <i *ngIf="!region.expanded" class="far fa-plus-circle"></i>
                <i *ngIf="region.expanded" class="far fa-minus-circle"></i>
                {{ region.region }}
              </span>
            </td>
            <td class="cost-col">\${{ region.total }}</td>
          </tr>

          <!-- Expanded country rows -->
          <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
            <td>
              <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'"
                   class="flag-icon" />
              {{ c.country }}
            </td>
            <td class="cost-col">\${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>
