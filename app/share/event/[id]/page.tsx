import type { Metadata } from 'next'
import { EVENT_BUILDS } from '@/components/show-builder/showData'
import EventSharePage from '@/components/share/EventSharePage'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const event = EVENT_BUILDS.find((e) => e.id === id) ?? EVENT_BUILDS[0]

  const artistNames = event.lineup
    .map((s) => s.artist.name)
    .slice(0, 3)
    .join(', ')
  const description = `${event.tagline} Featuring ${artistNames}. ${event.date} at ${event.venue}, ${event.venueCity}.`

  return {
    title: `${event.name} — ${event.venue} on Stagefront`,
    description,
    openGraph: {
      title: `${event.name} — ${event.date}`,
      description,
      images: [{ url: event.coverImage, width: 1200, height: 630, alt: event.name }],
      type: 'website',
      siteName: 'Stagefront',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.name} on Stagefront`,
      description,
      images: [event.coverImage],
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const event = EVENT_BUILDS.find((e) => e.id === id) ?? EVENT_BUILDS[0]

  return <EventSharePage event={event} />
}
