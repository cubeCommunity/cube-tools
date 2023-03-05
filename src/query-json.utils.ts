import {
  type BinaryFilter,
  type Filter,
  type LogicalAndFilter,
  type Query,
  type QueryOrder,
  type TQueryOrderObject,
  type UnaryFilter,
} from "@cubejs-client/core";
import { isDefined } from "./helpers";

const isObjectOrder = (order: Query["order"]): order is TQueryOrderObject => typeof order === "object";

const isBinaryOrUnaryFilter = (filter: Filter): filter is BinaryFilter | UnaryFilter =>
  isDefined((filter as BinaryFilter | UnaryFilter).operator);

const isLogicalAndFilter = (filter: Filter): filter is LogicalAndFilter => isDefined((filter as LogicalAndFilter).and);

const replaceInFilter = (filter: Filter, needle: string, replacement: string): Filter => {
  if (isBinaryOrUnaryFilter(filter)) {
    return filter.member === needle ? { ...filter, member: replacement } : filter;
  }

  if (isLogicalAndFilter(filter)) {
    return {
      ...filter,
      and: filter.and.map((filter) => replaceInFilter(filter, needle, replacement)),
    };
  }

  return {
    ...filter,
    or: filter.or.map((filter) => replaceInFilter(filter, needle, replacement)),
  };
};

const removeInFilters = (filters: Filter[], needle: string): Filter[] => {
  return filters.filter((filter) => {
    if (isBinaryOrUnaryFilter(filter)) {
      return filter.member !== needle;
    }

    if (isLogicalAndFilter(filter)) {
      filter.and = removeInFilters(filter.and, needle);

      return filter.and.length > 0;
    }

    filter.or = removeInFilters(filter.or, needle);

    return filter.or.length > 0;
  });
};

export const replaceQueryJSONMember = (queryJson: Query, needle: string, replacement: string): Query => {
  const resultQueryJson = JSON.parse(JSON.stringify(queryJson)) as Query;

  if (isDefined(resultQueryJson.dimensions)) {
    resultQueryJson.dimensions = resultQueryJson.dimensions.map((d) => (d === needle ? replacement : d));
  }

  if (isDefined(resultQueryJson.measures)) {
    resultQueryJson.measures = resultQueryJson.measures.map((m) => (m === needle ? replacement : m));
  }

  if (isDefined(resultQueryJson.order)) {
    if (isObjectOrder(resultQueryJson.order) && isDefined(resultQueryJson.order[needle])) {
      resultQueryJson.order[replacement] = resultQueryJson.order[needle];
      delete resultQueryJson.order[needle];
    }

    if (Array.isArray(resultQueryJson.order)) {
      resultQueryJson.order = resultQueryJson.order.map(([sortValue, sortDir]): [string, QueryOrder] =>
        sortValue === needle ? [replacement, sortDir] : [sortValue, sortDir]
      );
    }
  }

  if (isDefined(resultQueryJson.timeDimensions)) {
    resultQueryJson.timeDimensions = resultQueryJson.timeDimensions.map((timeDimension) =>
      timeDimension.dimension === needle ? { ...timeDimension, dimension: replacement } : timeDimension
    );
  }

  if (isDefined(resultQueryJson.filters)) {
    resultQueryJson.filters = resultQueryJson.filters.map((filter) => replaceInFilter(filter, needle, replacement));
  }

  return resultQueryJson;
};

export const removeQueryJSONMember = (queryJson: Query, needle: string): Query => {
  const resultQueryJson = JSON.parse(JSON.stringify(queryJson)) as Query;

  if (isDefined(resultQueryJson.dimensions)) {
    resultQueryJson.dimensions = resultQueryJson.dimensions.filter((d) => d !== needle);
  }

  if (isDefined(resultQueryJson.measures)) {
    resultQueryJson.measures = resultQueryJson.measures.filter((m) => m !== needle);
  }

  if (isDefined(resultQueryJson.order)) {
    if (isObjectOrder(resultQueryJson.order) && isDefined(resultQueryJson.order[needle])) {
      delete resultQueryJson.order[needle];
    }

    if (Array.isArray(resultQueryJson.order)) {
      resultQueryJson.order = resultQueryJson.order.filter(([sortValue]) => sortValue !== needle);
    }
  }

  if (isDefined(resultQueryJson.timeDimensions)) {
    resultQueryJson.timeDimensions = resultQueryJson.timeDimensions.filter(
      (timeDimension) => timeDimension.dimension !== needle
    );
  }

  if (isDefined(resultQueryJson.filters)) {
    resultQueryJson.filters = removeInFilters(resultQueryJson.filters, needle);
  }

  return resultQueryJson;
};
