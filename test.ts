xAxis: {
  categories: [
    { name: '2022', categories: ['Planned', 'Actuals'] },
    { name: '2023', categories: ['Planned', 'Actuals'] },
    { name: '2024', categories: ['Planned', 'Actuals'] },
    { name: '2025', categories: ['Planned', 'Actuals'] }
  ] as any,   // ✅ this tells TypeScript to skip strict type check
  labels: {
    style: { fontSize: '12px', color: '#333' }
  }
},
