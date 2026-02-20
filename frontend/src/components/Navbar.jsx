import { useAuth } from '../context/AuthContext';

export default function Navbar({ title }) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 h-16 bg-theme-bg/60 backdrop-blur-xl border-b border-theme-border flex items-center justify-between px-8 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-theme-text">{title}</h2>
            <div className="flex items-center gap-4">
                <span className="text-xs px-3 py-1.5 rounded-full bg-theme-primary/20 text-theme-primary font-medium border border-theme-primary/30">
                    {user?.cid}
                </span>
            </div>
        </header>
    );
}
