export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">

      {/* ================= BACKGROUND VIDEO ================= */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/combined.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ================= GRADIENT OVERLAY ================= */}
      <div className="absolute inset-0 bg-gradient-to-b 
                      from-black/60 via-emerald-900/50 to-green-900/70">
      </div>

      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Discover Authentic Home-style Recipes
        </h2>

        <p className="text-white/90 text-lg mb-8 drop-shadow-md">
          Explore delicious South Indian dishes made with love and tradition.
        </p>

        <a
          href="/recipes"
          className="inline-block bg-emerald-600 text-white 
                     px-8 py-3 rounded-full font-semibold
                     hover:bg-emerald-700 transition shadow-lg"
        >
          Explore Recipes
        </a>
      </div>
    </section>
  );
}
