import { test } from "node:test";
import { calculateSaju, serializeSaju } from "../index.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEquals<T>(actual: T, expected: T, message: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${message}\nexpected: ${e}\nactual:   ${a}`);
  }
}

const SAMPLE = {
  year: 2001,
  month: 11,
  day: 3,
  hour: 14,
  minute: 20,
  gender: "남",
  calendar: "solar",
} as const;

// 1-2: SajuResult → JSON 공유 직렬화 (함수 필드 제외).

test("serializeSaju strips toMarkdown/toCompact function fields", () => {
  const data = serializeSaju(calculateSaju(SAMPLE));
  assert(!("toMarkdown" in data), "serialized data should not contain toMarkdown");
  assert(!("toCompact" in data), "serialized data should not contain toCompact");
});

test("serializeSaju retains all structured data fields", () => {
  const data = serializeSaju(calculateSaju(SAMPLE));
  assert(data.dayStem === "庚", "keeps dayStem");
  assert(data.advanced.geukguk === "인수격", "keeps geukguk");
  assertEquals(data.advanced.yongsin, ["己", "丙", "癸"], "keeps yongsin");
  assert(typeof data.fiveElements === "object", "keeps fiveElements");
  assert(Array.isArray(data.seyun), "keeps seyun array");
  assert(typeof data.reference.codes.today === "string", "keeps today reference code");
});

test("serializeSaju output survives JSON round-trip unchanged", () => {
  const data = serializeSaju(calculateSaju(SAMPLE));
  const parsed = JSON.parse(JSON.stringify(data));
  assertEquals(parsed, data, "serialized data should be a pure JSON-stable object");
});
