/* workforce-supply-widget.component.scss */
.workforce-widget-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 400px;
  margin: 0 auto;

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .icon-container {
        width: 32px;
        height: 32px;
        background: #e3f2fd;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          color: #1976d2;
          font-size: 16px;
        }
      }

      .menu-icon {
        i {
          color: #666;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;

      .view-more {
        color: #1976d2;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      i {
        color: #1976d2;
        font-size: 12px;
      }
    }
  }

  .widget-content {
    .widget-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 24px 0;
      text-align: left;
      transform: rotate(-90deg);
      transform-origin: left bottom;
      position: absolute;
      left: -10px;
      top: 50%;
      width: max-content;
      white-space: nowrap;
    }

    .chart-section {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding-left: 40px;

      .chart-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .chart-container {
          position: relative;
        }

        .center-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;

          .total-number {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            line-height: 1;
          }

          .total-label {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
            white-space: nowrap;
          }
        }
      }

      .legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-left: 24px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;

          .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;

            &.fcv {
              background: #2d7d5f;
            }

            &.non-fcv {
              background: #5fb59b;
            }
          }

          .legend-text {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
        }
      }
    }

    .data-points {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      padding: 0 60px;

      .data-point {
        text-align: center;

        .percentage {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 2px;
        }

        .count {
          display: block;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .workforce-widget-container {
    padding: 12px;
    max-width: 100%;

    .widget-content {
      .widget-title {
        position: static;
        transform: none;
        text-align: center;
        margin-bottom: 16px;
      }

      .chart-section {
        padding-left: 0;
        flex-direction: column;
        gap: 16px;

        .legend {
          flex-direction: row;
          justify-content: center;
          margin-left: 0;
        }
      }
    }
  }
}