<div class="row card-box-header-sec align-items-center">

  <!-- Title + info -->
  <div class="col-md-9 d-flex align-items-center heading-sec">
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

.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  /* Title + info icon */
  .heading-sec {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;   // space between heading and table
  }

  .title-text {
    font-size: 16px;
    font-weight: 600;
    color: #2d2d2d;
  }

  i.fa-info-circle {
    font-size: 12px;      // smaller
    color: #0071bc;       // blue
    cursor: pointer;
  }

  /* Right icons */
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

  /* Table */
  .TableView {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;

    .table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 8px 12px;
        font-size: 13px;
        vertical-align: middle;
        white-space: nowrap;
      }

      tbody tr:nth-child(even) { background-color: #f9f9f9; }
      tbody tr:nth-child(odd)  { background-color: #ffffff; }
      tbody tr:hover           { background-color: #eef5ff; }

      thead th {
        font-weight: 600;
        color: #2d2d2d;
        background-color: #f4f6f9;
        position: sticky;
        top: 0;
        z-index: 2;
      }

      tfoot tr.total {
        font-weight: 600;
        background: #f4f6f9;
        color: #2d2d2d;   // make visible again
        position: sticky;
        bottom: 0;
        z-index: 2;
      }
    }
  }
}
