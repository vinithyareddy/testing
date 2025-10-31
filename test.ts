  // Prevent multiple simultaneous loads
  if (this.isLoading) {
    console.warn('⚠️ OninitLoad already in progress, skipping duplicate call');
    return;
  }
  this.isLoading = true;
  console.log('🔵 Starting OninitLoad at:', new Date().toISOString());


  