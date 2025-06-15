import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <div className="bg-indigo-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white">
          Ready to swap skills and grow together?
        </h2>
        <p className="mt-4 text-lg text-indigo-200">
          Join our community today and start collaborating with talented individuals.
        </p>
        <div className="mt-6">
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}