import type { SajuResult } from "./types.ts";

/**
 * SajuResult에서 함수 필드(toMarkdown/toCompact)를 제외한 순수 데이터 객체.
 * JSON 직렬화에 안전하다.
 */
export type SajuData = Omit<SajuResult, "toMarkdown" | "toCompact">;

/**
 * SajuResult → 공유 직렬화. 함수 필드만 제외하고 구조화 데이터를 그대로 반환한다.
 * sajuMCP(format:"json")와 리포트 엔진이 동일하게 이 함수를 쓴다 — 직렬화는 하나.
 */
export function serializeSaju(result: SajuResult): SajuData {
  const { toMarkdown, toCompact, ...data } = result;
  return data;
}
