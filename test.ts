this.stateLabelData = this.states.features
  .map((feature: any) => {
    const centroid = d3.geoCentroid(feature);
    const props = feature.properties;

    let label = props?.code_hasc || props?.iso_3166_2 || props?.name;

    if (label && label.includes(".")) {
      label = label.split(".").pop();
    }
    if (label && label.includes("-")) {
      label = label.split("-").pop();
    }

    return label ? { feature, centroid, label } : null;
  })
  .filter((item): item is { feature: any; centroid: [number, number]; label: string } => item !== null);
