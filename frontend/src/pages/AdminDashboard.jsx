import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import KpiCard from '../components/KpiCard';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, appointmentApi } from '../api';
import {
    HiOutlineUserGroup,
    HiOutlineHeart,
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineExclamation,
} from 'react-icons/hi';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell,
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#22c55e'];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [apptStats, setApptStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [dashRes, apptRes] = await Promise.all([
                dashboardApi.getStats(user.cid),
                appointmentApi.getStats(user.cid),
            ]);
            setStats(dashRes.data.data);
            setApptStats(apptRes.data.data);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout title="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </Layout>
        );
    }

    const barData = [
        { name: 'Patients', value: stats?.totalPatients || 0 },
        { name: 'Doctors', value: stats?.totalDoctors || 0 },
        { name: 'Appointments', value: apptStats?.totalAppointments || 0 },
        { name: 'Low Stock', value: stats?.lowStockMedicines || 0 },
    ];

    const pieData = [
        { name: 'Patients', value: stats?.totalPatients || 1 },
        { name: 'Doctors', value: stats?.totalDoctors || 1 },
        { name: 'Staff', value: 3 },
    ];

    return (
        <Layout title={user?.role === 'SUPER_ADMIN' ? 'Global Dashboard' : 'Dashboard'}>
            {/* Welcome banner */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-theme-primary/20 to-accent-600/20 border border-theme-primary/20">
                <h3 className="text-xl font-semibold text-theme-text">
                    Welcome back, {user?.fullName} 👋
                </h3>
                <p className="text-theme-secondary mt-1">
                    {user?.role === 'SUPER_ADMIN'
                        ? 'System-wide overview across all hospitals'
                        : <>Here's the overview for <span className="text-theme-primary font-medium">{user?.cid}</span></>
                    }
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <KpiCard
                    title="Total Patients"
                    value={stats?.totalPatients || 0}
                    icon={HiOutlineUserGroup}
                    color="primary"
                />
                <KpiCard
                    title="Total Doctors"
                    value={stats?.totalDoctors || 0}
                    icon={HiOutlineHeart}
                    color="accent"
                />
                <KpiCard
                    title="Appointments"
                    value={apptStats?.totalAppointments || 0}
                    icon={HiOutlineCalendar}
                    color="emerald"
                />
                <KpiCard
                    title="Today's Appts"
                    value={apptStats?.todaysAppointments || 0}
                    icon={HiOutlineClock}
                    color="amber"
                />
                <KpiCard
                    title="Low Stock Meds"
                    value={stats?.lowStockMedicines || 0}
                    icon={HiOutlineExclamation}
                    color="rose"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="glass rounded-2xl p-6">
                    <h4 className="text-sm font-semibold text-theme-secondary mb-4">Overview Statistics</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {barData.map((_, idx) => (
                                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="glass rounded-2xl p-6">
                    <h4 className="text-sm font-semibold text-theme-secondary mb-4">Staff Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((_, idx) => (
                                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
}
