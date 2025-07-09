/*
'use client'

import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { type Chat } from '@/lib/types'
import { useEffect, useState } from 'react'

export function SidebarList() {
  const [chatIds] = useLocalStorage<string[]>('ai-chat-ids', [])
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const loadChats = async () => {
      const fetchedChats = await getChats(chatIds)
      setChats(fetchedChats)
    }
    loadChats()
  }, [chatIds])

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            chat =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
*/
