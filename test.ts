.inner-card-box {
  padding: 0 !important;   // remove top & bottom white space
  margin: 0 !important;
}

.custom-table {
  border-collapse: collapse;
  width: 100%;
  margin: 0;
  padding: 0;

  th {
    text-align: left;   // Age header left aligned
    font-weight: 600;
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  td {
    padding: 14px 12px; // increase row height
    border-bottom: 1px solid #f1f1f1;
  }

  .age-col {
    text-align: left;
    font-weight: 500;
  }

  .percent-col {
    text-align: right;
    font-weight: 600;
  }

  tr.alt-row {
    background: #fafafa;
  }
}
