import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
                <span className="text-dark-900 font-bold text-sm font-display">TB</span>
              </div>
              <span className="text-gold-400 font-display font-semibold">Trust Built</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              PR & Digital Solutions. Building Trust. Driving Growth. Rewa & Bangalore.
            </p>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {['/', '/services', '/contact'].map((to, i) => (
                <Link key={to} to={to} className="block text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  {['Home', 'Services', 'Contact'][i]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              {['Public Relations','Social Media','Meta & Google Ads','Branding & Video'].map(s => (
                <div key={s} className="hover:text-gold-400 transition-colors cursor-default">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-gold-400 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div>+91 70675 70038</div>
              <div>trustbuilt2026@gmail.com</div>
              <div>Rewa, Madhya Pradesh &<br/>Bangalore, Karnataka</div>
            </div>
          </div>
        </div>
        <div className="shimmer-line mb-6" />
        <p className="text-center text-gray-600 text-sm">
          © 2024 Trust Built PR & Digital Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
