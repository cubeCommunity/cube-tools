import { Filter, Query } from "@cubejs-client/core";
import { isDefined } from "../base.helpers";
import { isBinaryOrUnaryFilter, isLogicalAndFilter, isObjectOrder } from "../query-json.helpers";

const removeInFilters = (filters: Filter[], needle: string): Filter[] => {
  return filters.filter((filter) => {
    if (isBinaryOrUnaryFilter(filter)) {
      return filter.member !== needle || filter.dimension !== needle;
    }

    if (isLogicalAndFilter(filter)) {
      filter.and = removeInFilters(filter.and, needle);

      return filter.and.length > 0;
    }

    filter.or = removeInFilters(filter.or, needle);

    return filter.or.length > 0;
  });
};

export const removeQueryMember = (queryJson: Query, needle: string): Query => {
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
