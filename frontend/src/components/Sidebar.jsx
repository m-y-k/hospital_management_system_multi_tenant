import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineViewGrid,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineCube,
    HiOutlineOfficeBuilding,
    HiOutlineLogout,
    HiOutlineHeart,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineColorSwatch,
} from 'react-icons/hi';

const navItems = {
    SUPER_ADMIN: [
        { to: '/dashboard', label: 'Global Stats', icon: HiOutlineViewGrid },
        { to: '/hospitals', label: 'Hospitals', icon: HiOutlineOfficeBuilding },
        { to: '/users', label: 'User Management', icon: HiOutlineUserGroup },
    ],
    ADMIN: [
        { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
        { to: '/users', label: 'User Management', icon: HiOutlineUserGroup },
        { to: '/doctors', label: 'Doctors', icon: HiOutlineHeart },
        { to: '/patients', label: 'Patients', icon: HiOutlineUserGroup },
        { to: '/staff', label: 'Staff', icon: HiOutlineUsers },
        { to: '/appointments', label: 'Appointments', icon: HiOutlineCalendar },
        { to: '/medicines', label: 'Medicine Stock', icon: HiOutlineCube },
    ],
    DOCTOR: [
        { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
        { to: '/appointments', label: 'My Appointments', icon: HiOutlineCalendar },
    ],
    STAFF: [
        { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
        { to: '/patients', label: 'Patients', icon: HiOutlineUserGroup },
        { to: '/appointments', label: 'Appointments', icon: HiOutlineCalendar },
        { to: '/medicines', label: 'Medicine Stock', icon: HiOutlineCube },
    ],
};

export default function Sidebar() {
    const { user, logout, theme, changeTheme } = useAuth();
    const items = navItems[user?.role] || [];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-theme-aside border-r border-theme-border flex flex-col z-50 transition-colors duration-300">
            {/* Logo */}
            <div className="p-6 border-b border-theme-border">
                <h1 className="text-xl font-bold gradient-text tracking-tight">
                    🏥 HMS
                </h1>
                <p className="text-xs text-theme-secondary mt-1">Hospital Management System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-theme-primary/20 text-theme-primary shadow-lg shadow-theme-primary/10'
                                : 'text-theme-secondary hover:text-theme-text hover:bg-theme-text/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User info + Logout */}
            <div className="p-4 border-t border-theme-border">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-theme-primary to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-text truncate">{user?.fullName}</p>
                        <p className="text-xs text-theme-secondary">{user?.role} · {user?.cid}</p>
                    </div>
                </div>

                {/* Theme Switcher */}
                <div className="flex bg-theme-text/5 p-1 rounded-xl mb-3 gap-1">
                    {[
                        { id: 'dark', icon: HiOutlineMoon, label: 'Dark' },
                        { id: 'light', icon: HiOutlineSun, label: 'Light' },
                        { id: 'corporate', icon: HiOutlineColorSwatch, label: 'Corp' }
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => changeTheme(t.id)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${theme === t.id
                                ? 'bg-theme-primary/20 text-theme-primary'
                                : 'text-theme-secondary hover:text-theme-text'
                                }`}
                            title={t.label}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            {t.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
