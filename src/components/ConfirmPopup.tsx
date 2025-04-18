export default function ConfirmPopup({ onClose, onDelete, title }: { onClose: () => void, onDelete: () => void, title: string }){
    return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full md:max-w-xl max-w-xs">
        <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-2 w-full text-center">
            {title}
            </label>
        </div>

        <div className="flex gap-4">
        <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition"
        >
            Cancel
        </button>
        <button
            onClick={onDelete}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-500 hover:cursor-pointer transition"
        >
            Delete
        </button>
        </div>
    </div>
    );
}
