import { BinaryFilter, Filter, LogicalAndFilter, Query, TQueryOrderObject, UnaryFilter } from "@cubejs-client/core";
import { isDefined } from "./base.helpers";

export const isObjectOrder = (order: Query["order"]): order is TQueryOrderObject => typeof order === "object";

export const isBinaryOrUnaryFilter = (filter: Filter): filter is BinaryFilter | UnaryFilter =>
  isDefined((filter as BinaryFilter | UnaryFilter).operator);

export const isLogicalAndFilter = (filter: Filter): filter is LogicalAndFilter =>
  isDefined((filter as LogicalAndFilter).and);
