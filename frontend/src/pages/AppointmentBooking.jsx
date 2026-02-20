import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, doctorApi, patientApi, medicineApi } from '../api';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const emptyPrescription = { diagnosis: '', advice: '', medicines: [] };
const emptyForm = {
    doctorId: '',
    patientId: '',
    dateTime: '',
    notes: '',
    doctorName: '',
    patientName: '',
    status: 'BOOKED',
    prescription: emptyPrescription
};

export default function AppointmentBooking() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [availableMedicines, setAvailableMedicines] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [apptRes, docRes, patRes, medRes] = await Promise.all([
                appointmentApi.getByCid(user.cid),
                doctorApi.getByCid(user.cid),
                patientApi.getByCid(user.cid),
                medicineApi.getByCid(user.cid)
            ]);
            setAppointments(apptRes.data.data || []);
            setDoctors(docRes.data.data || []);
            setPatients(patRes.data.data || []);
            setAvailableMedicines(medRes.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const doc = doctors.find(d => d.id === parseInt(form.doctorId));
        const pat = patients.find(p => p.id === parseInt(form.patientId));
        const payload = {
            ...form,
            cid: user.cid,
            doctorId: parseInt(form.doctorId),
            patientId: parseInt(form.patientId),
            doctorName: doc?.name || form.doctorName,
            patientName: pat?.name || form.patientName,
        };
        try {
            if (editingId) await appointmentApi.update(editingId, payload);
            else await appointmentApi.create(payload);
            setModalOpen(false);
            setForm(emptyForm);
            setEditingId(null);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const handleEdit = (row) => {
        setForm({
            ...row,
            doctorId: row.doctorId || '',
            patientId: row.patientId || '',
            dateTime: row.dateTime ? row.dateTime.slice(0, 16) : '',
            prescription: row.prescription || emptyPrescription
        });
        setEditingId(row.id);
        setModalOpen(true);
    };

    const handleAddMedicine = () => {
        setForm({
            ...form,
            prescription: {
                ...form.prescription,
                medicines: [...form.prescription.medicines, { medicineName: '', quantity: 1, dosage: '' }]
            }
        });
    };

    const handleRemoveMedicine = (index) => {
        const newMeds = [...form.prescription.medicines];
        newMeds.splice(index, 1);
        setForm({
            ...form,
            prescription: { ...form.prescription, medicines: newMeds }
        });
    };

    const updateMedicine = (index, field, value) => {
        const newMeds = [...form.prescription.medicines];
        newMeds[index][field] = field === 'quantity' ? parseInt(value) || 0 : value;
        setForm({
            ...form,
            prescription: { ...form.prescription, medicines: newMeds }
        });
    };

    const handleStatusChange = async (id, status) => {
        try {
            await appointmentApi.updateStatus(id, status);
            loadData();
        } catch (err) { alert(err.response?.data?.message || 'Failed to update status'); }
    };

    return (
        <Layout title="Appointments">
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">{appointments.length} appointments</p>
                {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                    <button onClick={() => { setForm(emptyForm); setEditingId(null); setModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
                        <HiOutlinePlus className="w-4 h-4" /> Book Appointment
                    </button>
                )}
            </div>

            <DataTable columns={[
                { key: 'id', label: 'ID' },
                { key: 'doctorName', label: 'Doctor' },
                { key: 'patientName', label: 'Patient' },
                { key: 'dateTime', label: 'Date/Time', render: (v) => v ? new Date(v).toLocaleString() : '-' },
                {
                    key: 'status', label: 'Status', render: (v) => (
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${v === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : v === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                            {v}
                        </span>
                    )
                },
                {
                    key: 'actions', label: '',
                    render: (_, row) => (user.role === 'ADMIN' || user.role === 'DOCTOR') ? (
                        <div className="flex gap-1">
                            {row.status !== 'COMPLETED' && <button onClick={() => handleStatusChange(row.id, 'COMPLETED')} className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">Complete</button>}
                            {row.status !== 'CANCELLED' && <button onClick={() => handleStatusChange(row.id, 'CANCELLED')} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg">Cancel</button>}
                        </div>
                    ) : null,
                },
            ]} data={appointments} onEdit={handleEdit} searchField="patientName" />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Appointment' : 'Book Appointment'}>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Doctor</label>
                            <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200">
                                <option value="">Select Doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Patient</label>
                            <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200">
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date & Time</label>
                            <input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200">
                                <option value="BOOKED">BOOKED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700/50 space-y-4">
                        <h4 className="text-sm font-semibold text-primary-400">Prescription Details</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Diagnosis</label>
                            <input type="text" value={form.prescription.diagnosis} onChange={(e) => setForm({ ...form, prescription: { ...form.prescription, diagnosis: e.target.value } })}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Advice</label>
                            <textarea value={form.prescription.advice} onChange={(e) => setForm({ ...form, prescription: { ...form.prescription, advice: e.target.value } })} rows={2}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-400">Medicines</label>
                                <button type="button" onClick={handleAddMedicine} className="text-xs text-primary-400 hover:text-primary-300 font-medium">+ Add Medicine</button>
                            </div>
                            {form.prescription.medicines.map((m, idx) => (
                                <div key={idx} className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <select value={m.medicineName} onChange={(e) => updateMedicine(idx, 'medicineName', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-200">
                                            <option value="">Select Medicine</option>
                                            {availableMedicines.map(am => <option key={am.id} value={am.medicineName}>{am.medicineName} ({am.quantity} left)</option>)}
                                        </select>
                                    </div>
                                    <div className="w-20">
                                        <input type="number" placeholder="Qty" value={m.quantity} onChange={(e) => updateMedicine(idx, 'quantity', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-200" />
                                    </div>
                                    <div className="w-24">
                                        <input type="text" placeholder="Dosage" value={m.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                            className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-200" />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveMedicine(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><HiOutlineTrash /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all">
                        {editingId ? 'Update Appointment' : 'Book Appointment'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
