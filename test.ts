this.mockService.getWorkforceByGender().subscribe((data) => {
    this.genderData = data.map((item) => ({
      name: item.name,
      y: item.value
    }));
    this.loadChart();
  });
  