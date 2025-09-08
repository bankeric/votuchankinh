"use client";

import { useEffect, useState } from "react";
import useFineTuneStore from "@/store/fine-tune";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Save, ThumbsDown, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import useAgents from "@/hooks/use-agents";

export function FileManagement({}) {
  const {
    messages,
    setAllMessages,
    qAndAPairs,
    rejectMessage,
    removeQAndAPair,
    saveQAndAPairsToSystem,
  } = useFineTuneStore();
  const { selectedAgentId } = useAgents();
  useEffect(() => {
    if (!selectedAgentId) {
      return;
    }
    setAllMessages(selectedAgentId);
  }, [selectedAgentId]);

  return (
    <Card>
      {/* Approved Messages Display */}
      {messages.length > 0 && (
        <Card className="p-6 bg-white shadow-lg border-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Approved Messages ({messages.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={message.uuid}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-blue-500 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 font-medium">Q:</span>
                    <p className="text-gray-800 flex-1">{message.content}</p>
                  </div>
                  {message.related_message && (
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-medium">A:</span>
                      <p className="text-gray-700 flex-1">
                        {message.related_message.content}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={() => {
                    rejectMessage(message.uuid);
                  }}
                >
                  <ThumbsDown className="w-3 h-3" /> Disapprove
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* Empty State */}
      {messages.length === 0 && qAndAPairs.length === 0 && (
        <Card className="p-12 bg-gradient-to-br from-gray-50 to-gray-100 border-0 text-center">
          <div className="space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-semibold text-gray-700">No data yet</h3>
            <p className="text-gray-500">
              Start by adding some Q&A pairs above
            </p>
          </div>
        </Card>
      )}
      {/* Q&A Pairs Display */}
      <Card className="p-6 bg-white shadow-lg border-0">
        {qAndAPairs.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              New Q&A Pairs ({qAndAPairs.length})
            </h3>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {qAndAPairs.map((qAndAPair, index) => (
                <div
                  key={`${qAndAPair.question}-${index}`}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-indigo-600 font-semibold min-w-[20px]">
                        Q:
                      </span>
                      <p className="text-gray-800 flex-1 leading-relaxed">
                        {qAndAPair.question}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-purple-600 font-semibold min-w-[20px]">
                        A:
                      </span>
                      <p className="text-gray-700 flex-1 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            pre: ({ node, ...props }) => (
                              <pre
                                style={{ whiteSpace: "pre-wrap" }}
                                {...props}
                              />
                            ),
                          }}
                        >
                          {qAndAPair.answer}
                        </ReactMarkdown>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    onClick={() => {
                      removeQAndAPair(index);
                    }}
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
        <AddQAndAPairDialog />
        {qAndAPairs.length > 0 && (
          <Button
            className="px-6 py-3 mt-4 ml-5 text-white font-medium rounded-lg  transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            onClick={() => {
              saveQAndAPairsToSystem();
            }}
          >
            Save Q&A Pairs to system
          </Button>
        )}
      </Card>
    </Card>
  );
}

const AddQAndAPairDialog = () => {
  const { addQAndAPair } = useFineTuneStore();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      addQAndAPair({ question: question.trim(), answer: answer.trim() });
      setQuestion("");
      setAnswer("");
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-3 mt-4  text-white font-medium rounded-lg  transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          ✨ Add New Q&A Pair
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Q&A Pair</DialogTitle>
          <DialogDescription>
            Add a new question and answer pair to your fine-tuning dataset.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label
                htmlFor="question"
                className="block text-sm font-semibold text-gray-700"
              >
                Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50 hover:bg-white"
                rows={4}
                placeholder="Enter your question here..."
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="answer"
                className="block text-sm font-semibold text-gray-700"
              >
                Answer
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50 hover:bg-white"
                rows={4}
                placeholder="Enter your answer here..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">✨ Add Q&A Pair</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
