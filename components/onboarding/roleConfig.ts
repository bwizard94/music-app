export type RoleId =
  | 'band'
  | 'solo_artist'
  | 'dj'
  | 'producer'
  | 'venue'
  | 'promoter'
  | 'photographer'
  | 'videographer'
  | 'visual_artist'
  | 'lighting_designer'
  | 'sound_engineer'
  | 'booking_agent';

export interface RoleConfig {
  id: RoleId;
  label: string;
  tagline: string;
  emoji: string;
  color: string;
  gradient: string;
  genres: string[];
  platforms: { label: string; placeholder: string }[];
  specialties: string[];
  goals: string[];
}

export const ROLE_CONFIGS: Record<RoleId, RoleConfig> = {
  band: {
    id: 'band',
    label: 'Band',
    tagline: 'Find shows, venues & collaborators',
    emoji: '🎸',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    genres: ['Rock', 'Indie', 'Alternative', 'Punk', 'Metal', 'Pop', 'Folk', 'Country', 'Funk', 'Blues', 'Jazz', 'R&B', 'Hip-Hop', 'Soul', 'Reggae', 'Electronic', 'Experimental', 'Post-Rock', 'Shoegaze', 'Emo'],
    platforms: [
      { label: 'Bandcamp', placeholder: 'bandcamp.com/yourbandname' },
      { label: 'Spotify', placeholder: 'open.spotify.com/artist/...' },
      { label: 'SoundCloud', placeholder: 'soundcloud.com/yourbandname' },
      { label: 'Instagram', placeholder: '@yourbandname' },
    ],
    specialties: ['Original Music', 'Cover Band', 'Touring Act', 'Festival Ready', 'Studio Recording', 'Live Performance', 'Acoustic Sets', 'Full Production'],
    goals: ['Book more live shows', 'Find a venue residency', 'Connect with promoters', 'Record with producers', 'Tour coordination', 'Build local fanbase', 'Find opening slots', 'Network with other bands'],
  },

  solo_artist: {
    id: 'solo_artist',
    label: 'Solo Artist',
    tagline: 'Build your career, book your shows',
    emoji: '🎤',
    color: '#a855f7',
    gradient: 'from-purple-500 to-pink-600',
    genres: ['Pop', 'R&B', 'Soul', 'Hip-Hop', 'Jazz', 'Folk', 'Singer-Songwriter', 'Indie', 'Electronic', 'Alternative', 'Ambient', 'Classical', 'Neo-Soul', 'Afrobeats', 'Latin', 'Country', 'Blues', 'Funk', 'Gospel', 'Spoken Word'],
    platforms: [
      { label: 'Spotify', placeholder: 'open.spotify.com/artist/...' },
      { label: 'Apple Music', placeholder: 'music.apple.com/artist/...' },
      { label: 'SoundCloud', placeholder: 'soundcloud.com/yourname' },
      { label: 'Instagram', placeholder: '@yourname' },
    ],
    specialties: ['Original Music', 'Acoustic Performances', 'Full Band Live Show', 'Backing Track Performance', 'Multi-Instrument', 'Looping', 'Collaborative Writing', 'Touring'],
    goals: ['Get booked at venues', 'Find collaborators', 'Connect with producers', 'Build my network', 'Find management', 'Sync licensing opportunities', 'Press & media', 'Build local following'],
  },

  dj: {
    id: 'dj',
    label: 'DJ',
    tagline: 'Get booked. Build your brand. Own the night.',
    emoji: '🎧',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-orange-600',
    genres: ['Techno', 'House', 'Deep House', 'Tech House', 'Drum & Bass', 'Dubstep', 'Trance', 'Ambient', 'Hip-Hop', 'R&B', 'Afrobeats', 'Jungle', 'Breaks', 'IDM', 'Industrial', 'Dark Electro', 'Minimal', 'Acid', 'UK Garage', 'Disco'],
    platforms: [
      { label: 'Mixcloud', placeholder: 'mixcloud.com/yourname' },
      { label: 'SoundCloud', placeholder: 'soundcloud.com/yourname' },
      { label: 'Beatport', placeholder: 'beatport.com/artist/yourname' },
      { label: 'Instagram', placeholder: '@yourname' },
    ],
    specialties: ['Club Sets', 'Festival Sets', 'Open Format', 'Vinyl Only', 'Live Production', 'B2B Sets', 'Warm-Up', 'Closing Sets', 'All-Night Long', 'Radio Shows', 'Online Streams', 'Corporate Events'],
    goals: ['Get club bookings', 'Build residency', 'Play festivals', 'Connect with promoters', 'Grow my following', 'Find B2B partners', 'Release on labels', 'Build my brand'],
  },

  producer: {
    id: 'producer',
    label: 'Producer',
    tagline: 'Collaborate, create & shape the sound',
    emoji: '🎛️',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-600',
    genres: ['Hip-Hop', 'Trap', 'Electronic', 'R&B', 'Pop', 'Afrobeats', 'Drill', 'House', 'Techno', 'Ambient', 'Jazz', 'Soul', 'Reggae', 'Grime', 'UK Bass', 'Lo-Fi', 'Experimental', 'Orchestral', 'Cinematic', 'World Music'],
    platforms: [
      { label: 'SoundCloud', placeholder: 'soundcloud.com/yourname' },
      { label: 'Spotify', placeholder: 'open.spotify.com/artist/...' },
      { label: 'BeatStars', placeholder: 'beatstars.com/yourname' },
      { label: 'Instagram', placeholder: '@yourname' },
    ],
    specialties: ['Beat Making', 'Full Production', 'Mixing', 'Mastering', 'Sound Design', 'Film Scoring', 'Live Production', 'Sampling', 'Session Musician Coordination', 'A&R', 'Vocal Production', 'Catalog Licensing'],
    goals: ['Find artists to produce', 'Sync licensing', 'Label connections', 'Collaborate with vocalists', 'Score for film/TV', 'Build producer brand', 'Place beats', 'Co-produce records'],
  },

  venue: {
    id: 'venue',
    label: 'Venue',
    tagline: 'Fill your calendar with world-class talent',
    emoji: '🏛️',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    genres: ['All Genres', 'Electronic', 'Hip-Hop', 'Indie/Alt', 'Jazz', 'Rock', 'Pop', 'R&B', 'Country', 'Folk', 'Classical', 'World Music', 'Reggae', 'Metal', 'Experimental', 'Ambient'],
    platforms: [
      { label: 'Website', placeholder: 'yourvenue.com' },
      { label: 'Instagram', placeholder: '@yourvenue' },
      { label: 'Facebook', placeholder: 'facebook.com/yourvenue' },
      { label: 'Resident Advisor', placeholder: 'ra.co/clubs/yourname' },
    ],
    specialties: ['Nightclub', 'Bar With Live Music', 'Concert Hall', 'Theater', 'Outdoor Festival', 'Recording Studio', 'Rehearsal Space', 'Art Gallery', 'Restaurant + Music', 'Private Events', 'Corporate Events'],
    goals: ['Find DJs & performers', 'Build booking pipeline', 'Connect with promoters', 'Fill weekday nights', 'Book genre-specific talent', 'Manage recurring events', 'Source photographers & video', 'Build artist community'],
  },

  promoter: {
    id: 'promoter',
    label: 'Promoter',
    tagline: 'Build events. Move culture. Create moments.',
    emoji: '📢',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    genres: ['Electronic', 'Hip-Hop', 'House', 'Techno', 'R&B', 'Afrobeats', 'Indie', 'Pop', 'Jazz', 'Multi-Genre', 'Emerging Artists', 'Experimental'],
    platforms: [
      { label: 'Instagram', placeholder: '@yourpromotion' },
      { label: 'Resident Advisor', placeholder: 'ra.co/promoters/yourname' },
      { label: 'Facebook', placeholder: 'facebook.com/yourpage' },
      { label: 'Website', placeholder: 'yourevents.com' },
    ],
    specialties: ['Club Nights', 'Festivals', 'Pop-Up Events', 'Warehouse Parties', 'Gallery Events', 'Outdoor Events', 'Charity Events', 'Brand Partnerships', 'Touring Shows', 'Label Nights', 'Residency Programs'],
    goals: ['Find talent for events', 'Partner with venues', 'Build event brand', 'Source photographers/video', 'Connect with booking agents', 'Expand to new cities', 'Sponsorship opportunities', 'Build audience'],
  },

  photographer: {
    id: 'photographer',
    label: 'Photographer',
    tagline: 'Capture the moment. Build your portfolio.',
    emoji: '📸',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    genres: ['Concert Photography', 'Portrait / Press Shots', 'Event Coverage', 'Club Nights', 'Festival', 'Editorial', 'Behind the Scenes', 'Album Artwork', 'Documentary', 'Street / Urban'],
    platforms: [
      { label: 'Instagram', placeholder: '@yourphotography' },
      { label: 'Portfolio', placeholder: 'yourportfolio.com' },
      { label: 'VSCO', placeholder: 'vsco.co/yourname' },
      { label: 'Behance', placeholder: 'behance.net/yourname' },
    ],
    specialties: ['Concert & Live Events', 'Artist Press Shots', 'Album Art Direction', 'Festival Coverage', 'Documentary Style', 'Studio Sessions', 'Nightlife & Club', 'Editorial & Commercial'],
    goals: ['Get event residencies', 'Find artists to shoot', 'Connect with venues', 'Book with labels', 'Build my portfolio', 'Get press credentials', 'Commercial clients', 'License my work'],
  },

  videographer: {
    id: 'videographer',
    label: 'Videographer',
    tagline: 'Tell stories. Build your reel.',
    emoji: '🎬',
    color: '#f97316',
    gradient: 'from-orange-500 to-red-600',
    genres: ['Music Videos', 'Live Performance Capture', 'Documentary', 'Short Film', 'Event Coverage', 'Social Media Content', 'Tour Films', 'Studio Sessions', 'Lyric Videos', 'Visualizers'],
    platforms: [
      { label: 'YouTube', placeholder: 'youtube.com/@yourname' },
      { label: 'Instagram', placeholder: '@yourwork' },
      { label: 'Vimeo', placeholder: 'vimeo.com/yourname' },
      { label: 'Portfolio', placeholder: 'yourportfolio.com' },
    ],
    specialties: ['Music Video Direction', 'Live Show Filming', 'Documentary', 'Social Media Content', 'Event Coverage', 'Drone Footage', 'Color Grading', 'Motion Graphics', 'Studio Sessions', 'Tour Films'],
    goals: ['Direct music videos', 'Event residencies', 'Build my reel', 'Connect with artists', 'Find venue clients', 'Label projects', 'Festival coverage', 'Long-form documentary'],
  },

  visual_artist: {
    id: 'visual_artist',
    label: 'Visual Artist',
    tagline: 'Create the world behind the music',
    emoji: '🎨',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
    genres: ['Album Artwork', 'Poster Design', 'Merch Design', 'Stage Design', 'Projection Art', 'Illustration', 'Typography', 'Motion Graphics', 'Installation Art', 'NFT/Digital Art'],
    platforms: [
      { label: 'Instagram', placeholder: '@yourartwork' },
      { label: 'Portfolio', placeholder: 'yourportfolio.com' },
      { label: 'Behance', placeholder: 'behance.net/yourname' },
      { label: 'Society6', placeholder: 'society6.com/yourname' },
    ],
    specialties: ['Album Art & Cover Design', 'Poster & Flyer Design', 'Merch Design', 'Stage Visuals & Projection', 'Brand Identity', 'Illustration', 'Motion Graphics', 'Installation Art', 'Tour Merchandise', 'Social Media Assets'],
    goals: ['Design album artwork', 'Create event visuals', 'Partner with artists', 'Build my client base', 'Licensing opportunities', 'Gallery exhibitions', 'Merchandise collabs', 'Label commissions'],
  },

  lighting_designer: {
    id: 'lighting_designer',
    label: 'Lighting Designer',
    tagline: 'Paint the stage with light',
    emoji: '💡',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-600',
    genres: ['Club Nights', 'Concerts', 'Festivals', 'Theater', 'Corporate Events', 'Immersive Experiences', 'Gallery Events', 'Outdoor Events'],
    platforms: [
      { label: 'Portfolio', placeholder: 'yourportfolio.com' },
      { label: 'Instagram', placeholder: '@yourlighting' },
      { label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname' },
      { label: 'Vimeo', placeholder: 'vimeo.com/showreel' },
    ],
    specialties: ['Club & Nightclub', 'Concert Touring', 'Festival Stages', 'Theater Production', 'Architectural Lighting', 'LED & Video Walls', 'Laser Systems', 'Intelligent Lighting', 'Immersive Installations', 'Atmosphere & Ambience'],
    goals: ['Get booked for shows', 'Venue partnerships', 'Tour work', 'Festival contracts', 'Build my portfolio', 'Connect with production', 'Corporate events', 'Build creative team'],
  },

  sound_engineer: {
    id: 'sound_engineer',
    label: 'Sound Engineer',
    tagline: 'Make every show sound perfect',
    emoji: '🔊',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600',
    genres: ['Live Sound', 'Studio Recording', 'Mixing', 'Mastering', 'Electronic Events', 'Acoustic Sets', 'Large Venue', 'Small Venue', 'Festival'],
    platforms: [
      { label: 'Portfolio', placeholder: 'yourportfolio.com' },
      { label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname' },
      { label: 'SoundCloud', placeholder: 'soundcloud.com/yourname' },
      { label: 'Instagram', placeholder: '@yourname' },
    ],
    specialties: ['Front of House (FOH)', 'Monitor Engineering', 'Studio Recording', 'Mixing', 'Mastering', 'Live Stream Audio', 'System Design', 'Broadcast Audio', 'Post Production', 'Acoustic Consultation'],
    goals: ['Find touring gigs', 'Venue residencies', 'Studio sessions', 'Connect with artists', 'Tour with bands', 'Festival work', 'Remote mixing clients', 'Build my client list'],
  },

  booking_agent: {
    id: 'booking_agent',
    label: 'Booking Agent',
    tagline: 'Connect talent with opportunity',
    emoji: '🤝',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    genres: ['All Genres', 'Electronic', 'Hip-Hop', 'Indie', 'Pop', 'Jazz', 'R&B', 'Rock', 'Country', 'Folk', 'World Music', 'Emerging Artists'],
    platforms: [
      { label: 'Agency Website', placeholder: 'youragency.com' },
      { label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname' },
      { label: 'Instagram', placeholder: '@youragency' },
      { label: 'Website', placeholder: 'yourpersonalsite.com' },
    ],
    specialties: ['Club & Venue Booking', 'Festival Placement', 'Tour Management', 'Contract Negotiation', 'International Booking', 'Emerging Artists', 'Established Acts', 'Corporate Events', 'Private Events', 'Brand Partnerships'],
    goals: ['Find new talent', 'Connect with venues', 'Build venue relationships', 'Festival relationships', 'Expand artist roster', 'New market development', 'Brand partnership deals', 'Build my network'],
  },
};

export const ALL_ROLES: RoleId[] = [
  'band', 'solo_artist', 'dj', 'producer', 'venue', 'promoter',
  'photographer', 'videographer', 'visual_artist', 'lighting_designer',
  'sound_engineer', 'booking_agent',
];
