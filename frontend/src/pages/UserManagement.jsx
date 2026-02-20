import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { authApi, hospitalApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { username: '', password: '', fullName: '', role: '', cid: '' };

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [userRes, hospRes] = await Promise.all([
                authApi.getUsers(),
                currentUser.role === 'SUPER_ADMIN' ? hospitalApi.getAll() : Promise.resolve({ data: { data: [] } })
            ]);
            setUsers(userRes.data.data || []);
            setHospitals(hospRes.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                cid: currentUser.role === 'SUPER_ADMIN' ? form.cid : currentUser.cid
            };
            await authApi.register(payload);
            setModalOpen(false);
            setForm(emptyForm);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await authApi.toggleStatus(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to toggle status');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' },
        { key: 'fullName', label: 'Full Name' },
        {
            key: 'role',
            label: 'Role',
            render: (v) => (
                <span className={`text-xs px-2 py-1 rounded-full border ${v === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                    v === 'ADMIN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                    {v}
                </span>
            )
        },
        { key: 'cid', label: 'Tenant (CID)' },
        {
            key: 'enabled',
            label: 'Status',
            render: (v, row) => (
                <button
                    onClick={() => handleToggleStatus(row.id)}
                    className={`text-xs px-2 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 ${v ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                >
                    {v ? 'Active' : 'Disabled'}
                </button>
            )
        },
    ];

    const roles = currentUser.role === 'SUPER_ADMIN'
        ? ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'STAFF']
        : ['DOCTOR', 'STAFF'];

    return (
        <Layout title="User Management">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{users.length} users found</p>
                <button onClick={() => { setForm(emptyForm); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Create User
                </button>
            </div>

            <DataTable columns={columns} data={users} searchField="username" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New User">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all">
                                <option value="">Select Role</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        {currentUser.role === 'SUPER_ADMIN' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Hospital (CID)</label>
                                <select value={form.cid} onChange={(e) => setForm({ ...form, cid: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all">
                                    <option value="">Select Hospital</option>
                                    <option value="SYSTEM">System (Super Admin)</option>
                                    {hospitals.map(h => <option key={h.cid} value={h.cid}>{h.name} ({h.cid})</option>)}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">CID</label>
                                <input type="text" value={currentUser.cid} disabled
                                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-400" />
                            </div>
                        )}
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
