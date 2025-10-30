"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, MousePointer, Eye } from "lucide-react";
import { format, subDays } from "date-fns";
import { useTranslations } from 'next-intl';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalEvents: number;
  pageStats: Array<{
    url: string;
    title: string;
    views: number;
    clicks: number;
  }>;
  recentEvents: Array<any>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tc = useTranslations('common');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const startDate = subDays(new Date(), dateRange).toISOString();
    const endDate = new Date().toISOString();

    const response = await fetch(
      `/api/events?startDate=${startDate}&endDate=${endDate}`
    );
    const analyticsData = await response.json();
    setData(analyticsData);
    setLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{tc('loading')}</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const topPages = data?.pageStats?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>

        <div className="mb-6">
          <label className="mr-2 dark:text-white">{t('dateRange')}</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value={1}>{t('last24Hours')}</option>
            <option value={7}>{t('last7Days')}</option>
            <option value={30}>{t('last30Days')}</option>
            <option value={90}>{t('last90Days')}</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 dark:text-gray-400">{t('totalViews')}</h3>
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold dark:text-white">{data?.totalViews || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 dark:text-gray-400">{t('uniqueVisitors')}</h3>
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold dark:text-white">{data?.uniqueVisitors || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 dark:text-gray-400">{t('totalEvents')}</h3>
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold dark:text-white">{data?.totalEvents || 0}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 dark:text-gray-400">{t('avgPerDay')}</h3>
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold dark:text-white">
              {data ? Math.round(data.totalEvents / dateRange) : 0}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('topPages')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 dark:text-white">{t('page')}</th>
                  <th className="text-right py-2 dark:text-white">{t('views')}</th>
                  <th className="text-right py-2 dark:text-white">{t('clicks')}</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page: any, index: number) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-2 dark:text-gray-300">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.url}</div>
                    </td>
                    <td className="text-right dark:text-gray-300">{page.views}</td>
                    <td className="text-right dark:text-gray-300">{page.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {topPages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('pageViewsChart')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPages.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
