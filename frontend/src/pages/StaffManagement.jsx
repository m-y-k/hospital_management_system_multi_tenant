import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { staffApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { name: '', role: '', contact: '' };

export default function StaffManagement() {
    const { user } = useAuth();
    const [staff, setStaff] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await staffApi.getByCid(user.cid);
            setStaff(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, cid: user.cid };
        try {
            if (editingId) await staffApi.update(editingId, payload);
            else await staffApi.create(payload);
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (row) => {
        setForm({ name: row.name || '', role: row.role || '', contact: row.contact || '' });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this staff member?')) return;
        try { await staffApi.delete(id); loadData(); } catch { alert('Failed'); }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'contact', label: 'Contact' },
    ];

    return (
        <Layout title="Staff Management">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{staff.length} staff members</p>
                <button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Staff
                </button>
            </div>

            <DataTable columns={columns} data={staff} onEdit={handleEdit} onDelete={handleDelete} searchField="name" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Staff' : 'Add Staff'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Name', key: 'name', required: true },
                        { label: 'Role', key: 'role' },
                        { label: 'Contact', key: 'contact' },
                    ].map(({ label, key, required }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
                            <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required}
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                        </div>
                    ))}
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                        {editingId ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
