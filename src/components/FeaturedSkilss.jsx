const skills = [
  { name: 'Web Development', icon: '💻' },
  { name: 'Graphic Design', icon: '🎨' },
  { name: 'Language Tutoring', icon: '🗣️' },
  { name: 'Home Repair', icon: '🛠️' }
];

export default function FeaturedSkills() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Popular Skills</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill, i) => (
          <div
            key={i}
            className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm border hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
          >
            <span className="mr-2 text-xl">{skill.icon}</span>
            <span className="text-sm font-medium">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}