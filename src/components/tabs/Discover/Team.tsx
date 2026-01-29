"use client";

const Team = () => {
  return (
    <section 
      id="team-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgb(10, 10, 10) 50%, rgb(20, 20, 20) 100%)',
        minHeight: '100vh',
        paddingTop: '10vh',
        paddingBottom: '10vh',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Section Title */}
      <div className="relative z-10 w-full">
        {/* Top dashed border - full width */}
        <div className="w-full h-px border-t border-dashed border-white/30" />
        
        {/* Title without side lines */}
        <div className="text-center py-8">
          <h2 className="text-sm lg:text-base text-gray-300 uppercase tracking-[0.25em] font-bold">
            Our Team
          </h2>
        </div>
      </div>

      {/* Team Content */}
      <div className="relative z-10 container mx-auto px-8 lg:px-20">
        <div className="text-center mb-12">
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the talented individuals driving our mission forward
          </p>
        </div>

        {/* Team Grid - Add your team members here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team member cards will go here */}
          {/* Example structure:
          <div className="relative group">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
              // Team member content
            </div>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default Team;