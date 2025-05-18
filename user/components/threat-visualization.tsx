"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface ThreatVisualizationProps {
  threatLevel: "low" | "medium" | "high" | null
}

export function ThreatVisualization({ threatLevel }: ThreatVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !threatLevel) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create particles based on threat level
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
    }[] = []

    const particleCount = threatLevel === "high" ? 100 : threatLevel === "medium" ? 50 : 20
    const colors = {
      high: ["#f87171", "#ef4444", "#dc2626"],
      medium: ["#fbbf24", "#f59e0b", "#d97706"],
      low: ["#60a5fa", "#3b82f6", "#2563eb"],
    }

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 3 + 1
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        color: colors[threatLevel][Math.floor(Math.random() * 3)],
        velocity: {
          x: (Math.random() - 0.5) * (threatLevel === "high" ? 2 : 1),
          y: (Math.random() - 0.5) * (threatLevel === "high" ? 2 : 1),
        },
      })
    }

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Update position
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        // Bounce off walls
        if (particle.x - particle.radius <= 0 || particle.x + particle.radius >= canvas.width) {
          particle.velocity.x = -particle.velocity.x
        }

        if (particle.y - particle.radius <= 0 || particle.y + particle.radius >= canvas.height) {
          particle.velocity.y = -particle.velocity.y
        }
      })

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `${particles[i].color}${Math.floor((1 - distance / 100) * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Start animation
    const animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [threatLevel])

  if (!threatLevel) return null

  return (
    <motion.div
      className="relative w-full h-32 rounded-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-white font-bold text-xl drop-shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {threatLevel === "high"
            ? "Critical Threat Detected"
            : threatLevel === "medium"
              ? "Potential Threat Detected"
              : "Low Risk Activity"}
        </motion.div>
      </div>
    </motion.div>
  )
}
