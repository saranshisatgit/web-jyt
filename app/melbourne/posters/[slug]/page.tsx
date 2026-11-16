import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { POSTERS, posterBySlug } from '@/data/melbourne-posters'
import { MelbournePoster } from '@/components/melbourne-poster/poster'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return POSTERS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poster = posterBySlug((await params).slug)
  if (!poster) return {}
  return { title: poster.title, description: poster.description }
}

export default async function MelbournePosterPage({ params }: Props) {
  const poster = posterBySlug((await params).slug)
  if (!poster) notFound()
  return <MelbournePoster poster={poster} />
}
