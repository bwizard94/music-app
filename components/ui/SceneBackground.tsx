'use client';

interface SceneBackgroundProps {
  accentColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export default function SceneBackground({
  accentColor = '#a855f7',
  intensity = 'medium',
}: SceneBackgroundProps) {
  const opacityMap = { low: 0.08, medium: 0.14, high: 0.22 };
  const op = opacityMap[intensity];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-[#060608]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Accent orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[120px] transition-all duration-1000"
        style={{ backgroundColor: accentColor, opacity: op * 0.7 }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000"
        style={{ backgroundColor: accentColor, opacity: op * 0.5 }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000"
        style={{ backgroundColor: accentColor, opacity: op * 0.3 }}
      />

      {/* Noise vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-[#060608]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/40 via-transparent to-[#060608]/40" />
    </div>
  );
}
