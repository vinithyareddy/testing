onLeftClick() {
    if (!this.isLeftDisabled) {
      this.currentPage--;
      this.updateChart();
    }
  }
  
  onRightClick() {
    if (!this.isRightDisabled) {
      this.currentPage++;
      this.updateChart();
    }
  }

  
  <div class="pagination-arrows">
  <button (click)="onLeftClick()" [disabled]="isLeftDisabled" class="arrow-btn">
    ←
  </button>

  <button (click)="onRightClick()" [disabled]="isRightDisabled" class="arrow-btn">
    →
  </button>
</div>

.disabled {
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  }
  