<table class="table">
  <thead class="tableHeading">
    <tr>
      <th class="location-col text-left">Location and Job</th>
      <th class="fte-col">FTE</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let data of groupdata">
      <td class="location-col">
        <i class="far fa-plus-circle"></i> &nbsp; {{data.country}}
      </td>
      <td class="fte-col">{{data.fte}}</td>
    </tr>
    <tr class="total">
      <td class="location-col">Total</td>
      <td class="fte-col">{{total}}</td>
    </tr>
  </tbody>
</table>


.table {
  width: 100%;
  border-collapse: collapse;

  .location-col {
    text-align: left;
    padding-left: 12px;
  }

  .fte-col {
    text-align: right;
    padding-right: 20px;
    width: 80px;   // keeps column fixed width
  }

  .total .fte-col {
    font-weight: 600;
  }
}
