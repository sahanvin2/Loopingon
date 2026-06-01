"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "0",
    role: "assistant",
    content: "Ayubowan! 👋 I'm your Loopingon assistant. How can I help you today?",
  },
];

const faqResponses: Record<string, string> = {
  shipping: "We offer free domestic shipping on orders over Rs. 5,000. Standard shipping takes 5-7 business days, and express shipping takes 2-3 business days. International shipping is available to most countries.",
  return: "We have an easy 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days for a full refund. Items must be in original condition.",
  payment: "We accept Visa, Mastercard, American Express, PayHere, and Payable. All payments are securely processed with buyer protection.",
  artisan: "Loopingon features over 4,500 verified Sri Lankan artisans. Each artisan is verified through our thorough review process to ensure authentic, quality handmade products.",
  commission: "Our platform commission is 20% for vendors. This covers payment processing, buyer protection, marketing, and platform maintenance.",
  competition: "We run monthly craft competitions with amazing prizes. You can submit your best work to compete with artisans across Sri Lanka. Winners receive cash prizes and featured exposure.",
};

function getBotResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("shipping") || q.includes("delivery")) return faqResponses.shipping;
  if (q.includes("return") || q.includes("refund")) return faqResponses.return;
  if (q.includes("payment") || q.includes("pay")) return faqResponses.payment;
  if (q.includes("artisan") || q.includes("vendor") || q.includes("seller"))
    return faqResponses.artisan;
  if (q.includes("commission") || q.includes("fee")) return faqResponses.commission;
  if (q.includes("competition") || q.includes("contest") || q.includes("challenge"))
    return faqResponses.competition;
  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return "Hi there! How can I help you find beautiful Sri Lankan handmade crafts today?";
  return "I'd love to help! Could you tell me more about what you're looking for? You can ask about shipping, payments, returns, artisans, or our competitions.";
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getBotResponse(input.trim()),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full",
          "bg-teal-600 text-white shadow-teal",
          "flex items-center justify-center",
          "hover:bg-teal-700 transition-colors",
          isOpen && "hidden",
        )}
        aria-label="Open chat assistant"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]",
              "bg-white rounded-xl shadow-soft-lg border border-cream-200",
              "flex flex-col overflow-hidden",
            )}
            style={{ height: "520px", maxHeight: "calc(100vh - 80px)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-teal-600 text-white">
              <Sparkles className="w-5 h-5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Loopingon Assistant</h3>
                <p className="text-xs text-teal-100">We typically reply instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-teal-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm",
                      msg.role === "user"
                        ? "bg-terracotta-600 text-white rounded-br-md"
                        : "bg-white text-charcoal-700 rounded-bl-md shadow-sm border border-cream-200",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-cream-200 px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-warm-gray-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-cream-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Type your question..."
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-full border border-cream-300 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
                    "placeholder:text-warm-gray-400",
                  )}
                  aria-label="Chat message"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    "bg-teal-600 text-white hover:bg-teal-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
