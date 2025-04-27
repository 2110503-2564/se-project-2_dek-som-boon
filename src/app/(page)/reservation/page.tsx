"use client";  // Ensures this runs only on the client side

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateReserve from "@/components/DateReserve";
import getShops from "@/libs/getShops";
import createReservation from "@/libs/createReservation";
import { MassageItem } from "../../../../interface";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { getTherapists } from "@/libs/getTherapists";
import { getTherapistsByDate } from "@/libs/getTherapistsByDate";
import SelectTherapistList from "@/components/SelectTherapistList";
import { Therapist } from "../../../../interface";
import SecondReservationPage from "@/components/SecondReservationPage";

dayjs.extend(utc);

export default function Reservation() {
  const [shops, setShops] = useState<MassageItem[]>([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTherapistWay, setSelectedTherapistWay] = useState(false);
  const [isSelectTherapistWay, setIsSelectTherapistWay] = useState(false);
  const [allowDay, setAllowDay] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [therapist2Select, setTherapist2Select] = useState<Therapist[]>([]);
  const [filteredTherapist2Select, setFilteredTherapist2Select] = useState<Therapist[]>([]);

  const [selectedTherapist, setSelectedTherapist] = useState<Therapist>();
  const [secondPage, setSecondPage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const shopId = searchParams.get("shopId");
    if (shopId) {
      setSelectedShop(shopId);
    }
  }, [searchParams]);  // Add searchParams as a dependency

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

  const handleReservation = async () => {
    const token = localStorage.getItem("token");
    if (!selectedShop || !selectedDate || !selectedTherapist || !token) {
      alert("Please select a shop, date, and therapist.");
      return;
    }

    try {
      const result = await createReservation({
        massageShopId: selectedShop,
        reserveDate: selectedDate.format("YYYY-MM-DD"),
        therapist: selectedTherapist._id,
        token,
      });

      alert("Reservation successful!");
      setSelectedShop("");
      setSelectedDate(null);
      setSelectedTherapist(undefined);
      setSecondPage(false);
      setTherapist2Select([]);
      setSelectedTherapistWay(false);
      setIsSelectTherapistWay(false);
      setAllowDay(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      setFilteredTherapist2Select([]);
      // router.push("/"); // Uncomment if you want to redirect after success
    } catch (err: any) {
      console.error("Error making reservation:", err);
      alert(`Error: ${err.message}`);
    }
  };

  

  function handleSelectionChange(type : string){
    if(type == "own"){
      setSelectedTherapistWay(true);
      if(isSelectTherapistWay){
        handleFindTherapist();
      }
    }
    else if(type == "recommend"){
      setSelectedTherapistWay(false);
    }

    if(!isSelectTherapistWay){
      setIsSelectTherapistWay(!isSelectTherapistWay);
      handleFindTherapistFirstTime();
    }
  }

  const handleFindTherapistFirstTime = async () => {
    const token = localStorage.getItem("token");
    if (!selectedShop || !token) {
      alert("Please select a shop.");
      return;
    }

    try {
      const result = await getTherapistsByDate(selectedShop, "");
      
      setTherapist2Select(result);
      setFilteredTherapist2Select(result);
      // console.log(result);

    } catch (err: any) {
      console.error("Error making reservation:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const fetchTherapists = async (shopId: string) => {
    try {
      const data = await getTherapists(shopId);
      // console.log(data);
      setTherapist2Select(data);
      setFilteredTherapist2Select(data);
      console.log(data)
      const availableDays = [
        ...new Set(data.map(item => item.available).flat())
      ];
      setAllowDay(availableDays);
    
      // console.log(availableDays);
    } catch (error) {
      console.error("Failed to fetch therapists:", error);
    }
  };


  // const handleFindTherapist = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!selectedShop || !token) {
  //     alert("Please select a shop");
  //     return;
  //   }
  //   let passDate = "";
  //   if(selectedDate != null){
  //     passDate = selectedDate.format("YYYY-MM-DD")
  //   }
  //   try {
  //     const result = await getTherapistsByDate(selectedShop, passDate);
      
  //     setTherapist2Select(result);
  //     console.log(result);
  //     // alert("Reservation successful!");
  //     // setSelectedShop("");
  //     // setSelectedDate(null);
  //     // router.push("/"); // Uncomment if you want to redirect after success
  //   } catch (err: any) {
  //     console.error("Error making reservation:", err);
  //     alert(`Error: ${err.message}`);
  //   }
  // };

  function handleFindTherapist(){
    if(selectedDate){
      const selectedDay = dayjs(selectedDate).format("dddd");
      const filtered = therapist2Select.filter((t) =>
        t.available.includes(selectedDay)
      );
  
      setFilteredTherapist2Select(filtered);
    }
    else{
      setFilteredTherapist2Select(therapist2Select);
    }
  }

  function secondPageHandler(bool: Boolean){
    if(bool){
      setSecondPage(true);
    }
    else{
      setSecondPage(false);
    }
  }

  const getNameById = (_id: string) => {
    const shop = shops.find(item => item._id === _id);
    return shop ? shop.name : "";
  };

  function handleReservationNext(){
    if (!selectedDate) {
      alert("Please select reservation date.");
      return;
    }

    const selectedDay = dayjs(selectedDate).format("dddd");
    const filtered = therapist2Select.filter((t) =>
      t.available.includes(selectedDay)
    );
    const randomInt = Math.floor(Math.random() * (filtered.length - 0)) + 0;
    // console.log(filtered[randomInt]);
    setSelectedTherapist(filtered[randomInt]);
    setSecondPage(true);
    // setFilteredTherapist2Select(filtered);  
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-4">
      {!secondPage && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Massage Shop
            </label>
            <select
              className="w-full rounded-lg p-3 bg-gray-100 text-gray-700 hover:cursor-pointer"
              value={selectedShop}
              onChange={(e) => {
                setSelectedShop(e.target.value); 
                setSelectedDate(null);
                fetchTherapists(e.target.value);
              }}
            >
              <option value="" disabled>Select Massage Shop</option>
              {shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-2 w-full">
              Select a Therapist
            </label>

            <div className="flex space-y-2 flex-col md:flex-row md:space-y-0 md:space-x-8">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="doctorSelection"
                  className="h-5 w-5 text-red-500 hover:cursor-pointer"
                  checked={selectedTherapistWay}
                  onChange={() => handleSelectionChange("own")}
                  disabled={!selectedShop}
                />
                <span className="hover:cursor-pointer">Choose Your Own Therapist</span>
              </label>
              <label className="flex items-center space-x-2 ">
                <input
                  type="radio"
                  name="doctorSelection"
                  className="h-5 w-5 text-red-500 hover:cursor-pointer"
                  checked={!selectedTherapistWay}
                  onChange={() => handleSelectionChange("recommend")}
                  disabled={!selectedShop}
                />
                <span className="hover:cursor-pointer">Recommended Therapist for You</span>
              </label>
            </div>
          </div>
        {!selectedTherapistWay && (
          <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-2 w-full">
              Date Reservation
            </label>
            <DateReserve selectedDate={selectedDate} setSelectedDate={setSelectedDate} allowDay={allowDay} allowPastDay={false} lock={!selectedShop}/>
          </div>
        )}

        {!selectedTherapistWay && (
          <button
            onClick={handleReservationNext}
            className="hover:cursor-pointer w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold text-lg transition"
          >
            Next
          </button>
        )}
      </div>
      )}


      {selectedTherapistWay && !secondPage &&(
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-2 w-full">
            Find Your Therapist
            </label>
            <DateReserve selectedDate={selectedDate} setSelectedDate={setSelectedDate} allowDay={allowDay} allowPastDay={false} lock={!selectedShop}/>
          </div>

          {/* <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-2 w-full">
              Select Therapist
            </label>
            <DateReserve selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div> */}

          {/* <button
            onClick={handleReservation}
            className="hover:cursor-pointer w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-500 transition"
          >
            Make a reservation
          </button> */}
          <button
            onClick={handleFindTherapist}
            className="hover:cursor-pointer w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold text-lg transition"
          >
            Find
          </button>
          <div className="mt-4">
            <SelectTherapistList therapists={filteredTherapist2Select} therapistSetter={setSelectedTherapist} secondPageHandler={secondPageHandler}/>
          </div>
          
        </div>
      )}
      {secondPage && selectedTherapist && (
        <SecondReservationPage therapist={selectedTherapist} 
          secondPageHandler={secondPageHandler} 
          selectedShopName={getNameById(selectedShop)} 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          makeReservation={handleReservation}
        />
      )}
    </div>
  );
}
