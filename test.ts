<div class="widget-heading pointer mt-1 col-md-8 d-flex align-items-center">
  <span class="title-with-icon d-flex align-items-center gap-2">
    Average Labor Cost by Position
    <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
  </span>
</div>


.title-with-icon {
    display: inline-flex;
    align-items: center;
    gap: 6px; // space between text and icon
    font-weight: 500;
  
    i {
      font-size: 16px;
      color: #0071bc; // matches your theme
      cursor: pointer;
    }
  }
  