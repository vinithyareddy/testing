<div class="col-md-3 d-flex justify-content-end align-items-center header-icons">
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


.header-icons {
  display: flex;
  justify-content: flex-end;   // push all the way right
  align-items: center;
  gap: 8px;                    // spacing between icons
  margin-right: 8px;           // push closer to right edge

  div {
    width: 28px;
    height: 28px;
    border: 1px solid #d6d6d6;
    text-align: center;
    line-height: 28px;
    cursor: pointer;

    i {
      font-size: 14px;
    }
  }

  .ellipsis {
    border: none; // ellipsis without border
  }
}
