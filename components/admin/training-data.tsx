"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Trash2, FileText, User } from "lucide-react"
import type { TrainingEntry } from "@/app/admin/page"

interface TrainingDataProps {
  entries: TrainingEntry[]
  onDeleteEntry: (id: string) => void
}

export function TrainingData({ entries, onDeleteEntry }: TrainingDataProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntries = entries.filter(
    (entry) =>
      entry.instruction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.response.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900 font-serif flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Training Data ({entries.length} entries)
          </div>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400" />
          <Input
            placeholder="Search training entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-orange-200 focus:border-orange-400"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-orange-600">
                {searchTerm
                  ? "No entries match your search."
                  : "No training entries yet. Add some entries to get started."}
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id} className="border border-orange-200/50 hover:border-orange-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={
                            entry.source === "manual"
                              ? "border-blue-300 text-blue-700"
                              : "border-green-300 text-green-700"
                          }
                        >
                          {entry.source === "manual" ? (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              Manual
                            </>
                          ) : (
                            <>
                              <FileText className="h-3 w-3 mr-1" />
                              Transcript
                            </>
                          )}
                        </Badge>
                        {entry.sourceFile && (
                          <Badge variant="outline" className="border-orange-300 text-orange-700 text-xs">
                            {entry.sourceFile}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-orange-600">{formatDate(entry.timestamp)}</span>
                        <Button
                          onClick={() => onDeleteEntry(entry.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-orange-900 mb-1">Instruction:</h4>
                        <p className="text-sm text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-200">
                          {entry.instruction}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-900 mb-1">Response:</h4>
                        <p className="text-sm text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-200 leading-relaxed">
                          {entry.response}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
