(globeDiv.querySelectorAll('canvas') as NodeListOf<HTMLCanvasElement>)
  .forEach((c: HTMLCanvasElement) => c.remove());

(globeDiv.querySelectorAll('svg') as NodeListOf<SVGSVGElement>)
  .forEach((s: SVGSVGElement) => s.remove());
