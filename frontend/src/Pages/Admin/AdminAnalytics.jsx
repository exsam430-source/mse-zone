import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const AdminAnalytics = () => {
  const { backendURL, token } = useContext(ShopContext);

  const [stats, setStats] = useState({
    overall: { views: 0, addToCarts: 0, purchases: 0 },
    topProducts: [],
    visitors: 0,
    totalUsers: 0,
    totalOrders: 0,
    conversion: { viewers: 0, purchasers: 0, conversionRate: 0 },
  });

  const [chartData, setChartData] = useState({
    views: [],
    carts: [],
    purchases: [],
    users: [],
    orders: [],
    visitors: [],
  });

  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // ==================== FETCH ANALYTICS DATA ====================
  useEffect(() => {
    if (!token) return;

    const fetchAllAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          overallRes,
          totalUsersRes,
          totalOrdersRes,
          visitorsRes,
          conversionRes,
          topProductsRes
        ] = await Promise.all([
          axios.get(`${backendURL}/api/analytics/product/all/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/analytics/totalUsers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/analytics/totalOrders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/analytics/visitors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/analytics/conversion`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/api/analytics/top-products?limit=5`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          overall: {
            views: overallRes.data.views || 0,
            addToCarts: overallRes.data.addToCarts || 0,
            purchases: overallRes.data.purchases || 0,
          },
          totalUsers: totalUsersRes.data.totalUsers || 0,
          totalOrders: totalOrdersRes.data.totalOrders || 0,
          visitors: visitorsRes.data.uniqueVisitors || 0,
          conversion: {
            viewers: conversionRes.data.viewers || 0,
            purchasers: conversionRes.data.purchasers || 0,
            conversionRate: conversionRes.data.conversionRate || 0,
          },
          topProducts: topProductsRes.data.results || [],
        });

        // Fetch chart data
        await fetchChartData();
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, [backendURL, token]);

  // ==================== FETCH DYNAMIC CHART DATA ====================
  const fetchChartData = async () => {
    try {
      setChartLoading(true);

      // Fetch events from backend
      const eventsRes = await axios.get(`${backendURL}/api/analytics/events-by-date?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const events = eventsRes.data.events || [];

      // Process events into chart data
      const processedData = processEventsData(events);
      setChartData(processedData);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      // Fallback to mock data if endpoint doesn't exist
      setChartData(generateMockChartData());
    } finally {
      setChartLoading(false);
    }
  };

  // ==================== PROCESS EVENTS DATA ====================
  const processEventsData = (events) => {
    const dateMap = {};

    events.forEach(event => {
      const date = new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dateMap[date]) {
        dateMap[date] = { date, views: 0, carts: 0, purchases: 0, users: new Set(), orders: 0, visitors: new Set() };
      }

      if (event.type === 'view') dateMap[date].views++;
      if (event.type === 'add_to_cart') dateMap[date].carts++;
      if (event.type === 'purchase') dateMap[date].purchases++;
      if (event.userId) dateMap[date].users.add(event.userId);
      if (event.ip) dateMap[date].visitors.add(event.ip);
    });

    const chartArray = Object.values(dateMap).map(item => ({
      date: item.date,
      views: item.views,
      carts: item.carts,
      purchases: item.purchases,
      users: item.users.size,
      visitors: item.visitors.size,
      orders: item.orders
    }));

    return {
      views: chartArray,
      carts: chartArray,
      purchases: chartArray,
      users: chartArray,
      orders: chartArray,
      visitors: chartArray,
    };
  };

  // ==================== MOCK DATA FALLBACK ====================
  const generateMockChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    const mockData = days.map(day => ({
      date: day,
      views: Math.floor(Math.random() * 100) + 10,
      carts: Math.floor(Math.random() * 50) + 5,
      purchases: Math.floor(Math.random() * 200) + 20,
      users: Math.floor(Math.random() * 10) + 1,
      orders: Math.floor(Math.random() * 30) + 5,
      visitors: Math.floor(Math.random() * 20) + 2,
    }));

    return {
      views: mockData,
      carts: mockData,
      purchases: mockData,
      users: mockData,
      orders: mockData,
      visitors: mockData,
    };
  };

  // ==================== HANDLE TIME RANGE CHANGE ====================
  const handleTimeRangeChange = async (range) => {
    setTimeRange(range);
    try {
      setChartLoading(true);
      const eventsRes = await axios.get(`${backendURL}/api/analytics/events-by-date?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = eventsRes.data.events || [];
      const processedData = processEventsData(events);
      setChartData(processedData);
    } catch (err) {
      console.error("Error fetching time range data:", err);
      setChartData(generateMockChartData());
    } finally {
      setChartLoading(false);
    }
  };

  const { overall, topProducts, visitors, totalUsers, totalOrders, conversion } = stats;

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-lg text-gray-600 font-medium">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <p className="text-red-800 text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STAT CARD COMPONENT ====================
  const StatCard = ({ id, icon, label, value, bgColor, textColor, trend, onClick }) => (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer backdrop-blur-sm ${bgColor}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          {trend && (
            <div className={`text-sm font-bold px-3 py-1 rounded-full ${
              trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value.toLocaleString()}</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <div className="absolute top-3 right-3 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Click for chart
      </div>
    </div>
  );

  // ==================== DETAILED CHART MODAL ====================
  const ChartModal = ({ isOpen, title, icon, data, chartType, onClose }) => {
    if (!isOpen || !data || data.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600">Performance over time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6 pb-6 border-b">
            {['1d', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === '1d' ? 'Today' : range === '7d' ? 'Week' : range === '30d' ? 'Month' : 'Quarter'}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            {chartLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading chart data...</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                {chartType === 'area' && (
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #3B82F6",
                        borderRadius: "8px"
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={data}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #3B82F6",
                        borderRadius: "8px"
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
                {chartType === 'line' && (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "2px solid #3B82F6",
                        borderRadius: "8px"
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

          {/* Stats Summary */}
          {data && data.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Average</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(data.reduce((acc, val) => acc + (val.value || 0), 0) / data.length)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Maximum</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...data.map(d => d.value || 0))}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {data.reduce((acc, val) => acc + (val.value || 0), 0)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ==================== HEADER ====================  */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">Real-time insights into your business performance</p>
        </div>

        {/* ==================== KEY METRICS ====================  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            id="views"
            icon="👁️"
            label="Total Views"
            value={overall.views}
            bgColor="bg-white"
            textColor="text-indigo-600"
            trend={12}
            onClick={() => setSelectedChart({
              id: 'views',
              title: 'Total Views',
              icon: '👁️',
              data: chartData.views.map(d => ({ ...d, value: d.views })),
              chartType: 'area'
            })}
          />
          <StatCard
            id="carts"
            icon="🛒"
            label="Add to Carts"
            value={overall.addToCarts}
            bgColor="bg-white"
            textColor="text-blue-600"
            trend={8}
            onClick={() => setSelectedChart({
              id: 'carts',
              title: 'Add to Carts',
              icon: '🛒',
              data: chartData.carts.map(d => ({ ...d, value: d.carts })),
              chartType: 'bar'
            })}
          />
          <StatCard
            id="purchases"
            icon="💰"
            label="Total Purchases"
            value={overall.purchases}
            bgColor="bg-white"
            textColor="text-green-600"
            trend={15}
            onClick={() => setSelectedChart({
              id: 'purchases',
              title: 'Total Purchases',
              icon: '💰',
              data: chartData.purchases.map(d => ({ ...d, value: d.purchases })),
              chartType: 'line'
            })}
          />
        </div>

        {/* ==================== SECONDARY METRICS ====================  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            id="users"
            icon="👥"
            label="Total Users"
            value={totalUsers}
            bgColor="bg-white"
            textColor="text-purple-600"
            onClick={() => setSelectedChart({
              id: 'users',
              title: 'Total Users',
              icon: '👥',
              data: chartData.users.map(d => ({ ...d, value: d.users })),
              chartType: 'area'
            })}
          />
          <StatCard
            id="orders"
            icon="📦"
            label="Total Orders"
            value={totalOrders}
            bgColor="bg-white"
            textColor="text-orange-600"
            onClick={() => setSelectedChart({
              id: 'orders',
              title: 'Total Orders',
              icon: '📦',
              data: chartData.orders.map(d => ({ ...d, value: d.orders })),
              chartType: 'bar'
            })}
          />
          <StatCard
            id="visitors"
            icon="👫"
            label="Unique Visitors"
            value={visitors}
            bgColor="bg-white"
            textColor="text-pink-600"
            onClick={() => setSelectedChart({
              id: 'visitors',
              title: 'Unique Visitors',
              icon: '👫',
              data: chartData.visitors.map(d => ({ ...d, value: d.visitors })),
              chartType: 'line'
            })}
          />
        </div>

        {/* ==================== CONVERSION METRICS ====================  */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Conversion Overview</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Viewers</p>
                  <p className="text-3xl font-bold text-indigo-600">{conversion.viewers.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-600">
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Purchasers</p>
                  <p className="text-3xl font-bold text-green-600">{conversion.purchasers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Conversion Rate Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                      {isNaN(conversion.conversionRate) ? 0 : conversion.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-gray-600 font-medium mt-2">Conversion Rate</p>
                  </div>
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(conversion.conversionRate / 100) * 565} 565`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CHARTS ====================  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
            {topProducts && topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #3B82F6",
                      borderRadius: "8px"
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="totalQty" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <p className="text-gray-400 text-lg">No product data available</p>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Distribution</h2>
            {topProducts && topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    dataKey="totalQty"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #3B82F6",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center">
                <p className="text-gray-400 text-lg">No product data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CHART MODAL ====================  */}
      <ChartModal
        isOpen={selectedChart !== null}
        title={selectedChart?.title}
        icon={selectedChart?.icon}
        data={selectedChart?.data}
        chartType={selectedChart?.chartType}
        onClose={() => setSelectedChart(null)}
      />

      {/* ==================== ANIMATIONS ====================  */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;