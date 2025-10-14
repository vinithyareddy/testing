<!-- Main Widget Container -->
<ng-container *ngIf="!ResponseFlag">
  <div class="loader-img">
    <lift-section-loader></lift-section-loader>
  </div>
</ng-container>

<ng-container *ngIf="ResponseFlag">
  <div class="ss-widget" [ngClass]="{'mobile-layout': isMobile}">