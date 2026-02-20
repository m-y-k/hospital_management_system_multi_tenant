import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const stored = localStorage.getItem('hms_user');
        if (stored) {
            try {
                const userData = JSON.parse(stored);
                setUser(userData);
                if (userData.theme) setTheme(userData.theme);
            } catch {
                localStorage.removeItem('hms_user');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        document.documentElement.className = theme;
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const login = (userData) => {
        setUser(userData);
        if (userData.theme) setTheme(userData.theme);
        localStorage.setItem('hms_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hms_user');
    };

    const changeTheme = async (newTheme) => {
        try {
            setTheme(newTheme);
            const stored = localStorage.getItem('hms_user');
            if (stored) {
                const userData = JSON.parse(stored);
                userData.theme = newTheme;
                localStorage.setItem('hms_user', JSON.stringify(userData));
                setUser(userData);
            }
            // Import here to avoid circular dependency if any
            const { authApi } = await import('../api');
            await authApi.updateTheme(newTheme);
        } catch (err) {
            console.error('Failed to update theme', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, theme, changeTheme }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
