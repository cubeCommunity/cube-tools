import { transferDimensionToMeasure, transferMeasureToDimension } from "../src/query-util/transfer-query-member";
import { Query } from "@cubejs-client/core";

describe("transferQueryMember", () => {
  const queryJsonMock: Query = {
    order: [
      ["Tasks.createdAt", "desc"],
      ["WayPoint2.address", "asc"],
    ],
    filters: [
      {
        member: "Tasks.createdAt",
        values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
        operator: "inDateRange",
      },
      { member: "Teams.name", values: ["IL - P"], operator: "contains" },
    ],
    measures: ["Tasks.createdAtSum", "WayPoint2.addressCount"],
    dimensions: [
      "WayPoint2.name",
      "WayPoint2.pickupOrDropoff",
      "Teams.name",
      "Users.name",
      "InventoriesWayPoint2.name",
      "Tasks.createdAt",
      "Tasks.status",
    ],
    timeDimensions: [
      {
        dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
        dimension: "Tasks.createdAt",
      },
      {
        dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
        dimension: "Tasks.scheduledAt",
      },
    ],
  };

  describe("transferDimensionToMeasure", () => {
    it("should transfer the given dimension to measures without renaming", () => {
      const newQuery = transferDimensionToMeasure(queryJsonMock, "Teams.name");

      expect(newQuery.dimensions).toEqual([
        "WayPoint2.name",
        "WayPoint2.pickupOrDropoff",
        "Users.name",
        "InventoriesWayPoint2.name",
        "Tasks.createdAt",
        "Tasks.status",
      ]);
      expect(newQuery.measures).toEqual(["Tasks.createdAtSum", "WayPoint2.addressCount", "Teams.name"]);
      expect(newQuery.filters).toEqual(queryJsonMock.filters);
      expect(newQuery.order).toEqual(queryJsonMock.order);
      expect(newQuery.timeDimensions).toEqual(queryJsonMock.timeDimensions);
    });

    it("should transfer the given dimension to measures with renaming", () => {
      const newQuery = transferDimensionToMeasure(queryJsonMock, "Teams.name", "newMeasureName");

      expect(newQuery.dimensions).toEqual([
        "WayPoint2.name",
        "WayPoint2.pickupOrDropoff",
        "Users.name",
        "InventoriesWayPoint2.name",
        "Tasks.createdAt",
        "Tasks.status",
      ]);
      expect(newQuery.measures).toEqual(["Tasks.createdAtSum", "WayPoint2.addressCount", "newMeasureName"]);
      expect(newQuery.filters).toEqual(queryJsonMock.filters);
      expect(newQuery.order).toEqual(queryJsonMock.order);
      expect(newQuery.timeDimensions).toEqual(queryJsonMock.timeDimensions);
    });

    it("should not transfer anything if the given dimension does not exist", () => {
      const newQuery = transferDimensionToMeasure(queryJsonMock, "nonexistentDimension");
      expect(newQuery).toEqual(queryJsonMock);
    });

    it("should return a new query object and not modify the original query", () => {
      const newQuery = transferDimensionToMeasure(queryJsonMock, "Teams.name");
      expect(newQuery).not.toBe(queryJsonMock);
    });
  });

  describe("transferMeasureToDimension", () => {
    it("should transfer the given measure to dimensions without renaming", () => {
      const newQuery = transferMeasureToDimension(queryJsonMock, "Tasks.createdAtSum");

      expect(newQuery.dimensions).toEqual([
        "WayPoint2.name",
        "WayPoint2.pickupOrDropoff",
        "Teams.name",
        "Users.name",
        "InventoriesWayPoint2.name",
        "Tasks.createdAt",
        "Tasks.status",
        "Tasks.createdAtSum",
      ]);
      expect(newQuery.measures).toEqual(["WayPoint2.addressCount"]);
      expect(newQuery.filters).toEqual(queryJsonMock.filters);
      expect(newQuery.order).toEqual(queryJsonMock.order);
      expect(newQuery.timeDimensions).toEqual(queryJsonMock.timeDimensions);
    });

    it("should transfer the given measure to dimensions with renaming", () => {
      const newQuery = transferMeasureToDimension(queryJsonMock, "Tasks.createdAtSum", "Tasks.createdAtSumRenamed");

      expect(newQuery.dimensions).toEqual([
        "WayPoint2.name",
        "WayPoint2.pickupOrDropoff",
        "Teams.name",
        "Users.name",
        "InventoriesWayPoint2.name",
        "Tasks.createdAt",
        "Tasks.status",
        "Tasks.createdAtSumRenamed",
      ]);
      expect(newQuery.measures).toEqual(["WayPoint2.addressCount"]);
      expect(newQuery.filters).toEqual(queryJsonMock.filters);
      expect(newQuery.order).toEqual(queryJsonMock.order);
      expect(newQuery.timeDimensions).toEqual(queryJsonMock.timeDimensions);
    });

    it("should not transfer anything if the given measure does not exist", () => {
      const newQuery = transferDimensionToMeasure(queryJsonMock, "nonexistentMeasure");
      expect(newQuery).toEqual(queryJsonMock);
    });

    it("should return a new query object and not modify the original query", () => {
      const newQuery = transferMeasureToDimension(queryJsonMock, "Tasks.createdAtSum");
      expect(newQuery).not.toBe(queryJsonMock);
    });
  });
});
