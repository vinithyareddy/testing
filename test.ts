xAxis: {
  categories: [
    {
      name: '2022',
      categories: ['Planned', 'Actuals']
    },
    {
      name: '2023',
      categories: ['Planned', 'Actuals']
    },
    {
      name: '2024',
      categories: ['Planned', 'Actuals']
    },
    {
      name: '2025',
      categories: ['Planned', 'Actuals']
    }
  ],
  labels: {
    style: { fontSize: '12px', color: '#333' }
  }
},


{
  name: 'Buy',
  type: 'column',
  color: '#4A90E2',
  yAxis: 1,
  data: [3, 2, 3, 3, 3, 3, 3, 3],
  stack: 'PlannedActuals'
},
{
  name: 'Build',
  type: 'column',
  color: '#7B68EE',
  yAxis: 1,
  data: [9, 6, 6, 6, 6, 6, 5, 5],
  stack: 'PlannedActuals'
},
{
  name: 'Borrow',
  type: 'column',
  color: '#5CC4A2',
  yAxis: 1,
  data: [18, 17, 13, 13, 12, 12, 11, 11],
  stack: 'PlannedActuals'
},
