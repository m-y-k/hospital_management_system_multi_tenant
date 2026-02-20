import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientManagement from './pages/PatientManagement';
import DoctorManagement from './pages/DoctorManagement';
import StaffManagement from './pages/StaffManagement';
import AppointmentBooking from './pages/AppointmentBooking';
import MedicineStock from './pages/MedicineStock';
import HospitalManagement from './pages/HospitalManagement';
import UserManagement from './pages/UserManagement';

function DashboardRouter() {
    const { user } = useAuth();
    if (user?.role === 'SUPER_ADMIN') return <AdminDashboard />;
    if (user?.role === 'DOCTOR') return <DoctorDashboard />;
    return <AdminDashboard />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardRouter />
                </ProtectedRoute>
            } />

            <Route path="/hospitals" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                    <HospitalManagement />
                </ProtectedRoute>
            } />

            <Route path="/doctors" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                    <DoctorManagement />
                </ProtectedRoute>
            } />

            <Route path="/patients" element={
                <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                    <PatientManagement />
                </ProtectedRoute>
            } />

            <Route path="/staff" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                    <StaffManagement />
                </ProtectedRoute>
            } />

            <Route path="/users" element={
                <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
                    <UserManagement />
                </ProtectedRoute>
            } />

            <Route path="/appointments" element={
                <ProtectedRoute>
                    <AppointmentBooking />
                </ProtectedRoute>
            } />

            <Route path="/medicines" element={
                <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                    <MedicineStock />
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
