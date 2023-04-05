import { Query } from "@cubejs-client/core";

const prepareQuery = (query: Query) => ({
  ...query,
  dimensions: [...(query.dimensions ?? [])],
  measures: [...(query.measures ?? [])],
});

// handle timeDimension in filters case
export const transferDimensionToMeasure = (query: Query, dimensionName: string, newMeasureName = dimensionName) => {
  const newQuery = prepareQuery(query);
  const dIndex = newQuery.dimensions.indexOf(dimensionName);

  if (dIndex > -1) {
    newQuery.dimensions = [...newQuery.dimensions.slice(0, dIndex), ...newQuery.dimensions.slice(dIndex + 1)];
    newQuery.measures = [...newQuery.measures, newMeasureName];
  }

  return newQuery;
};

export const transferMeasureToDimension = (query: Query, measureName: string, newDimensionName = measureName) => {
  const newQuery = prepareQuery(query);
  const mIndex = newQuery.measures.indexOf(measureName);

  if (mIndex > -1) {
    newQuery.measures = [...newQuery.measures.slice(0, mIndex), ...newQuery.measures.slice(mIndex + 1)];
    newQuery.dimensions = [...newQuery.dimensions, newDimensionName];
  }

  return newQuery;
};
