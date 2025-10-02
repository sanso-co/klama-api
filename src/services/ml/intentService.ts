// Python 추론 프로세스 호출 (intent 예측)

import path from "path";
import { spawn } from "child_process";

const PYTHON_BIN = process.env.PYTHON_BIN || "/opt/anaconda3/bin/python";
const PY_TIMEOUT_MS = Number(process.env.PY_TIMEOUT_MS || 8000);

/** ① Python 스크립트 호출로 intent 예측 수행 */
export async function predictIntentViaPython(
    feelingHumanReadable: string,
    questionText: string
): Promise<{ intent: string; confidence: number; input: string }> {
    const scriptPath = path.resolve("src/ml/predict_intent.py");
    const env = { ...process.env, PYTHONUNBUFFERED: "1" };

    return new Promise((resolve, reject) => {
        const py = spawn(PYTHON_BIN, [scriptPath, feelingHumanReadable, questionText], { env });

        let timer: NodeJS.Timeout | null = setTimeout(() => {
            try {
                py.kill("SIGKILL");
            } catch {}
            reject(new Error("PY_TIMEOUT"));
        }, PY_TIMEOUT_MS);

        let stdoutBuffer = "";
        let stderrBuffer = "";

        py.stdout.on("data", (chunk) => (stdoutBuffer += chunk.toString()));
        py.stderr.on("data", (chunk) => (stderrBuffer += chunk.toString()));

        py.on("error", (err) => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            reject(err);
        });

        py.on("close", (code) => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (code !== 0) {
                return reject(new Error(`PY_EXIT_${code}: ${stderrBuffer || stdoutBuffer}`));
            }
            try {
                const parsed = JSON.parse(stdoutBuffer);
                const top = parsed?.top_predictions?.[0];
                if (!top) {
                    return resolve({
                        intent: null as any,
                        confidence: null as any,
                        input: parsed?.input ?? "",
                    });
                }
                return resolve({
                    intent: String(top.intent || ""),
                    confidence: Number(top.confidence ?? 0),
                    input: String(parsed.input || ""),
                });
            } catch {
                return reject(new Error(`PY_BAD_JSON: ${stdoutBuffer}`));
            }
        });
    });
}
