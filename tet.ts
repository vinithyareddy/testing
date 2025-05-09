setTimeout(() => {
  const iframe = document.querySelector('#pbi-container iframe') as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    iframe.style.width = '100%';
    iframe.style.minWidth = '100%';

    // Try accessing internal doc if same-origin
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const target = doc.querySelector('.reportVisualContainer') as HTMLElement;
      if (target) {
        target.style.width = '100%';
        target.style.maxWidth = '100%';
      }
    } catch (e) {
      // If cross-origin, skip silently
    }
  }
}, 2000);


:host ::ng-deep .powerDiv {
  width: 100%;
  height: 800px;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

/* Force iframe to stretch */
:host ::ng-deep iframe {
  width: 100% !important;
  min-width: 100% !important;
  height: 100% !important;
  border: none !important;
}

/* Optional if the embedded content (Power BI) needs stretching */
:host ::ng-deep .reportVisualContainer,
:host ::ng-deep .visualContainerHost {
  width: 100% !important;
  max-width: 100% !important;
}
