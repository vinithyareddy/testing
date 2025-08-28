<div class="widget-heading mt-1 cursorpointer d-flex align-items-center">
  <span class="title-text">
    Workforce Supply (FTE) by Country & Job
  </span>
  <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
</div>


.widget-heading {
  display: flex;
  align-items: center;   // ✅ title + icon on same line
  gap: 6px;              // space between text and icon

  .title-text {
    font-size: 14px;
    font-weight: 600;
    color: #2d2d2d;
  }

  i.fa-info-circle {
    font-size: 12px;     // smaller icon
    color: #0071bc;      // blue
    cursor: pointer;
  }
}
