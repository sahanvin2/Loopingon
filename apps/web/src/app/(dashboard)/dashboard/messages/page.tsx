"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import {
  Send,
  Paperclip,
  Search,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { get, post, uploadFile } from "@/lib/api-client";
import { cn, formatRelativeTime, getInitials, getInitialsColor } from "@/lib/utils";
import type { MessageThread, Message, ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ["threads"],
    queryFn: () => get<ApiResponse<MessageThread[]>>("/messages/threads"),
  });

  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedThreadId],
    queryFn: () => get<ApiResponse<Message[]>>(`/messages/threads/${selectedThreadId}/messages`),
    enabled: !!selectedThreadId,
  });

  const sendMutation = useMutation({
    mutationFn: ({
      threadId,
      content,
    }: {
      threadId: string;
      content: string;
    }) => post(`/messages/threads/${threadId}/messages`, { content }),
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  useEffect(() => {
    if (!selectedThreadId || !user) return;

    socketRef.current = io(API_URL, {
      auth: { token: localStorage.getItem("accessToken") },
    });

    socketRef.current.emit("join:thread", { threadId: selectedThreadId });

    socketRef.current.on("new:message", () => {
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedThreadId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const threads = threadsData?.data || [];
  const messages = messagesData?.data || [];

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThreadId) return;
    sendMutation.mutate({ threadId: selectedThreadId, content: newMessage.trim() });
  };

  const filteredThreads = search
    ? threads.filter((t) => {
        const participant = t.participants?.find((p) => p.id !== user?.id);
        return participant?.fullName?.toLowerCase().includes(search.toLowerCase());
      })
    : threads;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-10rem)]"
    >
      <div className="flex h-full bg-white rounded-xl border border-blush-200 overflow-hidden">
        <div className="w-full md:w-80 lg:w-96 border-r border-blush-200 flex flex-col">
          <div className="p-4 border-b border-blush-100">
            <h1 className="text-lg font-semibold text-charcoal-900 mb-3">
              Messages
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blush-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threadsLoading ? (
              <LoadingSkeleton variant="list" count={5} />
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-500">No messages yet.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const otherParticipant = thread.participants?.find(
                  (p) => p.id !== user?.id,
                );
                const initials = getInitials(otherParticipant?.fullName || "vendor");
                const avatarBg = getInitialsColor(otherParticipant?.fullName || "");

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-cream-50 transition-colors border-b border-blush-100",
                      selectedThreadId === thread.id && "bg-rose-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0",
                          avatarBg,
                        )}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-charcoal-900">
                            {otherParticipant?.fullName || "Unknown"}
                          </span>
                          {thread.lastMessageAt && (
                            <span className="text-xs text-muted-500">
                              {formatRelativeTime(thread.lastMessageAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-500 truncate mt-0.5">
                          {thread.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 flex-col">
          {!selectedThread ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-500">
                Select a conversation to start messaging
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-blush-100 bg-cream-50">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white",
                      getInitialsColor(
                        selectedThread?.participants?.find((p) => p.id !== user?.id)
                          ?.fullName || "",
                      ),
                    )}
                  >
                    {getInitials(
                      selectedThread?.participants?.find((p) => p.id !== user?.id)
                        ?.fullName || "vendor",
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">
                      {selectedThread?.participants?.find((p) => p.id !== user?.id)
                        ?.fullName || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-400" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center h-full">
                    <p className="text-sm text-muted-500">
                      No messages yet. Send one!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSent = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex", isSent ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5",
                            isSent
                              ? "bg-rose-600 text-white rounded-br-md"
                              : "bg-cream-50 text-charcoal-900 rounded-bl-md",
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          {msg.attachments?.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-1">
                              {msg.attachments.map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt="Attachment"
                                  className="w-full h-20 object-cover rounded-md cursor-pointer"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              ))}
                            </div>
                          )}
                          <p className={cn("text-xs mt-1", isSent ? "text-rose-100" : "text-muted-500")}>
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="p-4 border-t border-blush-100 flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 rounded-lg text-muted-500 hover:text-rose-600 hover:bg-cream-50 transition-colors"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-blush-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendMutation.isPending}
                  className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                  aria-label="Send message"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {selectedThread && (
          <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
            <div className="p-4 border-b border-blush-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedThreadId(null)}
                className="text-sm text-rose-600 font-medium"
              >
                Back
              </button>
              <span className="text-sm font-medium text-charcoal-900">
                {selectedThread?.participants?.find((p) => p.id !== user?.id)
                  ?.fullName || "Unknown"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-400" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isSent = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex", isSent ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5",
                          isSent
                            ? "bg-rose-600 text-white rounded-br-md"
                            : "bg-cream-50 text-charcoal-900 rounded-bl-md",
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={cn("text-xs mt-1", isSent ? "text-rose-100" : "text-muted-500")}>
                          {formatRelativeTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-blush-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-blush-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sendMutation.isPending}
                className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
}
