// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} ProjectApp. All rights reserved.</p>
        <p className="text-sm mt-2">Built with NestJS and Next.js</p>
      </div>
    </footer>
  );
};

export default Footer;
