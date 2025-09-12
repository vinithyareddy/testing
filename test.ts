// Set font first to measure text
context.font = `bold ${fontSize}px Arial, sans-serif`;
const textMetrics = context.measureText(text);
const textWidth = textMetrics.width;
const textHeight = fontSize;

// Set canvas size based on text dimensions with padding
const padding = 8;
canvas.width = textWidth + (padding * 2);
canvas.height = textHeight + (padding * 2);

// Add text shadow for better visibility
context.shadowColor = 'rgba(0, 0, 0, 0.8)';
context.shadowBlur = 4;
context.shadowOffsetX = 1;
context.shadowOffsetY = 1;

context.font = `bold ${fontSize}px Arial, sans-serif`;

// Scale based on text length for consistent appearance
const baseScale = 6;
const scaleX = Math.max(baseScale, textWidth * 0.02);
const scaleY = baseScale * 0.6;
sprite.scale.set(scaleX, scaleY, 1);