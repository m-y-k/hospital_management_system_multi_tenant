import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, title }) {
    return (
        <div className="flex min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 ml-64">
                <Navbar title={title} />
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
