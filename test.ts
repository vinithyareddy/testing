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


.togglebtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;  // push icons all the way right
  gap: 10px;

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
    border: none; // ellipsis looks cleaner
  }
}
