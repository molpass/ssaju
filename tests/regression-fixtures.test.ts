import { test } from "node:test";
import { calculateSaju } from "../index.ts";

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

// 데일리 브리핑 R2 1-1 — known-good 회귀 픽스처.
// 엔진 변경(직렬화 모듈 신설 등)이 이 앵커를 깨지 않는지 항상 통과해야 한다.

// 앵커 1: ssaju README known-good — 2001-11-03 14:20 남 → 일간 庚 · 인수격 · 용신 己·丙·癸
test("regression fixture: 2001-11-03 14:20 남 (일간 庚·인수격·용신 己丙癸)", () => {
  const r = calculateSaju({
    year: 2001,
    month: 11,
    day: 3,
    hour: 14,
    minute: 20,
    gender: "남",
    calendar: "solar",
  });

  assert(r.dayStem === "庚", `day stem should be 庚, got ${r.dayStem}`);
  assert(
    r.advanced.geukguk === "인수격",
    `geukguk should be 인수격, got ${r.advanced.geukguk}`,
  );
  assertEquals(r.advanced.yongsin, ["己", "丙", "癸"], "yongsin should be 己·丙·癸");
});

// 앵커 2: PM ground truth (R3 보정) — 1976-02-28 02:30 丑時 서울 남 → 일주 庚戌 · 시주 丁丑.
// 진태양시(LMT) ON/OFF 모두 丑時(시주 丁丑) 동일해야 한다(SATI 일관성 고정).
const PM_BIRTH = {
  year: 1976,
  month: 2,
  day: 28,
  hour: 2,
  minute: 30,
  gender: "남",
  calendar: "solar",
} as const;

test("regression fixture: 1976-02-28 02:30 丑時 서울 남, LMT OFF (일주 庚戌 · 시주 丁丑)", () => {
  const r = calculateSaju(PM_BIRTH);
  assert(r.pillars.day === "庚戌", `day pillar should be 庚戌, got ${r.pillars.day}`);
  assert(r.pillars.hour === "丁丑", `hour pillar should be 丁丑, got ${r.pillars.hour}`);
});

test("regression fixture: same birth, LMT ON (서울 경도) still 庚戌 · 丁丑", () => {
  const r = calculateSaju({ ...PM_BIRTH, applyLocalMeanTime: true, longitude: 126.978 });
  assert(r.pillars.day === "庚戌", `day pillar should be 庚戌, got ${r.pillars.day}`);
  assert(r.pillars.hour === "丁丑", `LMT ON hour pillar should still be 丁丑, got ${r.pillars.hour}`);
});
