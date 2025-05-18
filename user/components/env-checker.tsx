"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function EnvChecker() {
  const [missingEnvVars, setMissingEnvVars] = useState<string[]>([])
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkEnvVars = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()
        setMissingEnvVars(data.missing || [])
      } catch (error) {
        console.error("Failed to check environment variables:", error)
      } finally {
        setChecking(false)
      }
    }

    checkEnvVars()
  }, [])

  if (checking || missingEnvVars.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        The following environment variables are missing: {missingEnvVars.join(", ")}. Please add them to your .env.local
        file.
      </AlertDescription>
    </Alert>
  )
}
