"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowLeft, Github, Check, Copy, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyCode = (index: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!mounted) return null

  // Animation variants for reusable transitions
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="http://localhost:3000" className="flex items-center">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Back to Home</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Fusion Cloud</span>
            </div>
          </div>
          <a
            href="https://github.com/Adi1ya111/Fusion_cloud.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Github className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">GitHub Repository</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <span aria-hidden="true">📘</span>
                <span>Fusion Cloud – Business Setup Guide</span>
              </h1>
              <a
                href="https://github.com/Adi1ya111/Fusion_cloud.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm"
              >
                <Github className="h-5 w-5" />
                View Repository
              </a>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-12">
            {/* Info Alert */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="text-2xl">
                  ℹ️
                </span>
                <div>
                  <h2 className="font-semibold text-lg text-blue-800">
                    Advanced SIEM Integration for Enterprise Threat Detection
                  </h2>
                  <p className="text-blue-700 mt-1">
                    For security engineers, DevOps professionals, and SOC analysts deploying AI-driven threat detection
                    systems
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav aria-label="Table of contents" className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Contents</h2>
              <ul className="space-y-2">
                {[
                  { name: "Prerequisites", id: "prerequisites" },
                  { name: "Setup Steps", id: "setup-steps" },
                  { name: "ELK Configuration", id: "elk-config" },
                  { name: "Support", id: "support" },
                ].map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sections */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <PrerequisitesSection />
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <SetupSteps copyCode={copyCode} copiedIndex={copiedIndex} />
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <ELKConfiguration copyCode={copyCode} copiedIndex={copiedIndex} />
            </motion.div>

            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            >
              <SupportSection />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

// Extracted Section Components
const PrerequisitesSection = () => (
  <section id="prerequisites" className="space-y-6">
    <h2 className="text-2xl font-bold flex items-center gap-3">
      <span aria-hidden="true">📂</span>
      Prerequisites
    </h2>

    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Minimum System Requirements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="text-2xl mr-3">💻</div>
          <div className="font-medium">8 GB RAM</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="text-2xl mr-3">⚡</div>
          <div className="font-medium">2 vCPU</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
          <div className="text-2xl mr-3">💾</div>
          <div className="font-medium">10 GB Storage</div>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Software Requirements</h3>
      <ul className="space-y-3">
        <li className="flex items-center bg-white p-3 rounded-lg border border-gray-100">
          <span className="text-green-500 mr-3">✅</span> AWS Account with VPC/CloudWatch permissions
        </li>
        <li className="flex items-center bg-white p-3 rounded-lg border border-gray-100">
          <span className="text-green-500 mr-3">✅</span> AWS CLI configured locally
        </li>
        <li className="flex items-center bg-white p-3 rounded-lg border border-gray-100">
          <span className="text-green-500 mr-3">✅</span> Python 3.8+ with pip
        </li>
        <li className="flex items-center bg-white p-3 rounded-lg border border-gray-100">
          <span className="text-green-500 mr-3">✅</span> Linux/macOS environment
        </li>
      </ul>
    </div>
  </section>
)

const SetupSteps = ({ copyCode, copiedIndex }: { copyCode: Function; copiedIndex: number | null }) => (
  <section id="setup-steps" className="space-y-6">
    <h2 className="text-2xl font-bold flex items-center gap-3">
      <span aria-hidden="true">🚀</span>
      Setup Process
    </h2>

    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 flex items-center">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
            1
          </span>
          <h3 className="font-semibold text-lg">Clone Repository</h3>
        </div>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 1 ? "text-green-400" : "text-gray-300"}`}
              onClick={() => copyCode(1, "git clone https://github.com/Adi1ya111/Fusion_cloud.git\ncd Fusion_cloud")}
            >
              {copiedIndex === 1 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 1 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">
              git clone https://github.com/Adi1ya111/Fusion_cloud.git cd Fusion_cloud
            </code>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 flex items-center">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
            2
          </span>
          <h3 className="font-semibold text-lg">Install Dependencies</h3>
        </div>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 2 ? "text-green-400" : "text-gray-300"}`}
              onClick={() => copyCode(2, "pip install -r requirements.txt")}
            >
              {copiedIndex === 2 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 2 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">pip install -r requirements.txt</code>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 flex items-center">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
            3
          </span>
          <h3 className="font-semibold text-lg">Configure Environment</h3>
        </div>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 3 ? "text-green-400" : "text-gray-300"}`}
              onClick={() => copyCode(3, "cp .env.example .env\nnano .env  # Edit configuration parameters")}
            >
              {copiedIndex === 3 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 3 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">cp .env.example .env nano .env # Edit configuration parameters</code>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-6">
      <h3 className="text-xl font-semibold p-4 border-b border-gray-200">Threat Classification Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-4 text-left">Threat Level</th>
              <th className="bg-gray-800 text-white p-4 text-left">Z-Score Threshold</th>
              <th className="bg-gray-800 text-white p-4 text-left">Response Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-red-50">
              <td className="p-4 border-b border-gray-200 font-semibold text-red-700">High</td>
              <td className="p-4 border-b border-gray-200">&gt; 3</td>
              <td className="p-4 border-b border-gray-200">Immediate intervention required</td>
            </tr>
            <tr className="bg-yellow-50">
              <td className="p-4 border-b border-gray-200 font-semibold text-yellow-700">Medium</td>
              <td className="p-4 border-b border-gray-200">2 - 3</td>
              <td className="p-4 border-b border-gray-200">Alert and monitor closely</td>
            </tr>
            <tr className="bg-green-50">
              <td className="p-4 border-b border-gray-200 font-semibold text-green-700">Low</td>
              <td className="p-4 border-b border-gray-200">&lt; 2</td>
              <td className="p-4 border-b border-gray-200">Log and review periodically</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
)

const ELKConfiguration = ({ copyCode, copiedIndex }: { copyCode: Function; copiedIndex: number | null }) => (
  <section id="elk-config" className="space-y-6">
    <h2 className="text-2xl font-bold flex items-center gap-3">
      <span aria-hidden="true">📊</span>
      ELK Stack Integration
    </h2>

    <div className="bg-white p-6 border border-gray-200 rounded-lg text-center">
      <div className="mb-4 text-gray-500">ELK Stack Architecture</div>
      <div className="mx-auto max-w-3xl border-2 border-blue-100 p-6 rounded-xl bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="text-3xl mb-2">🔍</div>
            <h4 className="font-semibold mb-2">Elasticsearch</h4>
            <p className="text-sm text-gray-600">Distributed search engine</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="text-3xl mb-2">📋</div>
            <h4 className="font-semibold mb-2">Logstash</h4>
            <p className="text-sm text-gray-600">Data processing pipeline</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-semibold mb-2">Kibana</h4>
            <p className="text-sm text-gray-600">Visualization platform</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
            <div className="text-xl mr-2">🔄</div>
            <div>
              <h4 className="font-semibold">Fusion Cloud Connector</h4>
              <p className="text-sm text-gray-600">Custom API integration</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
            <div className="text-xl mr-2">🧠</div>
            <div>
              <h4 className="font-semibold">AI Anomaly Engine</h4>
              <p className="text-sm text-gray-600">ML-based detection</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <details className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <summary className="cursor-pointer bg-gray-50 p-4 font-semibold flex items-center justify-between">
          <div>Elasticsearch Installation</div>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </summary>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 4 ? "text-green-400" : "text-gray-300"}`}
              onClick={() =>
                copyCode(
                  4,
                  "wget https://artifacts.elastic.co/.../elasticsearch-8.13.0.tar.gz\ntar -xzf elasticsearch-8.13.0.tar.gz\n./bin/elasticsearch",
                )
              }
            >
              {copiedIndex === 4 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 4 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">
              wget https://artifacts.elastic.co/.../elasticsearch-8.13.0.tar.gz tar -xzf elasticsearch-8.13.0.tar.gz
              ./bin/elasticsearch
            </code>
          </div>
        </div>
      </details>

      <details className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <summary className="cursor-pointer bg-gray-50 p-4 font-semibold flex items-center justify-between">
          <div>Logstash Configuration</div>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </summary>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 5 ? "text-green-400" : "text-gray-300"}`}
              onClick={() =>
                copyCode(
                  5,
                  'input {\n  beats {\n    port => 5044\n  }\n}\n\noutput {\n  elasticsearch {\n    hosts => ["localhost:9200"]\n    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"\n  }\n}',
                )
              }
            >
              {copiedIndex === 5 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 5 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">{`input {
  beats {
    port => 5044
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
  }
}`}</code>
          </div>
        </div>
      </details>

      <details className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <summary className="cursor-pointer bg-gray-50 p-4 font-semibold flex items-center justify-between">
          <div>Kibana Setup</div>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </summary>
        <div className="p-4">
          <div className="bg-gray-900 text-white p-4 rounded-lg relative font-mono text-sm">
            <button
              className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded p-1 text-xs ${copiedIndex === 6 ? "text-green-400" : "text-gray-300"}`}
              onClick={() =>
                copyCode(
                  6,
                  '# In kibana.yml\nserver.host: "0.0.0.0"\nelasticsearch.hosts: ["http://localhost:9200"]\n\n# Start Kibana\n./bin/kibana',
                )
              }
            >
              {copiedIndex === 6 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span className="ml-1">{copiedIndex === 6 ? "Copied!" : "Copy"}</span>
            </button>
            <code className="block whitespace-pre">
              # In kibana.yml server.host: "0.0.0.0" elasticsearch.hosts: ["http://localhost:9200"] # Start Kibana
              ./bin/kibana
            </code>
          </div>
        </div>
      </details>
    </div>
  </section>
)

const SupportSection = () => (
  <section id="support" className="space-y-6">
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span aria-hidden="true">🧑‍💻</span>
        Enterprise Support
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <a
          href="https://github.com/Adi1ya111/Fusion_cloud/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-6 py-4 flex items-center text-white no-underline"
        >
          <Github className="h-6 w-6 mr-3" />
          Open GitHub Issue
        </a>
        <div className="bg-white/10 rounded-lg px-6 py-4">
          <h4 className="font-bold text-lg mb-2">Direct Support</h4>
          <p className="mb-1">
            Email:{" "}
            <a href="mailto:support@fusioncloud.com" className="text-blue-100 hover:text-white">
              support@fusioncloud.com
            </a>
          </p>
          <p>Emergency Response: +1-800-FUSION</p>
        </div>
      </div>
    </div>
  </section>
)
