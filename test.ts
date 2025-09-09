<table class="legend-table">
  <thead>
    <tr>
      <th class="left">Average Cost</th>
      <th class="right">Region and Country</th>
    </tr>
  </thead>
  <tbody>
    <ng-container *ngFor="let region of regionGroups">
      <!-- Region row -->
      <tr (click)="expandRow(region)" class="pointer region-row">
        <td class="cost-col">\${{ region.total }}</td>
        <td>
          <span class="cell-content">
            <i *ngIf="!region.expanded" class="far fa-plus-circle expand-icon"></i>
            <i *ngIf="region.expanded" class="far fa-minus-circle expand-icon"></i>
            {{ region.region }}
          </span>
        </td>
      </tr>

      <!-- Expanded country rows -->
      <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
        <td class="cost-col">\${{ c.cost }}</td>
        <td class="country-info">
          <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
          {{ c.country }}
        </td>
      </tr>
    </ng-container>
  </tbody>
</table>


.legend-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.9rem;
  color: #000;
  border-radius: 0;   /* 🔹 remove curved bottom corners */
}

.legend-table th,
.legend-table td {
  padding: 10px;
}

.legend-table th.left {
  text-align: left;
}

.legend-table th.right {
  text-align: right;
}

.legend-table td.cost-col {
  text-align: left;   /* because cost is now first column */
}

.legend-table td:last-child {
  text-align: right;  /* align region + country column */
}

.legend-table tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-icon {
  font-size: 1rem;
  color: #154361;
}

.flag-icon {
  width: 20px;
  margin-left: 8px;  /* since flag is now on the right */
  vertical-align: middle;
}
