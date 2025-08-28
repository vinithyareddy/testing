.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 25px;

  /* Title + info */
  .widget-heading {
    margin-right: 20px;

    i.fa-info-circle {
      font-size: 14px;   // smaller icon
      color: #0071bc;    // blue color
      margin-left: 6px;  // space from title
      cursor: pointer;
    }
  }

  /* Right side toggle + ellipsis icons */
  .header-icons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    margin-bottom: 30px;

    div {
      width: 28px;
      height: 28px;
      border: 1px solid #d6d6d6;
      text-align: center;
      line-height: 28px;
      cursor: pointer;

      i {
        font-size: 14px;
      }
    }

    .ellipsis {
      border: none;     // ellipsis without border
      color: #0071bc;   // blue ellipsis
    }
  }

  /* Chart box spacing */
  .inner-card-box {
    padding: 40px 0 10px 0; // pushes chart down a little
  }

  /* "View more" link */
  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #0071bc;
    text-align: right;
  }
}

/* Chart icon rotations */
.fa-chart-bar {
  display: inline-block;
  transform: rotate(270deg) scaleY(-1);
}

.fa-chart-pie {
  display: inline-block;
  transform: rotate(180deg) scaleY(-1);
}
