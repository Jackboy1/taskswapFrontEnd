// components/TrustBadges.jsx
export default function TrustBadges() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 mb-6">Trusted by teams at</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          <span className="text-2xl font-bold text-gray-700">Forbes</span>
          <span className="text-2xl font-bold text-gray-700">TechCrunch</span>
          <span className="text-2xl font-bold text-gray-700">YCombinator</span>
        </div>
      </div>
    </section>
  );
}