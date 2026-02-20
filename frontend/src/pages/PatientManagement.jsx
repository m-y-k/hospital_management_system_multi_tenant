import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { patientApi, hospitalApi } from '../api';
import { HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { name: '', age: '', gender: '', contact: '', medicalHistory: '' };

export default function PatientManagement() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const patRes = await patientApi.getByCid(user.cid);
            setPatients(patRes.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            cid: user.cid,
            age: parseInt(form.age) || 0
        };
        try {
            if (editingId) {
                await patientApi.update(editingId, payload);
            } else {
                await patientApi.create(payload);
            }
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (row) => {
        setForm({
            name: row.name || '',
            age: row.age || '',
            gender: row.gender || '',
            contact: row.contact || '',
            medicalHistory: row.medicalHistory || '',
        });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this patient?')) return;
        try {
            await patientApi.delete(id);
            loadData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'age', label: 'Age' },
        { key: 'gender', label: 'Gender' },
        { key: 'contact', label: 'Contact' },
    ];

    return (
        <Layout title="Patient Management">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{patients.length} patients registered</p>
                <button
                    onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Patient
                </button>
            </div>

            <DataTable
                columns={columns}
                data={patients}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchField="name"
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Edit Patient' : 'Add Patient'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Age" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
                        <Select label="Gender" value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={['Male', 'Female', 'Other']} />
                    </div>
                    <Input label="Contact" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} />
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Medical History</label>
                        <textarea
                            value={form.medicalHistory}
                            onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all"
                        />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                        {editingId ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}

function Input({ label, value, onChange, type = 'text', required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all"
            />
        </div>
    );
}

function Select({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 transition-all"
            >
                <option value="">Select...</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}
