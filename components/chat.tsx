'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [apiKey, setApiKey] = useLocalStorage<string | null>('ai-token', null)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(apiKey ?? '')
  const [persona, setPersona] = useLocalStorage('ai-persona', 'serious')
  const [model, setModel] = useLocalStorage('ai-model', 'google/gemini-2.5-flash')
  const [chatIds, setChatIds] = useLocalStorage<string[]>('ai-chat-ids', [])

  useEffect(() => {
    if (!apiKey) {
      setApiKeyDialogOpen(true)
    }
  }, [apiKey])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
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
        if (!chatIds.includes(id)) {
          setChatIds([...chatIds, id])
        }
      }
    })
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className={cn('flex-1 overflow-y-auto p-4', className)}>
        {messages.length ? (
          <ChatList messages={messages} />
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
        <ChatScrollAnchor trackVisibility={isLoading} />
      </div>
      <div className="p-4 bg-background border-t">
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        />
        <div className="fixed bottom-20 left-0 right-0 mx-auto w-fit">
          <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serious">Serious</SelectItem>
              <SelectItem value="fun">Fun</SelectItem>
              <SelectItem value="trump">Donald Trump</SelectItem>
              <SelectItem value="oracle">The Oracle</SelectItem>
              <SelectItem value="fuckboy">The Fuck Boy</SelectItem>
              <SelectItem value="astrology">Astrology Girl</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="fixed bottom-20 left-1/2 right-0 mx-auto w-fit -translate-x-1/2">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google/gemini-2.5-flash">Gemini Flash</SelectItem>
              <SelectItem value="openai/gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
              <SelectItem value="tngtech/deepseek-r1t2-chimera:free">DeepSeek Chimera (Free)</SelectItem>
            </SelectContent>
          </Select>
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
