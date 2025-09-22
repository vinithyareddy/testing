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


.filter-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%; // take full row width
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

  i.fa-times {
    color: rgba(0, 0, 0, 0.6);
    font-size: 11px;
  }
}

/* Push "View More / Show Less" to the right end */
.toggle-btn {
  margin-left: auto;
  white-space: nowrap;
}

.resetCSS {
  color: #0b50d1;
  font-weight: 600;
  font-size: 14px;
  margin: 2px;
  cursor: pointer;
}
