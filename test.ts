<div class="legend-card">
  <div class="legend-header">Average Labor cost by Region</div>
  <div class="legend-body">
    <table>
      <tbody>
        <tr *ngFor="let d of data">
          <td class="legend-label">
            <span *ngIf="d.flag" class="flag">{{ d.flag }}</span>
            {{ d.name }}
          </td>
          <td class="legend-value">\${{ d.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="legend-footer">
    <span>View More</span>
    <i class="fa fa-angle-right"></i>
  </div>
</div>

.legend-card {
  background: #0d2b45;        // deep blue background
  border-radius: 6px;
  color: #fff;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .legend-header {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .legend-body {
    flex: 1;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .legend-label {
      text-align: left;
      padding: 6px 4px;
      display: flex;
      align-items: center;
      gap: 6px;

      .flag {
        font-size: 14px;
      }
    }

    .legend-value {
      text-align: right;
      padding: 6px 4px;
      font-weight: 600;
    }
  }

  .legend-footer {
    margin-top: 10px;
    color: #85caf7;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;

    i {
      font-size: 12px;
    }
  }
}

data = [
  { code: 'US', name: 'United States', value: 57, flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', value: 7, flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', value: 3, flag: '🇲🇽' },
  { code: 'SA', name: 'South America', value: 3, flag: '' },
  { code: 'EU', name: 'Europe', value: 11, flag: '' },
  { code: 'AF', name: 'Africa', value: 19, flag: '' },
  { code: 'AS', name: 'Asia', value: 20, flag: '' },
  { code: 'OC', name: 'Oceania', value: 13, flag: '' },
  { code: 'AN', name: 'Antarctica', value: 5, flag: '' }
];
