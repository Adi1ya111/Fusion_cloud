import { NextResponse } from "next/server"

export async function GET() {
  const requiredEnvVars = ["GROQ_API_KEY", "SLACK_WEBHOOK_URL"]
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  return NextResponse.json({
    missing: missingEnvVars,
    complete: missingEnvVars.length === 0,
  })
}
