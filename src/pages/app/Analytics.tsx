export default function Analytics() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-400">Chart placeholder - Integrate your favorite charting library</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-3">
            {['Direct', 'Organic Search', 'Social Media', 'Referral'].map((source, index) => (
              <div key={source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{source}</span>
                  <span className="text-sm font-medium text-gray-900">{45 - index * 10}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${45 - index * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Pages</h2>
          <div className="space-y-4">
            {['/home', '/products', '/about', '/contact'].map((page) => (
              <div key={page} className="flex items-center justify-between">
                <span className="text-sm text-gray-900 font-medium">{page}</span>
                <span className="text-sm text-gray-500">1,234 views</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
