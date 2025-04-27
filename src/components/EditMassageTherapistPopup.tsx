"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateReserve from "./DateReserve";

export default function EditMassageTherapistPopup({
  nameval,
  telval,
  birthdateval,
  sexval,
  specialtiesval,
  availabilityval,
  therapistIdval,
  onClose,
  onUpdate
}: {
  nameval: string;
  telval: string;
  birthdateval: Dayjs;
  sexval: string;
  specialtiesval: string[];
  availabilityval: string[];
  therapistIdval: string;
  onClose: () => void;
  onUpdate: (
    name: string,
    tel: string,
    birthdate: string,
    sex: string,
    specialties: string[],
    availability: string[],
    therapistId: string
  ) => void;
}) {
  const [fname, lname] = nameval.split(' ');

  const router = useRouter();
  const [firstname, setFirstname] = useState(fname);
  const [lastname, setLastname] = useState(lname);
  const [tel, setTel] = useState(telval);
  const [birthdate, setBirthdate] = useState<Dayjs | null>(birthdateval);
  const [sex, setSex] = useState(sexval);
  const [specialties, setSpecialties] = useState<string[]>(specialtiesval);
  const [availability, setAvailability] = useState<string[]>([]);

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

  // useEffect(()=>{
  //   alert(availabilityval)
  // }, [])

  function shortenDays(days:string[]) {
    return days.map(day => day.slice(0, 3));
  }

  useEffect(()=>{
    setAvailability(shortenDays(availabilityval));
  }, [])

  const handleSubmit = () => {
    if (!firstname || !lastname || !tel || !birthdate || availability.length === 0||specialties.length===0) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Map abbreviated days to full day names
    const dayMapping: {[key: string]: string} = {
      "Mon": "Monday",
      "Tue": "Tuesday",
      "Wed": "Wednesday",
      "Thu": "Thursday",
      "Fri": "Friday",
      "Sat": "Saturday",
      "Sun": "Sunday"
    };
    
    // Make sure each abbreviation maps to a full day name
    const fullDayNames = availability.map(day => dayMapping[day] || day);
    
    // Format date as expected by API (YYYY-MM-DDT00:00:00.000Z)
    const formattedDate = birthdate ? birthdate.format("YYYY-MM-DD") + "T00:00:00.000Z" : "";

    // Combine fname and lastname as name
    const name = firstname + " " + lastname;
    
    onUpdate(
      name,
      tel,
      formattedDate,
      sex.toLowerCase(), // Ensure lowercase
      specialties,
      fullDayNames, // Make sure to pass the full day names
      therapistIdval
    );
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto border border-gray-200">
        <h2 className="text-lg font-semibold mb-5 text-center text-black">Edit Massage Therapist</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-black">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Enter therapist firstname"
              className="w-full rounded-md p-3 bg-gray-100 text-sm text-black border border-gray-300"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-black">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Enter therapist lastname"
              className="w-full rounded-md p-3 bg-gray-100 text-sm text-black border border-gray-300"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1 text-black">Telephone</label>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Enter Massage Therapist telephone number"
            className="w-full rounded-md p-3 bg-gray-100 text-sm text-black border border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Birthdate</label>
            <DateReserve selectedDate={birthdate} setSelectedDate={setBirthdate} allowDay={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']} allowPastDay={true} lock={false}/>

            <label className="block text-sm font-medium mt-4 mb-1 text-black">Gender</label>
            <select
              className="w-full rounded-md p-3 bg-gray-100 text-sm text-black border border-gray-300"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Specialties</label>
            <div className="flex flex-col justify-between h-full gap-2 pb-10">
              {["Traditional Health Massage Therapist", "Thai Traditional Medicine Assistant", "Thai Traditional Medicine Doctor"].map((specialty) => (
                <label key={specialty} className="inline-flex items-center text-sm text-black">
                  <input
                    type="checkbox"
                    checked={specialties.includes(specialty)}
                    onChange={() => handleSpecialtyChange(specialty)}
                    className="mr-2 gap-3"
                  />
                  {specialty}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black">Availability</label>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {days.map((day) => (
              <label key={day} className="inline-flex flex-row gap-x-2 items-center text-black">
                <input
                  type="checkbox"
                  className="mb-1"
                  checked={availability.includes(day)}
                  onChange={(e) => {
                    // Update using array methods since availability is string[]
                    setAvailability(prev => 
                      e.target.checked
                        ? [...prev, day]  // Add day to array if checked
                        : prev.filter(d => d !== day)  // Remove day from array if unchecked
                    );
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="w-[45%] bg-[#1E1B4B] text-white py-2.5 rounded-md font-medium text-base hover:bg-[#2c2960] hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-[45%] bg-green-600 text-white py-2.5 rounded-md font-medium text-base hover:bg-green-500 hover:cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
