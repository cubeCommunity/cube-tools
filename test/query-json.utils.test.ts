import { Query } from "@cubejs-client/core";
import { removeQueryMember } from "../src/query-util/remove-query-member";
import { replaceQueryMember } from "../src/query-util/replace-query-member";

describe("query Json utils", () => {
  const queryJsonBaseMock: Query = {
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
    measures: ["Tasks.createdAt", "WayPoint2.address", "WayPoint2.city", "WayPoint2.name", "WayPoint2.pickupOrDropoff"],
    dimensions: [
      "Tasks.id",
      "WayPoint2.address",
      "WayPoint2.city",
      "WayPoint2.name",
      "WayPoint2.pickupOrDropoff",
      "Teams.name",
      "Users.name",
      "InventoriesWayPoint2.name",
      "Tasks.vehicleId",
      "Tasks.createdAt",
      "Tasks.startedTime",
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

  const anotherFormatReportMock: Query = {
    ...queryJsonBaseMock,
    filters: [
      {
        and: [
          {
            member: "Tasks.createdAt",
            values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
            operator: "inDateRange",
          },
          { member: "Teams.name", values: ["IL - P"], operator: "contains" },
        ],
      },
      {
        or: [
          { member: "WayPoint1.name", values: ["TTT", "JJJ"], operator: "contains" },
          {
            member: "Tasks.createdAt",
            values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
            operator: "inDateRange",
          },
        ],
      },
      {
        member: "WayPoint1.name",
        values: ["Cool WP"],
        operator: "contains",
      },
    ],
    order: {
      "WayPoint2.address": "asc",
      "WayPoint2.city": "asc",
      "Tasks.createdAt": "desc",
    },
  };

  describe("replaceQueryJSONMember", () => {
    it("should replace member in query json for base format", () => {
      expect(replaceQueryMember(queryJsonBaseMock, "Tasks.createdAt", "Tasks.fantasticDimension")).toEqual({
        order: [
          ["Tasks.fantasticDimension", "desc"],
          ["WayPoint2.address", "asc"],
        ],
        filters: [
          {
            member: "Tasks.fantasticDimension",
            values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
            operator: "inDateRange",
          },
          { member: "Teams.name", values: ["IL - P"], operator: "contains" },
        ],
        measures: [
          "Tasks.fantasticDimension",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
        ],
        dimensions: [
          "Tasks.id",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
          "Teams.name",
          "Users.name",
          "InventoriesWayPoint2.name",
          "Tasks.vehicleId",
          "Tasks.fantasticDimension",
          "Tasks.startedTime",
          "Tasks.status",
        ],
        timeDimensions: [
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.fantasticDimension",
          },
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.scheduledAt",
          },
        ],
      });
    });

    it("should replace member in query json for another format", () => {
      expect(replaceQueryMember(anotherFormatReportMock, "Tasks.createdAt", "Tasks.fantasticDimension")).toEqual({
        filters: [
          {
            and: [
              {
                member: "Tasks.fantasticDimension",
                values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
                operator: "inDateRange",
              },
              { member: "Teams.name", values: ["IL - P"], operator: "contains" },
            ],
          },
          {
            or: [
              { member: "WayPoint1.name", values: ["TTT", "JJJ"], operator: "contains" },
              {
                member: "Tasks.fantasticDimension",
                values: ["2022-12-01 00:00:00", "2022-12-31 23:59:59"],
                operator: "inDateRange",
              },
            ],
          },
          {
            member: "WayPoint1.name",
            values: ["Cool WP"],
            operator: "contains",
          },
        ],
        order: {
          "WayPoint2.address": "asc",
          "WayPoint2.city": "asc",
          "Tasks.fantasticDimension": "desc",
        },
        dimensions: [
          "Tasks.id",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
          "Teams.name",
          "Users.name",
          "InventoriesWayPoint2.name",
          "Tasks.vehicleId",
          "Tasks.fantasticDimension",
          "Tasks.startedTime",
          "Tasks.status",
        ],
        measures: [
          "Tasks.fantasticDimension",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
        ],
        timeDimensions: [
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.fantasticDimension",
          },
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.scheduledAt",
          },
        ],
      });
    });
  });

  describe("removeQueryJSONMember", () => {
    it("should remove member in query json for base format", () => {
      expect(removeQueryMember(queryJsonBaseMock, "Tasks.createdAt")).toEqual({
        order: [["WayPoint2.address", "asc"]],
        filters: [{ member: "Teams.name", values: ["IL - P"], operator: "contains" }],
        measures: ["WayPoint2.address", "WayPoint2.city", "WayPoint2.name", "WayPoint2.pickupOrDropoff"],
        dimensions: [
          "Tasks.id",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
          "Teams.name",
          "Users.name",
          "InventoriesWayPoint2.name",
          "Tasks.vehicleId",
          "Tasks.startedTime",
          "Tasks.status",
        ],
        timeDimensions: [
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.scheduledAt",
          },
        ],
      });
    });

    it("should remove member in query json for another format", () => {
      expect(removeQueryMember(anotherFormatReportMock, "Tasks.createdAt")).toEqual({
        measures: ["WayPoint2.address", "WayPoint2.city", "WayPoint2.name", "WayPoint2.pickupOrDropoff"],
        dimensions: [
          "Tasks.id",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
          "Teams.name",
          "Users.name",
          "InventoriesWayPoint2.name",
          "Tasks.vehicleId",
          "Tasks.startedTime",
          "Tasks.status",
        ],
        timeDimensions: [
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.scheduledAt",
          },
        ],
        filters: [
          {
            and: [{ member: "Teams.name", values: ["IL - P"], operator: "contains" }],
          },
          {
            or: [{ member: "WayPoint1.name", values: ["TTT", "JJJ"], operator: "contains" }],
          },
          {
            member: "WayPoint1.name",
            values: ["Cool WP"],
            operator: "contains",
          },
        ],
        order: {
          "WayPoint2.address": "asc",
          "WayPoint2.city": "asc",
        },
      });
    });

    it("should remove all filters if `and` or `or` array of filter is empty", () => {
      let queryJsonResult: Query = { ...anotherFormatReportMock };

      queryJsonResult = removeQueryMember(queryJsonResult, "Tasks.createdAt");
      queryJsonResult = removeQueryMember(queryJsonResult, "Teams.name");
      queryJsonResult = removeQueryMember(queryJsonResult, "WayPoint1.name");

      expect(queryJsonResult).toEqual({
        measures: ["WayPoint2.address", "WayPoint2.city", "WayPoint2.name", "WayPoint2.pickupOrDropoff"],
        dimensions: [
          "Tasks.id",
          "WayPoint2.address",
          "WayPoint2.city",
          "WayPoint2.name",
          "WayPoint2.pickupOrDropoff",
          "Users.name",
          "InventoriesWayPoint2.name",
          "Tasks.vehicleId",
          "Tasks.startedTime",
          "Tasks.status",
        ],
        timeDimensions: [
          {
            dateRange: ["2022-11-27 00:00:00", "2023-01-03 23:59:00"],
            dimension: "Tasks.scheduledAt",
          },
        ],
        filters: [],
        order: {
          "WayPoint2.address": "asc",
          "WayPoint2.city": "asc",
        },
      });
    });
  });
});
