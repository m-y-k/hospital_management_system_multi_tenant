export default function KpiCard({ title, value, icon: Icon, color = 'primary', trend }) {
    const colorMap = {
        primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 text-primary-400',
        accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/30 text-accent-400',
        rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color]} border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-theme-secondary font-medium">{title}</p>
                    <p className="text-3xl font-bold text-theme-text mt-2">{value}</p>
                    {trend && (
                        <p className="text-xs mt-2 text-theme-secondary opacity-70">{trend}</p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 rounded-xl bg-white/5">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
        </div>
    );
}
