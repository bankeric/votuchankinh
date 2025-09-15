"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"

export function TestAI() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    if (!query.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from BuddhaAI")
      }

      const data = await response.json()
      setResponse(data.response)
    } catch (error) {
      console.error("Error testing AI:", error)
      setResponse("Sorry, there was an error connecting to BuddhaAI. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const clearTest = () => {
    setQuery("")
    setResponse("")
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900 font-serif flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Test Buddha AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-orange-800 font-medium">Test Query</label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a question or prompt to test the AI response..."
            className="min-h-[100px] border-orange-200 focus:border-orange-400 resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleTest}
            disabled={!query.trim() || isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask BuddhaAI
              </>
            )}
          </Button>
          <Button
            onClick={clearTest}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Clear
          </Button>
        </div>

        {response && (
          <div className="space-y-2">
            <label className="text-orange-800 font-medium">AI Response</label>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mr-3">
                  <span className="text-white text-sm">☸</span>
                </div>
                <span className="font-medium text-orange-800 font-serif">Buddha AI</span>
              </div>
              <p className="text-orange-900 leading-relaxed font-light">{response}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
