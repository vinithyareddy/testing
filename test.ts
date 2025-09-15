<!-- Country rows (expanded in region view) -->
<tr *ngIf="region.expanded">
  <td colspan="2" class="country-scroll-cell">
    <div class="country-scroll">
      <table>
        <tr *ngFor="let c of region.countries" class="country-row">
          <td class="country-info">
            <img [src]="'https://flagcdn.com/16x12/' + c.code.toLowerCase() + '.png'" class="flag-icon" />
            {{ c.country }}
          </td>
          <td class="cost-col">${{ c.cost }}</td>
        </tr>
      </table>
    </div>
  </td>
</tr>


.country-scroll-cell {
  padding: 0; // remove default padding
}

.country-scroll {
  max-height: 200px;      // ✅ adjust as needed
  overflow-y: auto;
  border-top: 1px solid #eee;
}

.country-scroll table {
  width: 100%;
  border-collapse: collapse;
}

.country-scroll tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
}
