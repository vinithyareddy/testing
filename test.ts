<!-- Legend -->
<div class="legend-container">
  <h3 class="legend-title">
    Average Labor cost by {{ selectedView === 'By Region' ? 'Region' : 'Country' }}
  </h3>

  <div class="legend-wrapper" [ngClass]="{ 'scrollable': selectedView === 'By Country' }">
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
        <!-- Region view -->
        <ng-container *ngIf="selectedView === 'By Region'">
          <ng-container *ngFor="let region of regionGroups">
            <!-- region row -->
            ...
          </ng-container>
        </ng-container>

        <!-- Country view -->
        <ng-container *ngIf="selectedView === 'By Country'">
          <tr *ngFor="let c of countryList" class="country-row">
            <td class="country-info">
              <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'"
                   class="flag-icon" />
              {{ c.country }}
            </td>
            <td class="cost-col">${{ c.cost }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </div>
</div>


.legend-container {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  width: 25%;
}

.legend-title {
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  color: #fff; // white on dark bg
}

.legend-wrapper {
  &.scrollable {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    background: #fff;

    .legend-table thead {
      position: sticky;
      top: 0;
      background: #f8f9fa;
      z-index: 1;
    }
  }
}
