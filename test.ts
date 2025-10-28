/* ✅ Scoped alignment fix for mini-top-header and header-sticky */

/* Step 1: normalize both container widths */
:host ::ng-deep .mini-top-header,
:host ::ng-deep .header-sticky {
  display: flex;
  justify-content: center; /* centers their inner content */
  width: 100%;
  box-sizing: border-box;
}

/* Step 2: align their internal content consistently */
:host ::ng-deep .mini-top-header > div,
:host ::ng-deep .header-sticky > div {
  width: 100%;
  max-width: 1280px;  /* same grid width for both */
  margin: 0 auto;
  padding: 0 3vw;     /* responsive spacing that scales with zoom */
  box-sizing: border-box;
}

/* Step 3: optional vertical spacing for balance */
:host ::ng-deep .mini-top-header {
  padding-top: 6px;
  padding-bottom: 6px;
}

:host ::ng-deep .header-sticky {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Step 4: ensure perfect scaling on smaller screens */
@media (max-width: 768px) {
  :host ::ng-deep .mini-top-header > div,
  :host ::ng-deep .header-sticky > div {
    padding: 0 5vw;
  }
}
