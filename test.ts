<div class="row bar px-3 filters-row">
  <div class="filters-wrap">
    <ng-template [ngTemplateOutlet]="filterTemp"></ng-template>
  </div>

  <div class="filter-btn">
    <span class="tagviewShow" (click)="onFilterOpen()">
      <lift-tag text="Filter" class="tagview" [size]="smallSize" [readOnly]="true" [active]="tagActive"
        image="../../../../../../../assets/images/sliders.svg">
      </lift-tag>
    </span>
  </div>
</div>


.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters-wrap {
  flex: 1; /* take all available width */
  margin-right: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.filter-btn {
  flex-shrink: 0; /* button stays fixed on the right */
}
1094