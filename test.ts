// ✅ Disable Filter button only for TF Reform (MVP) reports
const currentPath = window.location.pathname.toLowerCase();
if (currentPath.includes('tfreform') && currentPath.includes('mvp') && value.id === 'Report') {
  console.log('Disabling filter for TF Reform MVP Reports tab');
  this.fwService.apiToggleHeaderControls({ filter: false });
} else {
  this.fwService.apiToggleHeaderControls({ filter: true });
}
