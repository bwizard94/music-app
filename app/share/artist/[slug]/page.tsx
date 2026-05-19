import type { Metadata } from 'next'
import { ARTISTS } from '@/lib/data/artists'
import { NOVA_VEGA } from '@/components/profile/artistData'
import ArtistSharePage from '@/components/share/ArtistSharePage'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const base = ARTISTS.find((a) => a.slug === slug) ?? ARTISTS[0]
  const image = base.coverImage ?? base.image

  return {
    title: `${base.name} on Stagefront`,
    description: base.bio,
    openGraph: {
      title: `${base.name} — ${base.role}`,
      description: base.bio,
      images: [{ url: image, width: 1200, height: 630, alt: base.name }],
      type: 'profile',
      siteName: 'Stagefront',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${base.name} on Stagefront`,
      description: base.bio,
      images: [image],
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const base = ARTISTS.find((a) => a.slug === slug) ?? ARTISTS[0]

  // Merge artist base data into NOVA_VEGA shape for the share page
  const artist =
    slug === 'nova-vega'
      ? NOVA_VEGA
      : ({
          ...NOVA_VEGA,
          slug: base.slug,
          name: base.name,
          role: base.role,
          accentColor: base.accentColor,
          verified: base.verified,
          pro: base.proMember ?? false,
          city: base.city,
          country: base.country,
          avatar: base.image,
          banner: base.coverImage ?? base.image,
          bio: base.bio,
          genres: base.genres,
          memberSince: 'Stagefront Member',
          stats: {
            followers: base.followers,
            following: 0,
            shows: base.recentShows,
            connections: Math.round(base.followers * 0.025),
            rating: base.stats.avgRating,
            reviewCount: base.stats.reviewCount,
            profileViews: base.stats.monthlyListeners,
          },
          socialLinks: base.socialLinks,
        } as typeof NOVA_VEGA)

  return <ArtistSharePage artist={artist} />
}
