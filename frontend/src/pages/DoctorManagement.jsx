import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { doctorApi, hospitalApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { name: '', specialization: '', contact: '', availability: '' };

export default function DoctorManagement() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const docRes = await doctorApi.getByCid(user.cid);
            setDoctors(docRes.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, cid: user.cid };
        try {
            if (editingId) await doctorApi.update(editingId, payload);
            else await doctorApi.create(payload);
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (row) => {
        setForm({
            name: row.name,
            specialization: row.specialization || '',
            contact: row.contact || '',
            availability: row.availability || ''
        });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this doctor?')) return;
        try { await doctorApi.delete(id); loadData(); } catch { alert('Failed'); }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'specialization', label: 'Specialization' },
        { key: 'contact', label: 'Contact' },
        { key: 'availability', label: 'Availability' },
    ];

    return (
        <Layout title="Doctor Management">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{doctors.length} doctors registered</p>
                <button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Doctor
                </button>
            </div>

            <DataTable columns={columns} data={doctors} onEdit={handleEdit} onDelete={handleDelete} searchField="name" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Doctor' : 'Add Doctor'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Name', key: 'name', required: true },
                        { label: 'Specialization', key: 'specialization' },
                        { label: 'Contact', key: 'contact' },
                        { label: 'Availability', key: 'availability' },
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
