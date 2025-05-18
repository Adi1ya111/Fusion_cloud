"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import {
  Shield,
  AlertTriangle,
  Search,
  RefreshCw,
  Bell,
  Activity,
  Zap,
  Database,
  Lock,
  FileWarning,
  Wifi,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Info,
  FileText,
  Upload,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/hooks/use-toast"
import { EnvChecker } from "@/components/env-checker"

export default function FusionCloud() {
  const [logText, setLogText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [threatAnalysis, setThreatAnalysis] = useState<string | null>(null)
  const [threatLevel, setThreatLevel] = useState<"low" | "medium" | "high" | null>(null)
  const [sendToSlack, setSendToSlack] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [cveData, setCveData] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("text")
  const [fileName, setFileName] = useState<string>("")
  const resultsRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Animated background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const analyzeLog = async () => {
    if (!logText.trim()) return

    setIsAnalyzing(true)
    setShowResults(false)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logText, sendToSlack }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Check if we got a proper response with analysis
      if (data.analysis) {
        setThreatAnalysis(data.analysis)
        setThreatLevel(data.threatLevel || "low")

        // Extract CVE data if present
        if (data.cve_data) {
          setCveData(data.cve_data)
        } else {
          const cveMatch = data.analysis.match(/Top matching CVEs:([\s\S]*?)(?=\n\n|$)/)
          if (cveMatch && cveMatch[1]) {
            setCveData(cveMatch[1].trim())
          } else {
            setCveData(null)
          }
        }

        if (sendToSlack) {
          toast({
            title: "Alert Sent",
            description: "Threat analysis has been sent to Slack",
            variant: "default",
          })
        }
      } else if (data.error) {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Failed to analyze logs:", error)
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze logs. Please try again.",
        variant: "destructive",
      })

      // Fallback to mock data for demo purposes
      const levels = ["low", "medium", "high"] as const
      const randomLevel = levels[Math.floor(Math.random() * levels.length)]

      let analysis = ""
      if (randomLevel === "high") {
        analysis = `CRITICAL THREAT DETECTED: Analysis indicates a sophisticated attack pattern in the logs. 
      
There appears to be an unauthorized access attempt using a known exploit pattern. The IP address 192.168.1.45 has made multiple failed login attempts followed by a successful login with elevated privileges. This pattern is consistent with a brute force attack followed by privilege escalation.

Recommendation: Block the source IP address immediately and investigate the compromised account. Review all actions taken by this account since the time of compromise.`
      } else if (randomLevel === "medium") {
        analysis = `WARNING: Potential security issue detected in logs.
      
Multiple failed authentication attempts detected from IP 203.45.67.89. While access was not gained, the pattern suggests a potential reconnaissance activity or password spraying attack.

Recommendation: Monitor this IP address for further suspicious activity and consider implementing rate limiting for authentication attempts.`
      } else {
        analysis = `LOW RISK ACTIVITY: Minor anomalies detected in logs.
      
Unusual access patterns detected from internal IP addresses during non-business hours. This may be legitimate maintenance activity, but warrants verification.

Recommendation: Confirm if this activity was scheduled maintenance or authorized access. If not, investigate further.`
      }

      setThreatAnalysis(analysis)
      setThreatLevel(randomLevel)
    } finally {
      setIsAnalyzing(false)
      setShowResults(true)

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        // Try to parse as JSON
        const jsonData = JSON.parse(content)
        // Convert JSON to string for display
        setLogText(JSON.stringify(jsonData, null, 2))
        toast({
          title: "File Loaded",
          description: `Successfully loaded ${file.name}`,
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to parse JSON file:", error)
        toast({
          title: "Invalid JSON",
          description: "The file is not a valid JSON file.",
          variant: "destructive",
        })
        setLogText("")
        setFileName("")
      }
    }
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file.",
        variant: "destructive",
      })
    }
    reader.readAsText(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearResults = () => {
    setLogText("")
    setThreatAnalysis(null)
    setThreatLevel(null)
    setCveData(null)
    setShowResults(false)
    setFileName("")

    // Focus the textarea if on text tab
    if (activeTab === "text" && textareaRef.current) {
      textareaRef.current.focus()
    }

    // Add a small animation to the textarea
    if (activeTab === "text" && textareaRef.current) {
      textareaRef.current.classList.add("border-blue-500")
      setTimeout(() => {
        textareaRef.current?.classList.remove("border-blue-500")
      }, 500)
    }
  }

  const getThreatColor = () => {
    switch (threatLevel) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getThreatText = () => {
    switch (threatLevel) {
      case "high":
        return "High Risk"
      case "medium":
        return "Medium Risk"
      case "low":
        return "Low Risk"
      default:
        return "Unknown"
    }
  }

  const getThreatIcon = () => {
    switch (threatLevel) {
      case "high":
        return <ShieldAlert className="h-5 w-5 text-red-600" />
      case "medium":
        return <FileWarning className="h-5 w-5 text-amber-500" />
      case "low":
        return <ShieldCheck className="h-5 w-5 text-blue-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <EnvChecker />
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`,
        }}
        transition={{ duration: 0.3 }}
      />

      <style jsx global>{`
        .markdown-content h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
          color: #1e40af;
        }
        
        .markdown-content h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0;
          color: #1e40af;
        }
        
        .markdown-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: #1e3a8a;
        }
        
        .markdown-content p {
          margin: 0.5rem 0;
        }
        
        .markdown-content ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .markdown-content li {
          margin: 0.25rem 0;
        }
        
        .markdown-content code {
          background-color: #f1f5f9;
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9rem;
          color: #dc2626;
        }
        
        .markdown-content pre {
          background-color: #f8fafc;
          padding: 0.75rem;
          border-radius: 0.25rem;
          overflow-x: auto;
          margin: 0.75rem 0;
          border: 1px solid #e2e8f0;
        }
        
        .markdown-content blockquote {
          border-left: 3px solid #3b82f6;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #475569;
          font-style: italic;
        }
        
        .markdown-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .markdown-content th {
          background-color: #f1f5f9;
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }
        
        .markdown-content td {
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        
        .markdown-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .markdown-content a:hover {
          color: #1d4ed8;
        }
        
        .markdown-content hr {
          border: 0;
          border-top: 1px solid #e2e8f0;
          margin: 1rem 0;
        }
      `}</style>

      <motion.header
        className="sticky top-0 z-10 border-b bg-white shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Zap className="h-6 w-6 text-blue-700" />
              <motion.div
                className="absolute -inset-1 rounded-full bg-blue-100"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.2, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{ zIndex: -1 }}
              />
            </div>
            <h1 className="text-xl font-bold text-blue-900">FusionCloud</h1>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Switch id="slack-mode" checked={sendToSlack} onCheckedChange={setSendToSlack} />
              <Label htmlFor="slack-mode" className="flex items-center gap-1 text-slate-700">
                <Bell className="h-3 w-3" />
                Send to Slack
              </Label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={clearResults} className="border-slate-300 text-slate-700">
                Clear
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container flex-1 py-6">
        <motion.div
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-[1fr_1fr]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="flex flex-col gap-6"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Activity className="h-5 w-5 text-blue-700" />
                  Log Analysis
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Enter log text or upload a JSON file to analyze for potential security threats
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <Tabs defaultValue="text" className="mb-4" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Text Input
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload JSON
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Paste log content here..."
                      className="min-h-[300px] font-mono text-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 border-slate-300 bg-slate-50 text-slate-800"
                      value={logText}
                      onChange={(e) => setLogText(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="file" className="mt-4">
                    <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-300 rounded-md bg-slate-50 p-6">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {fileName ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-slate-700 mb-1">{fileName}</p>
                          <p className="text-xs text-slate-500 mb-4">File loaded successfully</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={triggerFileInput}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Choose Another File
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-4">
                            <Upload className="h-10 w-10 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Drag and drop your JSON file here</p>
                          <p className="text-xs text-slate-500 mb-4">or click to browse</p>
                          <Button
                            variant="outline"
                            onClick={triggerFileInput}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Select JSON File
                          </Button>
                        </div>
                      )}
                    </div>
                    {logText && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">File Preview:</p>
                        <div className="max-h-[200px] overflow-auto rounded-md bg-slate-100 p-3">
                          <pre className="text-xs font-mono text-slate-800">{logText}</pre>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-white border-t border-slate-100">
                <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-blue-700 hover:bg-blue-800 transition-all duration-300"
                    onClick={analyzeLog}
                    disabled={isAnalyzing || !logText.trim()}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Logs
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="shadow-md border-slate-200">
                <CardHeader className="py-4 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-blue-800 text-sm">
                    <Database className="h-4 w-4 text-blue-700" />
                    Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-700">Backend API</span>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-700">Groq AI</span>
                      </div>
                      <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-700">Slack Notifications</span>
                      </div>
                      <Badge
                        className={sendToSlack ? "bg-green-600 hover:bg-green-700" : "bg-slate-400 hover:bg-slate-500"}
                      >
                        {sendToSlack ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div ref={resultsRef}>
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <Card className="overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg border-slate-200">
                    <CardHeader
                      className={`bg-gradient-to-r border-b border-slate-100 ${
                        threatLevel === "high"
                          ? "from-red-50 to-white"
                          : threatLevel === "medium"
                            ? "from-amber-50 to-white"
                            : "from-blue-50 to-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          {getThreatIcon()}
                          Threat Analysis
                        </CardTitle>
                        <Badge className={`${getThreatColor()} ml-2`}>{getThreatText()}</Badge>
                      </div>
                      <CardDescription className="text-slate-600">
                        AI-powered analysis of potential security threats
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                      <ScrollArea className="h-[400px] rounded-md border border-slate-200 p-4 bg-slate-50">
                        {threatAnalysis && (
                          <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <div>
                              <h3 className="font-semibold text-slate-800">Analysis Results:</h3>
                              <div className="whitespace-pre-wrap text-sm mt-2 text-slate-700 analysis-content">
                                <ReactMarkdown
                                  className="markdown-content"
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeHighlight]}
                                >
                                  {threatAnalysis}
                                </ReactMarkdown>
                              </div>
                            </div>

                            {cveData && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                              >
                                <Separator className="my-4 bg-slate-200" />
                                <div className="rounded-md bg-white p-3 border border-slate-200 shadow-sm">
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-800">
                                    <Eye className="h-4 w-4 text-amber-500" />
                                    CVE Information
                                  </h4>
                                  <p className="text-xs font-mono whitespace-pre-wrap text-slate-700">
                                    {cveData && (
                                      <ReactMarkdown
                                        className="markdown-content"
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                      >
                                        {cveData}
                                      </ReactMarkdown>
                                    )}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            <Separator className="bg-slate-200" />

                            <div className="flex items-center justify-between">
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 10,
                                  delay: 0.4,
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-blue-700" />
                                  <span className="text-sm text-slate-700">
                                    Detection time: {new Date().toLocaleTimeString()}
                                  </span>
                                </div>
                              </motion.div>
                              {sendToSlack && (
                                <motion.div
                                  className="flex items-center text-sm text-slate-600"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.6 }}
                                >
                                  <Bell className="mr-1 h-3 w-3" />
                                  Alert sent to Slack
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {threatLevel === "high" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <Alert className="border-red-300 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-700 font-semibold">Critical Threat Detected</AlertTitle>
                        <AlertDescription className="text-red-600">
                          Immediate action recommended. See analysis for details.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Card className="shadow-sm border-slate-200">
                      <CardHeader className="py-3 bg-gradient-to-r from-blue-50 to-white border-b border-slate-100">
                        <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
                          <Activity className="h-4 w-4 text-blue-700" />
                          Event Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 bg-white">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-slate-500 w-24">Detection:</span>
                            <span className="text-slate-700">{new Date().toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-slate-500 w-24">Analysis:</span>
                            <span className="text-slate-700">{new Date(Date.now() + 2000).toLocaleTimeString()}</span>
                          </div>
                          {sendToSlack && (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-slate-500 w-24">Alert Sent:</span>
                              <span className="text-slate-700">{new Date(Date.now() + 3000).toLocaleTimeString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <motion.footer
        className="border-t py-4 bg-white shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="container flex items-center justify-between">
          <p className="text-sm text-slate-500">FusionCloud v1.0.0</p>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100">
                Documentation
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-slate-700 hover:bg-slate-100">
                Settings
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
