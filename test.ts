<!-- Table OUTSIDE the box -->
<div *ngIf="viewMode === 'table'" class="table-container mt-3">
  <table class="table table-bordered table-striped w-100">
    <thead>
      <tr>
        <th>Proficiency Level</th>
        <th *ngFor="let name of ['Awareness','Skilled','Advanced','Expert']">{{name}}</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let category of allCategories; let i = index">
        <td>{{category}}</td>
        <td *ngFor="let series of allSeriesData">{{series[i]}}</td>
      </tr>
    </tbody>
  </table>
</div>

.table-container {
  max-height: 400px;   // adjust height as needed
  overflow-y: auto;
  border: 1px solid #ddd;
}

.table-container table {
  margin-bottom: 0;   // remove default margin so scrollbar looks neat
}
