/* 1) Make each label+value row a tight inline row */
.box-md .tile-widget-bottomtext .d-flex {
  display: inline-flex;            /* override Bootstrap's block flex */
  align-items: baseline;           /* align first text lines */
  gap: .5rem;                      /* small space between label and value */
}

/* 2) Let the label auto-size (don't occupy full width) */
.box-md .tile-widget-bottomtext .textEliipsis {
  width: auto;                     /* override the global width:100% */
  white-space: nowrap;             /* keep label on one line */
}

/* 3) Keep the number right next to the label (not right-aligned) */
.box-md .tile-widget-bottomtext .budget-box-right {
  display: inline-block;
  white-space: nowrap;
  text-align: left;                /* override any right-align */
  margin-left: 0;                  /* we use gap above */
}
