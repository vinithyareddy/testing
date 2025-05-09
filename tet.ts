if (match && !this.cost_obj_req_selectedItems.some(i => i.itemName === match.itemName)) {
  this.cost_obj_req_selectedItems = this.cost_obj_req_selectedItems.concat(match);
}
