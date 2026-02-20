import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { medicineApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { medicineName: '', quantity: '', expiryDate: '', supplier: '' };

export default function MedicineStock() {
    const { user } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await medicineApi.getByCid(user.cid);
            setMedicines(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, cid: user.cid, quantity: parseInt(form.quantity) || 0 };
        try {
            if (editingId) await medicineApi.update(editingId, payload);
            else await medicineApi.create(payload);
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (row) => {
        setForm({
            medicineName: row.medicineName || '',
            quantity: row.quantity || '',
            expiryDate: row.expiryDate || '',
            supplier: row.supplier || '',
        });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this medicine?')) return;
        try { await medicineApi.delete(id); loadData(); } catch { alert('Failed'); }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'medicineName', label: 'Medicine' },
        {
            key: 'quantity', label: 'Quantity',
            render: (v) => (
                <span className={`font-medium ${v < 10 ? 'text-red-400' : v < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {v}
                </span>
            ),
        },
        { key: 'expiryDate', label: 'Expiry Date' },
        { key: 'supplier', label: 'Supplier' },
    ];

    return (
        <Layout title="Medicine Stock">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{medicines.length} medicines in stock</p>
                <button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Medicine
                </button>
            </div>

            <DataTable columns={columns} data={medicines} onEdit={handleEdit} onDelete={handleDelete} searchField="medicineName" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Medicine' : 'Add Medicine'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Medicine Name</label>
                        <input type="text" value={form.medicineName} onChange={(e) => setForm({ ...form, medicineName: e.target.value })} required
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                            <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Supplier</label>
                        <input type="text" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all" />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                        {editingId ? 'Update' : 'Add'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
