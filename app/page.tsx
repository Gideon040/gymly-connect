import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GymlyConnect</h1>
          <p className="text-gray-500 mb-8">WhatsApp Automations voor Sportscholen</p>

          <div className="space-y-3">
            <Link
              href="/proefles"
              className="block w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all"
            >
              Gym Dashboard
            </Link>
            
            <Link
              href="/admin"
              className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Super Admin
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            © 2024 GymlyConnect
          </p>
        </div>
      </div>
    </div>
  );
}