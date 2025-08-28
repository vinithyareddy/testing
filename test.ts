<div class="row card-box-header-sec align-items-center">
  <!-- Title -->
  <div class="widget-heading pointer mt-1 col-md-9">
    <span>
      Workforce Supply (FTE) by location
      <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
    </span>
  </div>

  <!-- Icons -->
  <div class="col-md-3 d-flex justify-content-end align-items-center">
    <div class="togglebtn">
      <div class="lft-toggle" [class.lft-toggle-active]="widgetType == 'th'" (click)="loadWidget('th')">
        <i class="fas fa-chart-bar" aria-hidden="true"></i>
      </div>
      <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType == 'ch'" (click)="loadWidget('ch')">
        <i class="far fa-chart-pie" aria-hidden="true"></i>
      </div>
      <div class="ellipsis">
        <i class="fas fa-ellipsis-v"></i>
      </div>
    </div>
  </div>
</div>
