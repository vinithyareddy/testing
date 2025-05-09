setTimeout(() => {
  const iframe = document.querySelector('#pbi-container iframe') as HTMLIFrameElement;
  if (iframe) {
    iframe.style.width = '100%';
    iframe.style.minWidth = '100%';
  }
}, 1500);