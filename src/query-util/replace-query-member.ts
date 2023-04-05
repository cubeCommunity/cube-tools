import { Filter, Query, QueryOrder } from "@cubejs-client/core";
import { isBinaryOrUnaryFilter, isLogicalAndFilter, isObjectOrder } from "../query-json.helpers";
import { isDefined } from "../base.helpers";

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

export const replaceQueryMember = (queryJson: Query, needle: string, replacement: string): Query => {
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
