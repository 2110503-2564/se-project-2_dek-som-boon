"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DateReserve from "@/components/DateReserve";
import getShops from "@/libs/getShops";
import { MassageItem } from "../../interface";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import TimeUI from "./TimeUI";

export default function CreateShopPopup({
  onClose,
  onCreate,
}: {
  onClose: () => void,
  onCreate: (name: string, 
    address: string, 
    tel: string, 
    openTime: string, 
    closeTime: string) => void,
}) {
  const router = useRouter();
  const [name, setName] = useState<string>(""); 
  const [address, setAddress] = useState<string>(""); 
  const [tel, setTel] = useState<string>(""); 
  const [openTime, setOpenTime] = useState<Dayjs | null>(dayjs());
  const [closeTime, setCloseTime] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  const handleSubmit = () => {
    if (!name || !address || !tel || !openTime || !closeTime) {
      alert("Please fill in all fields.");
      return;
    }

    onCreate(
      name,
      address,
      tel,
      dayjs(openTime, "HH:mm").format("hh:mm A"),
      dayjs(closeTime, "HH:mm").format("hh:mm A"),
    );
    
    
    setName("");
    setAddress("");
    setOpenTime(dayjs());
    setCloseTime(dayjs());
    onClose();
  };
  

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full md:max-w-xl max-w-xs">
      <h2 className="text-xl font-semibold mb-4 text-center">Add massage shop</h2>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Name</label>
        <input
          type="text"
          className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          value={name}
          placeholder="Enter shop name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Address</label>
        <input
          type="text"
          className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          value={address}
          placeholder="Enter shop Address"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Telephone</label>
        <input
          type="text"
          className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          value={tel}
          placeholder="Enter shop telephone number"
          onChange={(e) => setTel(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Open time</label>
        <TimeUI selectedDate={openTime} setSelectedDate={setOpenTime} />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Close time</label>
        <TimeUI selectedDate={closeTime} setSelectedDate={setCloseTime} />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-500 hover:cursor-pointer transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

