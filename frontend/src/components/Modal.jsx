import { HiOutlineX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
