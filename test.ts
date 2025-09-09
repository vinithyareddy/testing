import { FeatureCollection, Feature } from 'geojson';

// ...

const countries = topojson.feature(
  worldData as any,
  (worldData as any).objects.countries
);

// Ensure it's a FeatureCollection before using `.features`
if ((countries as FeatureCollection).features) {
  globe
    .polygonsData((countries as FeatureCollection).features)
    .polygonCapColor((d: any) => getColor(d.properties.name))
    .polygonSideColor(() => 'rgba(0,0,0,0.1)')
    .polygonStrokeColor(() => '#111');
}
