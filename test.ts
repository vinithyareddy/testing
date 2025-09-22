<ng-template #filterTemp>
  <div class="filter-container">
    @if (swfpSelectedFilter().length >= 1 && swfpSelectedFilter()[0].key !== '') {
      <span class="me-3" style="font-size: 15px"> Filters: </span>

      <!-- Show only first 10 filters if not expanded -->
      @for (item of (expanded ? swfpSelectedFilter() : swfpSelectedFilter().slice(0, 10)); track item) {
        <span class="filterCSS">
          {{item.title}}:{{ item.displayValue }}
          <span class="ps-1" (click)="removeFilter(item)">
            <i class="fa fa-times" aria-hidden="true"></i>
          </span>
        </span>
      }

      <!-- Toggle button -->
      @if (swfpSelectedFilter().length > 10) {
        <span class="resetCSS" (click)="toggleExpand()">
          {{ expanded ? 'Show Less' : 'View More' }}
        </span>
      }
    }
  </div>
</ng-template>



export class AppSwfpHeaderComponent {
  expanded: boolean = false; // already declared

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

.filterCSS {
  display: inline-block;
  padding: 0 10px;
  font-size: 12px;
  line-height: 24px;
  border-radius: 12px;
  background-color: #DBE1ED;
  cursor: pointer;
  margin: 2px 5px 2px 0;
  max-width: calc(100% - 100px); // leave space for "Filter" tag
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  i.fa-times {
    color: rgba(0, 0, 0, 0.6);
    font-size: 11px;
  }
}

.resetCSS {
  color: #0b50d1;
  font-weight: 600;
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
}
