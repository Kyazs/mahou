import { tool } from "@opencode-ai/plugin"
import * as fs from "node:fs"
import * as path from "node:path"
import * as os from "node:os"

/**
 * describe_image — auxiliary vision tool.
 *
 * For models without image input: reads one or more local image files,
 * sends them to a configured vision-capable model (OpenAI-compatible chat
 * completions), and returns a text description to the main model.
 *
 * Configuration (first match wins):
 *   1. ~/.config/opencode/mahou/vision-settings.json (installed by mahou):
 *      { "baseURL": "...", "model": "...", "apiKeyEnv": "CLOUDFLARE_API_KEY" }
 *   2. The MAHOU_VISION_BASE_URL / MAHOU_VISION_MODEL / MAHOU_VISION_API_KEY
 *      environment variables.
 *
 * Defaults to the Cloudflare AI Gateway with model `mimo-v2.5` and the
 * CLOUDFLARE_API_KEY environment variable.
 */

const SUPPORTED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp",
  ".svg", ".ico", ".tiff", ".tif",
])

interface VisionSettings {
  baseURL: string
  model: string
  apiKeyEnv: string
}

function loadSettings(): VisionSettings {
  const settingsPath = path.join(
    os.homedir(),
    ".config",
    "opencode",
    "mahou",
    "vision-settings.json",
  )
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = JSON.parse(fs.readFileSync(settingsPath, "utf-8"))
      return {
        baseURL:
          raw.baseURL ??
          "https://gateway.ai.cloudflare.com/v1/bc4c021c0b951028aab5fe08f7c48af9/fireworks/custom-neuralwatt/v1",
        model: raw.model ?? "mimo-v2.5",
        apiKeyEnv: raw.apiKeyEnv ?? "CLOUDFLARE_API_KEY",
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return {
    baseURL: process.env.MAHOU_VISION_BASE_URL ??
      "https://gateway.ai.cloudflare.com/v1/bc4c021c0b951028aab5fe08f7c48af9/fireworks/custom-neuralwatt/v1",
    model: process.env.MAHOU_VISION_MODEL ?? "mimo-v2.5",
    apiKeyEnv: process.env.MAHOU_VISION_API_KEY ?? "CLOUDFLARE_API_KEY",
  }
}

const SYSTEM_PROMPT = [
  "You are an image analysis assistant. Your job is to inspect images and answer",
  "questions about them accurately and thoroughly.",
  "You MUST answer the user's objective/question about the images.",
  "Return ONLY your analysis as plain text — no conversational filler, no offers",
  "to do additional work, no suggestions for next steps.",
].join("\n")

export default tool({
  description:
    "Analyze one or more images using an auxiliary vision model when the active model cannot see images. " +
    "Provide local file paths and an objective describing what you want to know. " +
    "A vision-capable model reads the images and returns a plain text description. " +
    "Use this whenever you need to understand image content but cannot view images directly. " +
    "Supported formats: PNG, JPG, JPEG, GIF, WebP, BMP, SVG, TIFF.",
  args: {
    images: tool.schema
      .array(tool.schema.string())
      .describe("One or more local image file paths to describe (max 10)"),
    objective: tool
      .schema
      .string()
      .describe(
        "What you want to know about the image(s) — e.g. 'What UI components are visible?', 'What errors are present?'",
      ),
  },
  async execute(args, context) {
    const { images, objective } = args
    const cwd = context.directory

    if (!images || images.length === 0) {
      return "No images provided. Pass at least one image file path."
    }
    if (images.length > 10) {
      return `Too many images (${images.length}). Maximum is 10 per call.`
    }

    const absolutePaths: string[] = []
    for (const img of images) {
      const absPath = path.resolve(cwd, img)
      if (!fs.existsSync(absPath)) {
        return `Image file not found: ${absPath}`
      }
      const ext = path.extname(absPath).toLowerCase()
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        return `Unsupported image format '${ext}'. Supported: ${[...SUPPORTED_EXTENSIONS].join(", ")}`
      }
      absolutePaths.push(absPath)
    }

    const settings = loadSettings()
    const apiKey = process.env[settings.apiKeyEnv]
    if (!apiKey) {
      return (
        `Vision model ${settings.model} requires the ${settings.apiKeyEnv} environment variable. ` +
        `Set it or configure ~/.config/opencode/mahou/vision-settings.json.`
      )
    }

    const contents = absolutePaths.map((p) => {
      const data = fs.readFileSync(p)
      const mime =
        extToMime(path.extname(p).toLowerCase()) ?? "image/png"
      return {
        type: "image_url" as const,
        image_url: {
          url: `data:${mime};base64,${data.toString("base64")}`,
        },
      }
    })

    const payload = {
      model: settings.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            ...contents,
            { type: "text", text: `Objective: ${objective}` },
          ],
        },
      ],
      max_tokens: 2048,
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 120_000)
    try {
      const response = await fetch(
        `${settings.baseURL.replace(/\/$/, "")}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      )
      if (!response.ok) {
        const detail = (await response.text()).slice(0, 500)
        return `Vision request failed (HTTP ${response.status}): ${detail}`
      }
      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const text = json.choices?.[0]?.message?.content?.trim()
      if (!text) {
        return "Vision model returned an empty response."
      }
      return text
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return `Image analysis error: ${message}`
    } finally {
      clearTimeout(timer)
    }
  },
})

function extToMime(ext: string): string | undefined {
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  }
  return map[ext]
}
