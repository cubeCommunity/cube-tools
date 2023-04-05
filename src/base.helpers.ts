import { BaseCubeMember } from "@cubejs-client/core";

export const isDefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

export const isBaseCubeMember = (member: unknown): member is BaseCubeMember =>
  typeof member === "object" && member !== null && "type" in member && "name" in member;
