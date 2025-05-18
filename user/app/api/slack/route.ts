import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!slackWebhookUrl) {
      return NextResponse.json({ error: "Slack webhook URL not configured" }, { status: 500 })
    }

    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    })

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Slack API error:", error)
    return NextResponse.json({ error: "Failed to send message to Slack" }, { status: 500 })
  }
}
