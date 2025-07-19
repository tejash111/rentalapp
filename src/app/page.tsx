import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen px-4 sm:px-10 py-12 font-sans bg-white text-neutral-900 mt-20">
      {/* Hero Section */}
      <section className="grid sm:grid-cols-3 gap-6 mb-20">
        <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Rent gadgets for every need</h2>
          <button className="text-sm text-white bg-neutral-900 px-4 py-2 rounded hover:bg-black transition">Explore Now</button>
        </div>
        <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-6">
          <p className="text-lg mb-4">Top-rated PS5 & gaming consoles</p>
          <button className="text-sm text-white bg-neutral-900 px-4 py-2 rounded hover:bg-black transition">Rent Now</button>
        </div>
        <div className="bg-neutral-900 text-white rounded-xl p-6 relative">
          <span className="absolute top-2 left-2 bg-green-500 text-xs px-2 py-0.5 rounded-full">Limited Offer</span>
          <p className="text-lg mb-4">Cycles & Cameras starting ₹99/day</p>
          <button className="text-sm bg-white text-black px-4 py-2 rounded hover:bg-neutral-100 transition">Get Started</button>
        </div>
      </section>

      {/* New and Noteworthy */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-8">New and noteworthy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {['camera', 'ps5', 'cycle', 'calculator'].map((item, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
              <Image src={`/${item}.png`} width={400} height={400} alt={item} className="w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Rental Categories */}
      <section className="grid sm:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-3xl font-semibold mb-6">Rent anything in minutes</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Cameras", "Gaming Consoles", "Cycles", "Electronics", "Study Tools", "Accessories"].map((cat, i) => (
              <button
                key={i}
                className="w-full text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 rounded border border-neutral-200 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {["cycle", "camera", "ps5", "calculator"].map((item, i) => (
            <Image
              key={i}
              src={`/${item}.png`}
              width={500}
              height={500}
              alt={item}
              className="rounded-xl border border-neutral-200 bg-neutral-50 object-cover"
            />
          ))}
        </div>
      </section>
    </div>
  );
}