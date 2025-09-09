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
      <tr *ngFor="let region of regionGroups">
        <td class="pointer text-left" (click)="expandRow(region)">
          <span class="cell-content">
            <i *ngIf="!region.expanded" class="far fa-plus-circle"></i>
            <i *ngIf="region.expanded" class="far fa-minus-circle"></i>
            {{ region.region }}
          </span>
        </td>
        <td class="cost-col">\${{ region.total }}</td>
      </tr>

      <!-- Expanded Countries -->
      <tr *ngFor="let c of region.countries" [hidden]="!region.expanded" class="country-row">
        <td>
          <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'"
               class="flag-icon" />
          {{ c.country }}
        </td>
        <td class="cost-col">\${{ c.cost }}</td>
      </tr>
    </tbody>
  </table>
</div>


.legend-wrapper {
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  background: #0b3d91;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  color: #fff;
  font-size: 0.9rem;
}

.legend-table th, .legend-table td {
  padding: 10px;
  text-align: left;
}

.legend-table th {
  background: #083370;
  font-weight: bold;
}

.legend-table tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pointer {
  cursor: pointer;
}

.flag-icon {
  width: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.cost-col {
  text-align: right;
}
