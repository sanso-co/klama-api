// 추천 컨트롤러: intent 예측 → question에서 keyword 추출 → DB 조회

import type { RequestHandler } from "express";
import { SortOrder } from "mongoose";
import Show from "../models/show";
import { ensureCaches, getToneObjectIdByNameLoose } from "../services/cache";

import { predictIntentViaPython } from "../services/ml/intentService";
import { norm } from "../utilities/textUtils";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const submitUserEmotion: RequestHandler = async (req, res) => {
    // ───────────────────────────────────────────────────────────────────────────
    // [입력/쿼리 파라미터]
    // ───────────────────────────────────────────────────────────────────────────
    const { feeling, question } = req.body ?? {};
    const {
        page = "1",
        limit = String(DEFAULT_LIMIT),
        sort = "name_asc",
    } = (req.query ?? {}) as {
        page?: string;
        limit?: string;
        sort?: "name_asc" | "date_desc" | "pop_desc" | string;
    };

    // 중복 응답 방지 유틸
    let hasResponded = false;
    const sendOnce = (status: number, body: any) => {
        if (hasResponded) return;
        hasResponded = true;
        res.status(status).json(body);
    };

    try {
        // ───────────────────────────────────────────────────────────────────────
        // ① 입력 검증: feeling / question 필수 확인 + 정규화
        // ───────────────────────────────────────────────────────────────────────
        const rawFeeling = String(feeling ?? "");
        const rawQuestion = String(question ?? "");
        const normalizedFeeling = norm(rawFeeling);
        const sanitizedQuestion = rawQuestion.trim();

        if (!normalizedFeeling || !sanitizedQuestion) {
            sendOnce(400, { error: "Missing 'feeling' or 'question'" });
            return;
        }

        // ───────────────────────────────────────────────────────────────────────
        // ② 캐시 준비: Tone/Keyword 이름→ObjectId 매핑 캐시 로드
        //     (MVP에선 Tone만 사용하지만, ensureCaches로 톤 캐시 보장)
        // ───────────────────────────────────────────────────────────────────────
        await ensureCaches();

        // ───────────────────────────────────────────────────────────────────────
        // ③ Python 추론 호출: intent 예측(soft prior 포함)
        // ───────────────────────────────────────────────────────────────────────
        let predictedIntentName = "";
        let predictedIntentConfidence = 0;
        let pythonEchoedInput = "";

        try {
            const inference = await predictIntentViaPython(rawFeeling, sanitizedQuestion);
            predictedIntentName = inference.intent || "";
            predictedIntentConfidence = inference.confidence || 0;
            pythonEchoedInput = inference.input || "";
        } catch (error: any) {
            sendOnce(500, {
                error: "Intent inference failed",
                details: String(error?.message || error),
            });
            return;
        }

        // ───────────────────────────────────────────────────────────────────────
        // ④ Tone(ObjectId) 조회: 예측 intent → Tone ObjectId 매핑
        //    (없으면 빈 결과를 정상 반환)
        // ───────────────────────────────────────────────────────────────────────
        const toneObjectId = await getToneObjectIdByNameLoose(predictedIntentName);
        if (!toneObjectId) {
            sendOnce(200, {
                intent: predictedIntentName || null,
                confidence: predictedIntentConfidence || null,
                input: pythonEchoedInput,
                items: [],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: 0,
                    totalPages: 0,
                },
            });
            return;
        }

        // ───────────────────────────────────────────────────────────────────────
        // ⑤ 페이지네이션/정렬 옵션 정리
        // ───────────────────────────────────────────────────────────────────────
        const pageNumber = Math.max(1, parseInt(String(page), 10) || 1);
        const pageLimit = Math.min(
            MAX_LIMIT,
            Math.max(1, parseInt(String(limit), 10) || DEFAULT_LIMIT)
        );
        const sortOption: Record<string, SortOrder> =
            sort === "date_desc"
                ? { first_air_date: -1 as SortOrder }
                : sort === "pop_desc"
                ? { popularity_score: -1 as SortOrder }
                : { original_name: 1 as SortOrder }; // 기본: name_asc

        // ───────────────────────────────────────────────────────────────────────
        // ⑥ MongoDB 쿼리 구성: Tone 기준으로만 검색 (키워드 필터 없음 - MVP)
        // ───────────────────────────────────────────────────────────────────────
        const showsFindQuery: any = { tones: toneObjectId };

        // ───────────────────────────────────────────────────────────────────────
        // ⑦ DB 조회 실행: count + list 병렬 수행 → 의도 기반 결과 반환
        // ───────────────────────────────────────────────────────────────────────
        try {
            const [totalCount, showItems] = await Promise.all([
                Show.countDocuments(showsFindQuery),
                Show.find(showsFindQuery)
                    .select("id name original_name poster_path first_air_date popularity_score")
                    .sort(sortOption)
                    .skip((pageNumber - 1) * pageLimit)
                    .limit(pageLimit)
                    .lean(),
            ]);

            sendOnce(200, {
                intent: predictedIntentName,
                confidence: predictedIntentConfidence,
                input: pythonEchoedInput,
                items: showItems, // ← MVP: intent 매칭만으로 구성된 리스트
                pagination: {
                    page: pageNumber,
                    limit: pageLimit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / pageLimit),
                },
            });
            return;
        } catch (dbError) {
            sendOnce(500, { error: "DB query failed", details: String(dbError) });
            return;
        }
    } catch (unhandledError: any) {
        // ───────────────────────────────────────────────────────────────────────
        // ⑧ 최종 에러 핸들링: 예기치 못한 오류에 대한 안전 응답
        // ───────────────────────────────────────────────────────────────────────
        if (!res.headersSent) {
            res.status(500).json({ error: String(unhandledError) });
            return;
        }
    }
};
