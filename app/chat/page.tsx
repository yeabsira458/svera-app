// app/chat/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getChatContacts, getChatMessages, sendChatMessage } from "@/actions/chat-actions";
import { getCurrentUser } from "@/actions/post-actions";

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth and load contacts
  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        const contactList = await getChatContacts();
        setContacts(contactList);
        // Pre-select first contact if available
        if (contactList.length > 0) {
          setSelectedContact(contactList[0]);
        }
      } catch (err) {
        console.error("Failed initializing chat:", err);
      } finally {
        setLoadingContacts(false);
      }
    }
    init();
  }, []);

  // Load messages when selected contact changes
  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact.id);
    }
  }, [selectedContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up periodic polling for new messages (every 5 seconds)
  useEffect(() => {
    if (!selectedContact) return;

    const interval = setInterval(() => {
      refreshMessages(selectedContact.id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedContact]);

  const loadMessages = async (contactId: string) => {
    setLoadingMessages(true);
    try {
      const msgs = await getChatMessages(contactId);
      setMessages(msgs);
    } catch (err) {
      console.error("Error loading chat messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const refreshMessages = async (contactId: string) => {
    try {
      const msgs = await getChatMessages(contactId);
      setMessages(msgs);
    } catch (err) {
      console.error("Error refreshing chat messages:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || (!content.trim() && (!fileInputRef.current?.files?.[0]))) return;

    setSending(true);
    const formData = new FormData();
    formData.set("recipientId", selectedContact.id);
    formData.set("content", content);
    
    if (fileInputRef.current?.files?.[0]) {
      formData.set("imageFile", fileInputRef.current.files[0]);
    }

    try {
      await sendChatMessage(formData);
      setContent("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refreshMessages(selectedContact.id);
    } catch (err: any) {
      alert("Error sending message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  const isThemeAdmin = currentUser?.role === "admin";
  const primaryColorClass = isThemeAdmin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700";
  const textColorClass = isThemeAdmin ? "text-indigo-600" : "text-emerald-600";
  const lightBgClass = isThemeAdmin ? "bg-indigo-50" : "bg-emerald-50";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`font-bold text-sm px-3 py-1.5 rounded-lg border transition ${
                isThemeAdmin ? "hover:bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              ← Back to Feed
            </Link>
            <h1 className="font-extrabold text-lg text-gray-900">SVERA Help Chat</h1>
          </div>
          {currentUser && (
            <div className="text-right">
              <p className="text-xs font-bold text-gray-800">{currentUser.full_name}</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold">
                {currentUser.role} Account
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex py-6 px-6 gap-6 h-[calc(100vh-80px)] overflow-hidden">
        {/* Contact List (Left Sidebar) */}
        <aside className="w-1/3 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-sm text-gray-900">Conversations</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {isThemeAdmin ? "Inbound citizen inquiries" : "Available agency registrars"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="text-center py-8 text-xs text-gray-400">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-gray-500">
                {isThemeAdmin
                  ? "No citizen messages received yet."
                  : "No agency admins found to message."}
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left p-4 flex items-center gap-3 border-b hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? lightBgClass : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                    isThemeAdmin ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {contact.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{contact.full_name}</h4>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      {contact.role}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat Conversation Pane (Right) */}
        <main className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
          {selectedContact ? (
            <>
              {/* Active Conversation header */}
              <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isThemeAdmin ? "bg-indigo-500" : "bg-emerald-500"} animate-pulse`}></span>
                  <span className="font-bold text-xs text-gray-800">
                    Chatting with: {selectedContact.full_name}
                  </span>
                </div>
                <button
                  onClick={() => loadMessages(selectedContact.id)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-medium"
                >
                  🔄 Reload Chat
                </button>
              </div>

              {/* Message History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30">
                {loadingMessages && messages.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-8">Loading history...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-8">
                    Send a message to start the private chat conversation.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.sender_id === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[70%] ${
                          isSelf ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs shadow-sm leading-relaxed ${
                            isSelf
                              ? `${isThemeAdmin ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"} rounded-tr-none`
                              : "bg-white text-gray-900 border rounded-tl-none"
                          }`}
                        >
                          {/* Image rendering */}
                          {msg.file_url && (
                            <div className="mb-2 max-w-sm rounded-lg overflow-hidden border bg-gray-100">
                              <img
                                src={msg.file_url}
                                alt="Shared photo"
                                className="object-cover max-h-48 w-full"
                              />
                            </div>
                          )}
                          {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex flex-col gap-3">
                {/* Photo Selector */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="imageFile"
                    className={`text-[10px] font-bold cursor-pointer border rounded-full px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 transition`}
                  >
                    📎 Add Photo / Image
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Selected photo: ${file.name}`);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your private message here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 text-xs p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className={`px-5 py-3 text-white font-semibold text-xs rounded-xl transition ${primaryColorClass} disabled:opacity-50`}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="font-bold text-sm text-gray-700 mb-1">No Chat Selected</h3>
              <p className="text-xs">Select a contact from the left list to start conversing.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
