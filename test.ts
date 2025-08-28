<div class="budget-card-box" #chartsection>
  <div class="budget-box-chart">

    <!-- Header -->
    <div class="card-box-header-sec d-flex justify-content-between align-items-center">
      <!-- Title -->
      <div class="widget-heading pointer mt-1">
        <span>
          Workforce Supply (FTE) by FCV Status
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <!-- Icons -->
      <div class="header-icons">
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

    <!-- Body -->
    <div [@collapse]="collapsed">
      <!-- Loader -->
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Chart View -->
      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType == 'ch'">
          <div class="inner-card-box">
            <highcharts-chart
              [Highcharts]="Highcharts"
              [options]="chartOptions"
              [constructorType]="'chart'"
              style="width: 100%; height: 250px; display: block;">
            </highcharts-chart>
          </div>
        </ng-container>

        <!-- View More -->
        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="Workforce Supply (FTE) by FCV Status" popoverText="" [config]="config1">
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>


.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  .widget-heading {
    margin-right: 20px;

    i.fa-info-circle {
      font-size: 14px;   // smaller info icon
      color: #0071bc;    // brand blue
      margin-left: 6px;  // spacing from title
      cursor: pointer;
    }
  }

  .header-icons {
    margin-bottom: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;

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
      border: none; 
      color: #0071bc; // ellipsis icon blue
    }
  }

  .inner-card-box {
    padding: 40px 0 10px 0;
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
  }
}

// icon rotations
.fa-chart-bar {
  display: inline-block;
  transform: rotate(270deg) scaleY(-1);
}

.fa-chart-pie {
  display: inline-block;
  transform: rotate(180deg) scaleY(-1);
}
