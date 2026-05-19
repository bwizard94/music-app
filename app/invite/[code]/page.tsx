import type { Metadata } from 'next';
import InviteLanding from '@/components/waitlist/InviteLanding';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: 'You\'ve been invited to Stagefront',
    description:
      'Someone from the scene saved you a spot on Stagefront — the professional network for music culture. Accept your invite to skip the waitlist.',
    openGraph: {
      title: 'You\'ve been invited to Stagefront',
      description: 'Someone from the scene saved you a spot. Don\'t waste it.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
          width: 1200,
          height: 630,
          alt: 'Stagefront — The professional network for music culture',
        },
      ],
      siteName: 'Stagefront',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'You\'ve been invited to Stagefront',
      description: 'Your invite code skips the line. Accept it before it\'s gone.',
      images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80'],
    },
  };
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <InviteLanding code={code.toUpperCase()} />;
}
