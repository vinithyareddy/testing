const labelObjs = (this.globe as any).labelsData();
const labelMeshes = scene.children.filter((obj: any) => obj.type === 'Sprite'); // ✅ correct


const labelMeshes = scene.children.filter((obj: any) => obj.type === 'Sprite'); // ✅ only pick labels
const intersects = this.raycaster.intersectObjects(labelMeshes, true);
