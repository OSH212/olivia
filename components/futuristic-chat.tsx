"use client"

import type { Message } from 'ai/react'
import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from 'ai/react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { nanoid } from 'nanoid'
import { cn } from "@/lib/utils"
import { getChats, removeChat } from '@/app/actions'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import type { Chat } from '@/lib/types'

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Send, Sparkles, History, Settings, Moon, Sun, Plus, Zap, Brain, Cpu, MoreHorizontal } from "lucide-react"
import { toast } from 'react-hot-toast'


const models = [
  { id: 'google/gemini-2.5-flash', name: 'Gemini Flash', icon: Zap, color: 'from-blue-700 to-blue-500' },
  { id: 'openai/gpt-4.1-mini', name: 'GPT-4.1 Mini', icon: Brain, color: 'from-blue-600 to-blue-400' },
  { id: 'x-ai/grok-3-mini', name: 'Grok 3 Mini', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
]

const personas = [
  { id: 'serious', name: 'Serious', icon: '🎯' },
  { id: 'fun', name: 'Fun', icon: '🎉' },
  { id: 'trump', name: 'Donald Trump', icon: '🇺🇸' },
  { id: 'oracle', name: 'The Oracle', icon: '🔮' },
  { id: 'fuckboy', name: 'The Fuck Boy', icon: '😎' },
  { id: 'astrology', name: 'Astrology Girl', icon: '✨' },
]

export interface ChatProps {
  id?: string
  initialMessages?: Message[]
}

export function FuturisticChat({ id, initialMessages }: ChatProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [apiKey, setApiKey] = useLocalStorage<string | null>('ai-token', null)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(apiKey ?? '')
  const [chatIds, setChatIds] = useLocalStorage<string[]>('ai-chat-ids', [])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [mounted, setMounted] = useState(false)

  const [model, setModel] = useLocalStorage('ai-model', 'google/gemini-2.5-flash')
  const [persona, setPersona] = useLocalStorage('ai-persona', 'serious')

  // Ensure all messages have IDs for React keys - use useMemo to prevent infinite loops
  const messagesWithIds = useMemo(() => {
    return initialMessages?.map((msg, index) => ({
      ...msg,
      id: msg.id || `msg-${index}-${id}`
    })) || []
  }, [initialMessages, id])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages: messagesWithIds,
      id,
      body: {
        id,
        apiKey,
        persona,
        model
      },
      onResponse(response: Response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      onFinish(message) {
        if (!id) return
        // Add the chat ID to local storage if it's not already there
        if (!chatIds.includes(id)) {
          setChatIds([id, ...chatIds])
        }
        // Refresh chat history to show the new chat
        loadChatHistory()
      }
    })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only show API key dialog if mounted and no API key is set
    if (mounted && !apiKey) {
      setApiKeyDialogOpen(true)
    }
  }, [apiKey, mounted])

  const loadChatHistory = async () => {
    const history = await getChats(chatIds)
    setChatHistory(history)
  }

  useEffect(() => {
    if (mounted) {
      loadChatHistory()
    }
  }, [chatIds, mounted])

  // Ensure current chat ID is in the list when component mounts
  useEffect(() => {
    if (mounted && id && !chatIds.includes(id)) {
      setChatIds([id, ...chatIds])
    }
  }, [id, mounted, chatIds, setChatIds])

  const createNewChat = () => {
    const newId = nanoid()
    // Add to chat IDs immediately
    setChatIds([newId, ...chatIds])
    router.push(`/chat/${newId}`)
  }
  
  const handleSend = async () => {
    if (!input.trim()) return
    append({
      id: nanoid(),
      content: input,
      role: 'user'
    })
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedModelData = models.find((m) => m.id === model)
  const darkMode = theme === 'dark'

  // Prevent hydration mismatch by not applying theme-dependent styles until mounted
  const themeClasses = mounted ? (darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900") : "bg-gray-50 text-gray-900"

  return (
    <div className={cn("h-screen flex transition-colors duration-300", themeClasses)}>
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 border-r backdrop-blur-xl",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden",
          mounted && darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-200",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b" style={{borderColor: mounted && darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 1)'}}>
            <div className="flex items-center justify-between mb-6">
              <h1
                className={cn(
                  "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                  "from-blue-400 to-cyan-400",
                )}
              >
                Neural Chat
              </h1>
              {mounted && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(darkMode ? 'light' : 'dark')} className="rounded-full">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0"
              onClick={createNewChat}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 py-4">
              <h3 className={cn("text-sm font-medium px-2 mb-3", mounted && darkMode ? "text-gray-400" : "text-gray-600")}>
                Recent Chats
              </h3>
              {chatHistory.filter(session => session && session.id).map((session) => (
                <div
                  key={session.id}
                  onClick={() => router.push(`/chat/${session.id}`)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all duration-200 group",
                    id === session.id ? (mounted && darkMode ? 'bg-gray-800/70' : 'bg-gray-200/70') : '',
                    "hover:bg-gradient-to-r from-blue-500/10 hover:to-cyan-500/10",
                    mounted && darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-100",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", mounted && darkMode ? "text-gray-200" : "text-gray-900")}>
                        {session.title}
                      </p>
                      <p className={cn("text-xs mt-1 truncate", mounted && darkMode ? "text-gray-500" : "text-gray-500")}>
                        {session.messages?.[0]?.content || 'No messages yet'}
                      </p>
                    </div>
                     <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={async (e) => {
                        e.stopPropagation()
                        const newChatIds = chatIds.filter(chatId => chatId !== session.id)
                        await removeChat({id: session.id, path: session.path})
                        setChatIds(newChatIds)
                        if (id === session.id) {
                          createNewChat()
                        }
                        router.refresh()
                      }}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-4 border-t" style={{borderColor: mounted && darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 1)'}}>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setApiKeyDialogOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className={cn(
            "p-4 border-b backdrop-blur-xl shrink-0",
            mounted && darkMode ? "bg-gray-900/30 border-gray-800" : "bg-white/30 border-gray-200",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full">
                <History className="h-4 w-4" />
              </Button>

              {selectedModelData && (
                <div className="flex items-center space-x-2">
                  <div className={cn("p-2 rounded-lg bg-gradient-to-r", selectedModelData.color)}>
                    <selectedModelData.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className={cn("font-medium", mounted && darkMode ? "text-gray-200" : "text-gray-900")}>
                    {selectedModelData.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* The buttons below are removed as they are part of the original template and not needed. */}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-start space-x-4", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 border-2 border-blue-500/20">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white ml-auto"
                      : mounted && darkMode
                        ? "bg-gray-800/50 text-gray-100 border border-gray-700/50"
                        : "bg-white/50 text-gray-900 border border-gray-200/50",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 border-2 border-blue-500/20">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-4">
                <Avatar className="h-8 w-8 border-2 border-blue-500/20">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 backdrop-blur-sm",
                    mounted && darkMode ? "bg-gray-800/50 border border-gray-700/50" : "bg-white/50 border border-gray-200/50",
                  )}
                >
                  <div className="flex space-x-1">
                    <div key="dot-1" className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      key="dot-2"
                      className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      key="dot-3"
                      className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div
          className={cn(
            "p-6 border-t backdrop-blur-xl shrink-0",
            mounted && darkMode ? "bg-gray-900/30 border-gray-800" : "bg-white/30 border-gray-200",
          )}
        >
          <div className="max-w-4xl mx-auto">
            {/* Model Selection */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={cn("text-sm font-medium", mounted && darkMode ? "text-gray-400" : "text-gray-600")}>Model:</span>
              <div className="flex space-x-2">
                {models.map((m) => (
                  <Button
                    key={m.id}
                    variant={model === m.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setModel(m.id)}
                    className={cn(
                      "transition-all duration-200",
                      model === m.id
                        ? `bg-gradient-to-r ${m.color} text-white border-0 hover:opacity-90`
                        : mounted && darkMode
                          ? "border-gray-700 hover:border-gray-600 text-gray-100"
                          : "border-gray-300 hover:border-gray-400 text-gray-900",
                    )}
                  >
                    <m.icon className="h-3 w-3 mr-1" />
                    {m.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Persona Selection */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={cn("text-sm font-medium", mounted && darkMode ? "text-gray-400" : "text-gray-600")}>Persona:</span>
              <div className="flex space-x-2 flex-wrap">
                {personas.map((p) => (
                  <Button
                    key={p.id}
                    variant={persona === p.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPersona(p.id)}
                    className={cn(
                      "transition-all duration-200",
                      persona === p.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 hover:opacity-90"
                        : mounted && darkMode
                          ? "border-gray-700 hover:border-gray-600 text-gray-100"
                          : "border-gray-300 hover:border-gray-400 text-gray-900",
                    )}
                  >
                    <span className="mr-1">{p.icon}</span>
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={cn(
                  "pr-12 py-4 text-base rounded-2xl border-2 transition-all duration-200",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  mounted && darkMode
                    ? "bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500",
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className={cn("text-xs text-center mt-3", mounted && darkMode ? "text-gray-500" : "text-gray-500")}>
              Neural Chat can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenRouter API Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenRouter API key, you can do so by{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                visiting the OpenRouter website
              </a>
              . The key will be saved to your browser&apos;s local storage.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={apiKeyInput}
            placeholder="OpenRouter API key"
            onChange={e => setApiKeyInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                if(apiKeyInput.trim() === '') {
                  toast.error('API Key cannot be empty.')
                  return
                }
                setApiKey(apiKeyInput)
                setApiKeyDialogOpen(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 