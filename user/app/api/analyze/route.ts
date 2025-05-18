import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { logText } = await request.json()

    if (!logText || typeof logText !== "string") {
      return NextResponse.json({ error: "Log text is required" }, { status: 400 })
    }

    // Create a temporary file to store the log text
    const tempDir = path.join(process.cwd(), "temp")
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempFilePath = path.join(tempDir, `log_${Date.now()}.txt`)
    fs.writeFileSync(tempFilePath, logText)

    // Pass environment variables to the Python script
    const env = {
      ...process.env,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    }

    // Execute the Python script with the log file as input
    const { stdout, stderr } = await execAsync(`python threat_agent.py "${tempFilePath}"`, { env })

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath)

    if (stderr && !stderr.includes("InsecureRequestWarning")) {
      console.error("Python script error:", stderr)
      return NextResponse.json({ error: "Error analyzing logs", details: stderr }, { status: 500 })
    }

    // Try to parse the output as JSON
    try {
      const jsonOutput = JSON.parse(stdout)
      return NextResponse.json(jsonOutput)
    } catch (e) {
      // If not JSON, parse the text output
      let threatLevel = "low"
      if (stdout.includes("CRITICAL") || stdout.includes("High Risk")) {
        threatLevel = "high"
      } else if (stdout.includes("WARNING") || stdout.includes("Medium Risk")) {
        threatLevel = "medium"
      }

      return NextResponse.json({
        analysis: stdout,
        threatLevel,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to analyze logs", details: String(error) }, { status: 500 })
  }
}
