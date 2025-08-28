<td class="pointer text-left" (click)="expandRow(row)">
  <span class="cell-content">
    <i *ngIf="!row.expanded" class="far fa-plus-circle"></i>
    <i *ngIf="row.expanded" class="far fa-minus-circle"></i>
    <img [src]="'https://flagcdn.com/16x12/' + row.flag + '.png'" class="flag-icon" />
    {{ row.country }}
  </span>
</td>


.cell-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;     // space between icon, flag, and country text
}

.cell-content i {
  margin-right: 6px; // specifically adds space after the + / - icon
}
