.country-list {
  flex: 1;
  overflow-y: auto;      // enable vertical scrolling
  overflow-x: hidden;    // no horizontal scroll
  padding-right: 4px;

  // Hide scrollbar arrows and style like default bar
  scrollbar-width: thin;         // Firefox
  scrollbar-color: #c1c1c1 #f1f1f1;

  &::-webkit-scrollbar {
    width: 6px;                  // thin scrollbar
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-button {
    display: none;               // removes up/down arrows
  }
}
