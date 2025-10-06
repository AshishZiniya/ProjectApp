// components/Footer.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="glass mt-16 border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gradient">
              ProjectApp
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Streamline your project management and boost team productivity
              with our comprehensive task management solution.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/projects"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Users
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} ProjectApp. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with ❤️ using NestJS, Next.js, and Yarn
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
