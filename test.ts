<!-- Legend Wrapper -->
<div class="legend-wrapper">
  <h3 class="legend-title">
    Average Labor cost by {{ selectedView }}
  </h3>

  <table class="legend-table legend-scroll">
    <thead>
      <tr>
        <th class="left">Region and Country</th>
        <th class="right">Average Cost</th>
      </tr>
    </thead>
    <tbody>
      <!-- Region View -->
      <ng-container *ngIf="selectedView === 'By Region'">
        <ng-container *ngFor="let region of regionGroups">
          <tr (click)="expandRow(region)" class="pointer region-row">
            <td>{{ region.region }}</td>
            <td class="right">\${{ region.total }}</td>
          </tr>
          <tr *ngIf="region.expanded" class="country-row" 
              *ngFor="let c of region.countries">
            <td>{{ c.country }}</td>
            <td class="right">\${{ c.cost }}</td>
          </tr>
        </ng-container>
      </ng-container>

      <!-- Country View -->
      <ng-container *ngIf="selectedView === 'By Country'">
        <tr *ngFor="let country of countryList">
          <td>{{ country.country }}</td>
          <td class="right">\${{ country.cost }}</td>
        </tr>
      </ng-container>
    </tbody>
  </table>
</div>


.legend-wrapper {
  max-height: 500px;   // adjust based on your layout
  overflow-y: auto;    // vertical scrollbar if needed
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;

  .legend-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 8px 10px;
      font-size: 14px;
    }

    thead {
      position: sticky;
      top: 0;
      background: #f8f9fa;
      z-index: 2;
    }
  }
}

/* Optional: only show scrollbar in country view */
:host ::ng-deep .legend-wrapper {
  &.legend-scroll {
    max-height: 400px;   // make it scrollable
    overflow-y: auto;
  }
}
