export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Graphic Designer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'TaskSwap helped me exchange my design skills for coding lessons. Amazing platform!',
    },
    {
      name: 'James K.',
      role: 'Carpenter',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'I found someone to teach me Spanish while I helped with home repairs. Highly recommend!',
    },
    {
      name: 'Emily R.',
      role: 'Language Tutor',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      quote: 'The community is so supportive, and I’ve learned new skills while teaching others.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}