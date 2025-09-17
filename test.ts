<div class="togglebtn d-flex">
  <div class="lft-toggle" 
       (click)="currentView = 'table'" 
       [class.active]="currentView === 'table'">
    <i class="fa fa-table fnticon" aria-hidden="true"></i>
  </div>
  <div class="rgt-toggle" 
       (click)="currentView = 'chart'" 
       [class.active]="currentView === 'chart'">
    <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
  </div>
</div>


.togglebtn {
    display: flex;
    border: 1px solid #ccd5df;
    border-radius: 4px;
    overflow: hidden;
  
    .lft-toggle,
    .rgt-toggle {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #fff;
      border-right: 1px solid #ccd5df;
  
      i {
        font-size: 16px;
        color: #0071bc;
        font-weight: 400;
      }
  
      &:hover {
        background: #f0f4f8;
      }
  
      &.active {
        border: 2px solid #0071bc;   // highlight border
        background: #eaf4fb;         // subtle background highlight
        i {
          color: #0071bc;
          font-weight: 600;
        }
      }
    }
  
    .rgt-toggle {
      border-right: none;
    }
  }
  