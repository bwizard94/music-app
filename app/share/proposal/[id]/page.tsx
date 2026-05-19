import type { Metadata } from 'next'
import { MOCK_PROPOSALS } from '@/lib/data/proposals'
import ProposalSharePage from '@/components/share/ProposalSharePage'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const proposal = MOCK_PROPOSALS.find((p) => p.id === id) ?? MOCK_PROPOSALS[0]

  const artistNames = proposal.lineup
    .map((a) => a.name)
    .slice(0, 3)
    .join(', ')
  const description = `${proposal.tagline} Featuring ${artistNames}. Proposed for ${proposal.venueName}, ${proposal.venueCity}.`

  return {
    title: `${proposal.name} — Show Proposal on Stagefront`,
    description,
    openGraph: {
      title: `${proposal.name} — ${proposal.venueName}`,
      description,
      images: [{ url: proposal.coverImage, width: 1200, height: 630, alt: proposal.name }],
      type: 'website',
      siteName: 'Stagefront',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${proposal.name} on Stagefront`,
      description,
      images: [proposal.coverImage],
    },
  }
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const proposal = MOCK_PROPOSALS.find((p) => p.id === id) ?? MOCK_PROPOSALS[0]

  return <ProposalSharePage proposal={proposal} />
}
