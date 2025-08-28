<thead class="tableHeading">
  <tr>
    <th class="text-left">Location and Job</th>
    <th class="fte-col">FTE</th>
  </tr>
</thead>
<tbody>
  <tr *ngFor="let data of groupdata">
    <td class="text-left">
      <i class="far fa-plus-circle"></i> &nbsp; {{data.country}}
    </td>
    <td class="fte-col">{{data.fte}}</td>
  </tr>
  <tr class="total">
    <td class="text-left">Total</td>
    <td class="fte-col">{{total}}</td>
  </tr>
</tbody>


.table {
  width: 100%;

  th.fte-col,
  td.fte-col {
    text-align: right;   // pushes header + values to the right edge
    padding-right: 12px; // matches spacing with your design
  }

  th.text-left,
  td.text-left {
    text-align: left;
    padding-left: 12px;
  }
}
