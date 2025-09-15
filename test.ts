.country-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;

  /* WebKit (Chrome, Edge, Safari) */
  &::-webkit-scrollbar {
    width: 8px;            /* thickness */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;   /* light gray track */
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1; /* darker thumb */
    border-radius: 8px;
    border: 2px solid #f1f1f1; /* space around thumb */
  }

  /* 🚫 This removes the arrows completely */
  &::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }
}
