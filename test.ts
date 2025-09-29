<div class="togglebtn d-flex">
    <div class="lft-toggle" [class.lft-toggle-active]="viewMode === 'table'" (click)="viewMode = 'table'">
        <i class="fa fa-table fnticon" aria-hidden="true"></i>
    </div>
    <div class="rgt-toggle" [class.rgt-toggle-active]="viewMode === 'chart'" (click)="viewMode = 'chart'">
        <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
    </div>
</div>
