series: [
    {
      type: 'pie',
      name: 'Gender',
      size: '90%',
      data: this.genderData.map((d, i) => ({
        name: d.name,
        y: d.y,
        color: i === 0 ? '#85CAF7' : '#A392D3' // Customize color per slice
      }))
    }
  ]
  