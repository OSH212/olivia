import { nanoid } from 'nanoid'
import { FuturisticChat } from '@/components/futuristic-chat'

export const runtime = 'edge'

export default function IndexPage() {
  const id = nanoid()
  return <FuturisticChat id={id} />
}
