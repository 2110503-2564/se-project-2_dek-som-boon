import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';

export default function TimeUI({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: dayjs.Dayjs | null;
  setSelectedDate: (date: dayjs.Dayjs | null) => void;
}) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-full">
        <TimePicker
          label=""
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
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
                  color: "#374151", // Tailwind text-gray-700 for the time icon
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};


