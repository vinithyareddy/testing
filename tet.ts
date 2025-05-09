ngAfterViewInit(): void {
  this.Subscribe = this.powerBiRSApi.getStandardReports().subscribe(data => {
    this.LoadFavReport();
    this.onreportinitialload();
    this.prousercheck();

    // Zoom detection (for Ctrl +/-)
    let zoom = 1;
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-')) {
        e.preventDefault();
        zoom += (e.key === '+' ? 0.1 : -0.1);
        zoom = Math.max(0.5, Math.min(2, zoom)); // Limit between 0.5x and 2x

        const iframe = document.querySelector('iframe');
        if (iframe) {
          (iframe as HTMLElement).style.transform = `scale(${zoom})`;
          (iframe as HTMLElement).style.transformOrigin = 'top left';
        }
      }
    });

    // Optional: Reset iframe zoom on window resize if needed
    window.addEventListener('resize', () => {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        (iframe as HTMLElement).style.transform = `scale(${zoom})`;
      }
    });
  });
}
