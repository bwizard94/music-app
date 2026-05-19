import type { Metadata } from 'next'
import { THE_BLIND_PIG } from '@/components/venue/venueData'
import VenueSharePage from '@/components/share/VenueSharePage'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  // For now the only rich venue data object is THE_BLIND_PIG.
  // Future: fetch from DB by slug.
  const venue = slug === 'the-blind-pig' ? THE_BLIND_PIG : THE_BLIND_PIG
  const description = venue.description.split('\n\n')[0]

  return {
    title: `${venue.name} on Stagefront`,
    description,
    openGraph: {
      title: `${venue.name} — ${venue.type} · ${venue.city}`,
      description,
      images: [{ url: venue.banner, width: 1200, height: 630, alt: venue.name }],
      type: 'website',
      siteName: 'Stagefront',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${venue.name} on Stagefront`,
      description,
      images: [venue.banner],
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  await params
  // For now serve THE_BLIND_PIG data regardless of slug.
  const venue = THE_BLIND_PIG

  return <VenueSharePage venue={venue} />
}
