export default function HowItWorks() {
  const steps = [
    {
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Browse Tasks',
      desc: 'Explore a variety of skills and tasks offered by our community.',
    },
    {
      image: 'https://media.istockphoto.com/id/1916729901/photo/meeting-success-two-business-persons-shaking-hands-standing-outside.jpg?s=612x612&w=is&k=20&c=yWGwJHc0PwTU3yIwoaPgGyDI2o5cJfxwvbXycVbhqYA=&auto=format&fit=crop&w=300&q=80',
      title: 'Propose Swap',
      desc: 'Offer your skills in exchange for what you need.',
    },
    {
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      title: 'Chat & Agree',
      desc: 'Negotiate terms securely and finalize your swap.',
    },
  ];

  return (
    <section className=" pt-16 pb-9 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          How TaskSwap Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}