import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { hospitalApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { cid: '', name: '', address: '', contact: '' };

export default function HospitalManagement() {
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await hospitalApi.getAll();
            setHospitals(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) await hospitalApi.update(editingId, form);
            else await hospitalApi.create(form);
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (row) => {
        setForm({ cid: row.cid || '', name: row.name || '', address: row.address || '', contact: row.contact || '' });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this hospital?')) return;
        try { await hospitalApi.delete(id); loadData(); } catch { alert('Failed'); }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'cid', label: 'CID' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'contact', label: 'Contact' },
    ];

    return (
        <Layout title="Hospital Management">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{hospitals.length} hospitals</p>
                <button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Hospital
                </button>
            </div>

            <DataTable columns={columns} data={hospitals} onEdit={handleEdit} onDelete={handleDelete} searchField="name" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Hospital' : 'Add Hospital'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'CID (Unique ID)', key: 'cid', required: true, disabled: !!editingId },
                        { label: 'Name', key: 'name', required: true },
                        { label: 'Address', key: 'address' },
                        { label: 'Contact', key: 'contact' },
                    ].map(({ label, key, required, disabled }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
                            <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={required} disabled={disabled}
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50" />
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
