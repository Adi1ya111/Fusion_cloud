"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Eye, BarChart3, AlertTriangle, Building, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handlePersonalClick = () => {
    window.location.href = "http://localhost:3001"
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 z-0">
        <GridBackground />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-blue-600">Fusion Cloud</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#benefits">Benefits</NavLink>
          <NavLink href="#about">About</NavLink>
          <Link href="/dashboard">
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              Login
            </Button>
          </Link>
        </nav>
        <Link href="/dashboard" className="md:hidden">
          <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            Login
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Advanced <span className="text-blue-600">Threat Detection</span> for Modern Enterprises
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Real-time monitoring and AI-powered analysis to protect your infrastructure from emerging cyber threats.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/business-docs">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-6 rounded-lg text-lg group"
              >
                <Building className="mr-2 h-5 w-5" />
                For Business Purpose
              </Button>
            </Link>
            <Button 
              onClick={handlePersonalClick}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-6 rounded-lg text-lg group"
            >
              <User className="mr-2 h-5 w-5" />
              For Personal Use
            </Button>
          </div>
        </motion.div>

        {/* Animated Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 w-full max-w-5xl mx-auto relative"
        >
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl shadow-blue-100/50 overflow-hidden">
            <div className="h-8 bg-gray-100 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                    className="bg-gray-50 rounded-md p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-blue-600 font-medium">Threat Alert</div>
                      <div
                        className={`px-2 py-1 rounded-md text-xs ${
                          i % 2 === 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        {i % 2 === 0 ? "Anomaly 🚨" : "Normal ✅"}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Source:</span>
                        <span className="font-mono text-gray-800">192.168.1.{100 + i}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="text-gray-800">Just now</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated scanning line */}
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "100%" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute left-0 right-0 h-1 bg-blue-400/70 z-10"
            style={{ boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.5)" }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Security Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive protection with advanced features designed for modern threats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Eye}
              title="Real-time Monitoring"
              description="Continuous surveillance of your network traffic and system activities to detect threats as they emerge."
              delay={0.1}
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Anomaly Detection"
              description="AI-powered analysis to identify unusual patterns and potential security breaches with high accuracy."
              delay={0.3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Analytics"
              description="Comprehensive dashboards and reports to visualize security trends and make informed decisions."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard number="99.9%" text="Threat Detection Rate" delay={0.1} />
            <StatCard number="500+" text="Enterprise Clients" delay={0.2} />
            <StatCard number="24/7" text="Security Monitoring" delay={0.3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to secure your infrastructure?</h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience the next generation of cybersecurity threat detection with our interactive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/business-docs">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-6 rounded-lg text-lg group"
              >
                <Building className="mr-2 h-5 w-5" />
                For Business Purpose
              </Button>
            </Link>
            <Button 
              onClick={handlePersonalClick}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-6 rounded-lg text-lg group"
            >
              <User className="mr-2 h-5 w-5" />
              For Personal Use
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-blue-600">Fusion Cloud</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Fusion Cloud Security. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-gray-600 hover:text-blue-600 transition-colors">
      {children}
    </a>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors shadow-sm"
    >
      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, text, delay = 0 }: { number: string; text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="p-6"
    >
      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{text}</div>
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated dots at grid intersections */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              top: `${15 + i * 15}%`,
              left: `${10 + i * 15}%`,
              filter: "blur(1px)",
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${-20 + i * 50}%`,
            y: `${-20 + i * 40}%`,
          }}
          animate={{
            x: `${80 - i * 50}%`,
            y: `${70 - i * 30}%`,
          }}
          transition={{
            duration: 25 + i * 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute rounded-full"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(0, 0, 0, 0) 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  )
}