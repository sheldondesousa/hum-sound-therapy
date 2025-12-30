import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Container with Border - iPhone 16 Pro Max dimensions */}
      <div className="relative w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden flex flex-col py-8" style={{ maxWidth: '430px', minHeight: '932px' }}>

      {/* Header */}
      <div className="px-6 py-3 flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-base">Logout</span>
        </button>

        <button className="flex items-center gap-2 border-2 border-black rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors">
          <div className="w-5 h-5 bg-black rounded-full"></div>
          <span className="font-medium text-base">Light</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-5xl font-semibold text-black mb-8">
          Choose your path
        </h1>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-0"></div>

        {/* Options List */}
        <div className="space-y-0">
          {/* Focus */}
          <button
            onClick={() => navigate('/exercise/focus')}
            className="w-full py-5 flex items-center gap-3 border-b border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <circle cx="40" cy="40" r="12" fill="black"/>
                <path d="M40 8 C40 8, 25 25, 25 40 C25 55, 40 72, 40 72 C40 72, 55 55, 55 40 C55 25, 40 8, 40 8" fill="none" stroke="black" strokeWidth="3"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-4xl font-semibold text-black mb-0.5" style={{ fontFamily: 'Roboto Serif, serif' }}>Focus</h2>
              <p className="text-xl text-black">Enhance concentration</p>
            </div>
            <svg className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Calm */}
          <button
            onClick={() => navigate('/exercise/calm')}
            className="w-full py-5 flex items-center gap-3 border-b border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <path d="M20 50 Q20 30, 30 25 Q35 22, 40 30 Q45 22, 50 25 Q60 30, 60 50" fill="black"/>
                <path d="M25 60 Q25 45, 32 42 Q36 40, 40 46 Q44 40, 48 42 Q55 45, 55 60" fill="black"/>
                <path d="M30 70 Q30 58, 36 56 Q39 55, 40 59 Q41 55, 44 56 Q50 58, 50 70" fill="black"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-4xl font-semibold text-black mb-0.5" style={{ fontFamily: 'Roboto Serif, serif' }}>Calm</h2>
              <p className="text-xl text-black">Relax and rejuvenate</p>
            </div>
            <svg className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Breathe */}
          <button
            onClick={() => navigate('/exercise/breathe')}
            className="w-full py-5 flex items-center gap-3 border-b border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <circle cx="40" cy="40" r="3" fill="black"/>
                {/* Radiating lines */}
                <line x1="40" y1="10" x2="40" y2="25" stroke="black" strokeWidth="2.5"/>
                <line x1="40" y1="70" x2="40" y2="55" stroke="black" strokeWidth="2.5"/>
                <line x1="10" y1="40" x2="25" y2="40" stroke="black" strokeWidth="2.5"/>
                <line x1="70" y1="40" x2="55" y2="40" stroke="black" strokeWidth="2.5"/>
                <line x1="18" y1="18" x2="28" y2="28" stroke="black" strokeWidth="2.5"/>
                <line x1="62" y1="62" x2="52" y2="52" stroke="black" strokeWidth="2.5"/>
                <line x1="62" y1="18" x2="52" y2="28" stroke="black" strokeWidth="2.5"/>
                <line x1="18" y1="62" x2="28" y2="52" stroke="black" strokeWidth="2.5"/>
                <line x1="40" y1="15" x2="40" y2="20" stroke="black" strokeWidth="2"/>
                <line x1="40" y1="65" x2="40" y2="60" stroke="black" strokeWidth="2"/>
                <line x1="15" y1="40" x2="20" y2="40" stroke="black" strokeWidth="2"/>
                <line x1="65" y1="40" x2="60" y2="40" stroke="black" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-4xl font-semibold text-black mb-0.5" style={{ fontFamily: 'Roboto Serif, serif' }}>Breathe</h2>
              <p className="text-xl text-black">Enter a rhythm</p>
            </div>
            <svg className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Meditate */}
          <button
            onClick={() => navigate('/exercise/meditate')}
            className="w-full py-5 flex items-center gap-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 80 80" fill="black">
                <path d="M30 20 L50 20 L50 35 L30 35 Z" fill="black"/>
                <path d="M30 45 L50 45 L50 60 L30 60 Z" fill="black"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-4xl font-semibold text-black mb-0.5" style={{ fontFamily: 'Roboto Serif, serif' }}>Meditate</h2>
              <p className="text-xl text-black">Find inner peace</p>
            </div>
            <svg className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="mt-auto pt-8 flex justify-center">
        <button className="flex flex-col items-center gap-1 text-black hover:opacity-70 transition-opacity">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
          </svg>
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
      </div>
    </div>
  );
}
