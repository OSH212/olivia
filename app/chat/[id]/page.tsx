import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getChat } from '@/app/actions'
import { FuturisticChat } from '@/components/futuristic-chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const { id } = await params
  const chat = await getChat(id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'New Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const chat = await getChat(id)

  // If chat doesn't exist, create a new empty chat instead of 404
  // This allows for new chat creation flow
  return <FuturisticChat id={id} initialMessages={chat?.messages || []} />
}
