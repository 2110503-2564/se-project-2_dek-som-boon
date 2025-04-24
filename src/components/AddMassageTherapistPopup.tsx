"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateReserve from "./DateReserve";

export default function AddMassageTherapistPopup({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (
    name: string,
    tel: string,
    birthdate: string,
    sex: string,
    specialties: string[],
    availability: string
  ) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [birthdate, setBirthdate] = useState<Dayjs | null>(dayjs());
  const [sex, setSex] = useState("Male");
  const [availability, setAvailability] = useState<string>("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  const handleSpecialtyChange = (specialty: string) => {
    setSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = () => {
    if (!name || !tel || !birthdate || !availability) {
      alert("Please fill in all fields.");
      return;
    }
    onAdd(
      name,
      tel,
      birthdate.format("YYYY-MM-DD"),
      sex,
      specialties,
      availability
    );
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full md:max-w-xl max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Massage Therapist</h2>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Massage Therapist name"
            className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Telephone</label>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Enter Massage Therapist telephone number"
            className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Birthdate</label>
          {/* <DesktopDatePicker
            format="MM/DD/YYYY"
            value={birthdate}
            onChange={(date: Dayjs | null) => setBirthdate(date)}
            slotProps={{
                textField: {
                fullWidth: true,
                },
            }}
            /> */}
            <DateReserve selectedDate={birthdate} setSelectedDate={setBirthdate} />

        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">sex</label>
          <select
            className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Specialties</label>
          <div className="flex flex-col gap-2">
            {[
              "Traditional Health Massage Therapist",
              "Thai Traditional Medicine Assistant",
              "Thai Traditional Medicine Doctor",
            ].map((specialty) => (
              <label key={specialty} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={specialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                  className="mr-2"
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Availability</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Enter Massage Therapist Availability"
            className="w-full rounded-lg p-3 bg-gray-100 text-gray-700"
          />
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
    </LocalizationProvider>
  );
}
