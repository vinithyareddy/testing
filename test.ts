onSearchEnter(): void {
  if (this.searchQuery && this.searchQuery.trim() !== '') {
    localStorage.setItem('tfSearchPrompt', this.searchQuery.trim());
    this.searchQuery = '';
    this.router.navigate(['/tf/ai-search-results']);
  }
}

