html, body {
  margin: 0;
  padding: 0;
  height: auto;
  overflow: visible !important; /* ✅ no page-level scroll */
}

.powerDiv {
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;  /* ✅ no scroll inside this div */
  width: 100%;
  background-color: #fff;
  border: none;
}

:host ::ng-deep iframe {
  width: 100% !important;
  height: auto !important;
  min-height: unset !important;
  overflow: visible !important;
  border: none;
}
