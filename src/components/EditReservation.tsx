"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DateReserve from "@/components/DateReserve";
import getShops from "@/libs/getShops";
import { MassageItem } from "../../interface";
import { Dayjs } from "dayjs";

export default function EditReservation({
  reservationId,
  reservationShopId,
  reservationDate,
  onClose,
  onUpdate,
}: {
  reservationId: string,
  reservationShopId: string,
  reservationDate: Dayjs,
  onClose: () => void,
  onUpdate: (reservationId: string, updatedData: any) => void,
}) {
  const [shops, setShops] = useState<MassageItem[]>([]);
  const [selectedShop, setSelectedShop] = useState(reservationShopId);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(reservationDate);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchShops = async () => {
      try {
        const data = await getShops();
        setShops(data.data);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      }
    };

    fetchShops();
  }, [router]);

  const handleUpdate = () => {
    if (!selectedShop || !selectedDate) {
      alert("Please select a shop and a date.");
      return;
    }

    console.log("Before update - Shop ID:", selectedShop, "Date:", selectedDate);

    onUpdate(reservationId, {
      massageShopId: selectedShop,
      reserveDate: selectedDate.format("YYYY-MM-DD"),
    });

    console.log("Updated data passed to onUpdate:", {
      massageShopId: selectedShop,
      reserveDate: selectedDate.format("YYYY-MM-DD"),
    });

    onClose();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full md:max-w-xl max-w-xs">
      <div className="mb-4 w-full">
        <label className="block text-lg font-semibold mb-2 w-full">
          Date Reservation
        </label>
        <DateReserve selectedDate={selectedDate} setSelectedDate={setSelectedDate} allowDay={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']} allowPastDay={false} lock={!selectedShop}/>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Massage Shop</label>
        <select
          className="w-full rounded-lg p-3 bg-gray-100 text-gray-700 hover:cursor-pointer"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="" disabled>Select Massage Shop</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-500 hover:cursor-pointer transition"
        >
          Update
        </button>
      </div>
    </div>
  );
}

