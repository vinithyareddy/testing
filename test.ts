<ng-template #filterTemp>
  <div class="filter-container full-width" #filterContainer>
    @if (swfpSelectedFilter().length >= 1 && swfpSelectedFilter()[0].key !== '') {
      <span class="me-3" style="font-size: 15px"> Filters: </span>

      <!-- Show first 10 or all depending on expand state -->
      @for (item of (expanded ? swfpSelectedFilter() : swfpSelectedFilter().slice(0, 10)); track item) {
        <span class="filterCSS">
          {{item.title}}:{{ item.displayValue }}
          <span class="ps-1" (click)="removeFilter(item)">
            <i class="fa fa-times" aria-hidden="true"></i>
          </span>
        </span>
      }

      <!-- View More / Show Less -->
      @if (swfpSelectedFilter().length > 10) {
        <span class="resetCSS toggle-btn" (click)="toggleExpand()">
          {{ expanded ? 'Show Less' : 'View More' }}
        </span>
      }
    }
  </div>
</ng-template>
