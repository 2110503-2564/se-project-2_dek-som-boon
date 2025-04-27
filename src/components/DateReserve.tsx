"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function DateReserve({
  selectedDate,
  setSelectedDate,
  lock,
  allowDay,
  allowPastDay,
}: {
  selectedDate: dayjs.Dayjs | null;
  setSelectedDate: (date: dayjs.Dayjs | null) => void;
  lock: boolean;
  allowDay: string[];
  allowPastDay: boolean;
}) {
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    //   <div className="w-full">
    //     <DatePicker
    //       className="w-full bg-white"
    //       value={selectedDate}
    //       onChange={(newValue) => setSelectedDate(newValue)}
    //     />
    //   </div>
    // </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full">
        <DatePicker
        
        disabled={lock}
          shouldDisableDate={(date) => {
            // const isMonday = dayjs(date).day() === 1; // 1 = Monday
            const dayOfWeek = dayjs(date).format('dddd'); // Get the full day name (e.g., "Monday", "Tuesday", etc.)
            
            let isBefore = dayjs(date).isBefore(dayjs(), 'day'); // Disable past dates
            if (allowPastDay) {
              isBefore = false;
            }

            // const isAfter = dayjs(date).isAfter(dayjs(), 'day'); // Disable past dates
            const isToday = dayjs(date).isSame(dayjs(), 'day');
            
            return !allowDay.includes(dayOfWeek) || isBefore || isToday; // Disable Mondays, past dates, and today
          }}
          className="w-full bg-gray-100"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          slotProps={{
            textField: {
              sx: {
                width: "100%",
                backgroundColor: "#F3F4F6", // Tailwind bg-gray-100
                borderRadius: "8px", // Tailwind rounded-lg
                color: "#374151", // Tailwind text-gray-700
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" }, // Remove border
                },
                "& .MuiInputBase-input": {
                  color: "#374151", // Tailwind text-gray-700
                  fontSize: "16px",
                  height: "10px", // Set input height
                },
                "& .MuiSvgIcon-root": {
                  color: "#374151", // Tailwind text-gray-700 for the calendar icon
                },
              },
              placeholder: lock ? 'Please select shop' : 'MM/DD/YYYY', 
            },
          }}
        />
      </div>
    </LocalizationProvider>

  );
}
