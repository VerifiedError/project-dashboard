/**
 * FILE-REF: PAGE-002-20251128
 *
 * @file page.tsx
 * @description Dashboard home page (temporary landing page)
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial homepage placeholder (CHG-001)
 *
 * @see Related files:
 * - PAGE-000 (layout.tsx)
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold text-primary-900 mb-4">
          DevOps Resource Dashboard
        </h1>
        <p className="text-xl text-primary-700 mb-8">
          Centralized monitoring for all your development resources
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-primary-200">
            <div className="text-3xl mb-2">🔗</div>
            <h3 className="font-semibold text-primary-900">ngrok</h3>
            <p className="text-sm text-primary-600 mt-1">Tunnel Monitoring</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-primary-200">
            <div className="text-3xl mb-2">▲</div>
            <h3 className="font-semibold text-primary-900">Vercel</h3>
            <p className="text-sm text-primary-600 mt-1">Deployment Tracking</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-primary-200">
            <div className="text-3xl mb-2">🗄️</div>
            <h3 className="font-semibold text-primary-900">Neon</h3>
            <p className="text-sm text-primary-600 mt-1">Database Management</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-primary-200">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-primary-900">Upstash</h3>
            <p className="text-sm text-primary-600 mt-1">Redis & Kafka</p>
          </div>
        </div>

        <div className="mt-12 text-sm text-primary-600">
          <p>Phase 1: Foundation Setup - In Progress</p>
          <p className="mt-2">Setting up infrastructure...</p>
        </div>
      </div>
    </main>
  );
}
