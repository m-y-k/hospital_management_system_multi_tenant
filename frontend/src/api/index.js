import axios from 'axios';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || '';
const HOSPITAL_URL = import.meta.env.VITE_HOSPITAL_URL || '';
const APPOINTMENT_URL = import.meta.env.VITE_APPOINTMENT_URL || '';

const createApi = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.request.use((config) => {
        const stored = localStorage.getItem('hms_user');
        if (stored) {
            const user = JSON.parse(stored);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('hms_user');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

const authApiInstance = createApi(AUTH_URL);
const hospitalApiInstance = createApi(HOSPITAL_URL);
const appointmentApiInstance = createApi(APPOINTMENT_URL);

// Auth
export const authApi = {
    login: (data) => authApiInstance.post('/api/auth/login', data),
    register: (data) => authApiInstance.post('/api/auth/register', data),
    getUsers: (cid) => authApiInstance.get(`/api/auth/users${cid ? `?cid=${cid}` : ''}`),
    toggleStatus: (id) => authApiInstance.post(`/api/auth/${id}/toggle-status`),
    updateTheme: (theme) => authApiInstance.put('/api/auth/theme', { theme }),
};

// Hospitals
export const hospitalApi = {
    getAll: () => hospitalApiInstance.get('/api/hospitals'),
    getById: (id) => hospitalApiInstance.get(`/api/hospitals/${id}`),
    create: (data) => hospitalApiInstance.post('/api/hospitals', data),
    update: (id, data) => hospitalApiInstance.put(`/api/hospitals/${id}`, data),
    delete: (id) => hospitalApiInstance.delete(`/api/hospitals/${id}`),
};

// Doctors
export const doctorApi = {
    getByCid: (cid) => hospitalApiInstance.get(`/api/doctors?cid=${cid}`),
    getById: (id) => hospitalApiInstance.get(`/api/doctors/${id}`),
    create: (data) => hospitalApiInstance.post('/api/doctors', data),
    update: (id, data) => hospitalApiInstance.put(`/api/doctors/${id}`, data),
    delete: (id) => hospitalApiInstance.delete(`/api/doctors/${id}`),
};

// Patients
export const patientApi = {
    getByCid: (cid) => hospitalApiInstance.get(`/api/patients?cid=${cid}`),
    getById: (id) => hospitalApiInstance.get(`/api/patients/${id}`),
    create: (data) => hospitalApiInstance.post('/api/patients', data),
    update: (id, data) => hospitalApiInstance.put(`/api/patients/${id}`, data),
    delete: (id) => hospitalApiInstance.delete(`/api/patients/${id}`),
};

// Staff
export const staffApi = {
    getByCid: (cid) => hospitalApiInstance.get(`/api/staff?cid=${cid}`),
    getById: (id) => hospitalApiInstance.get(`/api/staff/${id}`),
    create: (data) => hospitalApiInstance.post('/api/staff', data),
    update: (id, data) => hospitalApiInstance.put(`/api/staff/${id}`, data),
    delete: (id) => hospitalApiInstance.delete(`/api/staff/${id}`),
};

// Medicines
export const medicineApi = {
    getByCid: (cid) => hospitalApiInstance.get(`/api/medicines?cid=${cid}`),
    getById: (id) => hospitalApiInstance.get(`/api/medicines/${id}`),
    create: (data) => hospitalApiInstance.post('/api/medicines', data),
    update: (id, data) => hospitalApiInstance.put(`/api/medicines/${id}`, data),
    delete: (id) => hospitalApiInstance.delete(`/api/medicines/${id}`),
    getLowStock: (cid, threshold = 10) => hospitalApiInstance.get(`/api/medicines/low-stock?cid=${cid}&threshold=${threshold}`),
    deductStock: (cid, data) => hospitalApiInstance.post(`/api/medicines/deduct?cid=${cid}`, data),
};

// Appointments
export const appointmentApi = {
    getByCid: (cid) => appointmentApiInstance.get(`/api/appointments?cid=${cid}`),
    getByDoctor: (cid, doctorId) => appointmentApiInstance.get(`/api/appointments/doctor/${doctorId}?cid=${cid}`),
    getById: (id) => appointmentApiInstance.get(`/api/appointments/${id}`),
    create: (data) => appointmentApiInstance.post('/api/appointments', data),
    update: (id, data) => appointmentApiInstance.put(`/api/appointments/${id}`, data),
    updateStatus: (id, status) => appointmentApiInstance.put(`/api/appointments/${id}/status`, { status }),
    delete: (id) => appointmentApiInstance.delete(`/api/appointments/${id}`),
    getStats: (cid) => appointmentApiInstance.get(`/api/appointments/stats?cid=${cid}`),
};

// Dashboard
export const dashboardApi = {
    getStats: (cid) => hospitalApiInstance.get(`/api/dashboard?cid=${cid}`),
};

export default hospitalApiInstance; // Default or any instance

