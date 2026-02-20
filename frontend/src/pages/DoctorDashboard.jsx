import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import KpiCard from '../components/KpiCard';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import { appointmentApi } from '../api';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineCheck } from 'react-icons/hi';

export default function DoctorDashboard() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await appointmentApi.getByCid(user.cid);
            setAppointments(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await appointmentApi.updateStatus(id, status);
            loadData();
        } catch { alert('Failed'); }
    };

    const booked = appointments.filter(a => a.status === 'BOOKED').length;
    const completed = appointments.filter(a => a.status === 'COMPLETED').length;

    const statusBadge = (status) => {
        const styles = {
            BOOKED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return <span className={`text-xs px-2.5 py-1 rounded-full border ${styles[status]}`}>{status}</span>;
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'patientName', label: 'Patient' },
        { key: 'dateTime', label: 'Date/Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
        { key: 'status', label: 'Status', render: (v) => statusBadge(v) },
        { key: 'notes', label: 'Notes', render: (v) => v || '-' },
        {
            key: '_actions', label: 'Action',
            render: (_, row) => row.status === 'BOOKED' ? (
                <button onClick={() => handleStatusChange(row.id, 'COMPLETED')}
                    className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all">
                    Mark Complete
                </button>
            ) : null,
        },
    ];

    if (loading) {
        return <Layout title="Doctor Dashboard"><div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div></Layout>;
    }

    return (
        <Layout title="Doctor Dashboard">
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent-600/20 to-primary-600/20 border border-accent-500/20">
                <h3 className="text-xl font-semibold text-gray-100">Welcome, {user?.fullName} 🩺</h3>
                <p className="text-gray-400 mt-1">Here are your appointments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <KpiCard title="Total Appointments" value={appointments.length} icon={HiOutlineCalendar} color="primary" />
                <KpiCard title="Upcoming" value={booked} icon={HiOutlineClock} color="amber" />
                <KpiCard title="Completed" value={completed} icon={HiOutlineCheck} color="emerald" />
            </div>

            <DataTable columns={columns} data={appointments} searchField="patientName" />
        </Layout>
    );
}
