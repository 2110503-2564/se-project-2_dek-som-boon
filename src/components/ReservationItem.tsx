import { ReserveItem } from "../../interface";


export default function ReservationItem({ reserve, onEdit, onDelete, isAdmin}: { reserve: ReserveItem, onEdit: () => void, onDelete: () => void, isAdmin: Boolean }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
            <div>
                <h2 className="text-lg font-semibold">{reserve.massageShop.name}</h2>
                {isAdmin && <p className="text-gray-500">Reserver ID: {reserve.user}</p>}
                <p className="text-gray-500">
                    {new Date(reserve.reserveDate).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>
            <div className="flex space-x-2 md:flex-row flex-col space-y-2 md:space-y-0">
                <button className="bg-gray-800 hover:bg-gray-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg w-20" onClick={onEdit}>Edit</button>
                <button className="bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white px-4 py-2 rounded-lg w-20" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}