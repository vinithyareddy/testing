.chart-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  scrollbar-width: thin;              /* Firefox */
  scrollbar-color: #0071bc #f1f1f1;  /* Firefox */
}

.chart-scroll-wrapper::-webkit-scrollbar {
  height: 8px; /* slim bar */
}

.chart-scroll-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1; /* light background */
  border-radius: 4px;
}

.chart-scroll-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #0071bc, #00bcd4);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.chart-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #005b99, #0097a7);
}
