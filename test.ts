.country-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;   // everything in one row
  background: transparent;       // remove gray box
  border: none;                  // no border
  border-radius: 0;
  padding: 6px 0;                // compact vertical spacing
  margin-bottom: 4px;            // small gap between rows
  cursor: default;

  &:hover {
    background: none;            // disable hover gray background
  }
}

.flag-icon {
  width: 20px;
  height: 14px;
  margin-right: 8px;
}

.country-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;   // spacing between country name and metrics

  .country-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
  }

  .metrics {
    font-size: 13px;
    color: #333;
    display: flex;
    gap: 12px;   // "Unique Skills" and "Skill Supply" side by side

    span {
      display: inline-block;
    }
  }
}
