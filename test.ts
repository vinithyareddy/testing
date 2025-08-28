<div class="row card-box-header-sec align-items-center">
  <!-- Title + info -->
  <div class="col-md-9 d-flex align-items-center">
    <span class="title-text">
      Workforce Supply (FTE) by Country & Job
    </span>
    <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
  </div>

  <!-- Right icons -->
  <div class="col-md-3 d-flex justify-content-end align-items-center header-icons">
    <span (click)="fullPageView()" class="view">
      <i class="fas fa-expand" title="Zoom"></i>
    </span>
    <div class="ellipsis ml-2">
      <i class="fas fa-ellipsis-v"></i>
    </div>
  </div>
</div>


.widget-heading, .title-text {
  font-size: 14px;
  font-weight: 600;
  color: #2d2d2d;
}

.widget-heading {
  display: flex;
  align-items: center;
  gap: 6px; // space between text and info icon
}

.widget-heading i.fa-info-circle {
  font-size: 12px;   // smaller icon
  color: #0071bc;    // blue
  cursor: pointer;
}

.header-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  i {
    font-size: 16px;
    cursor: pointer;
  }
}
