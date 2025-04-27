"use client"
import { useEffect, useState } from "react";
import { Therapist } from "../../interface";
import DateReserve from "./DateReserve";
import { Dayjs } from "dayjs";

interface SecondReservationPageProps {
    therapist: Therapist;  // Make it optional
    secondPageHandler: Function;
    selectedShopName: string;
    selectedDate: Dayjs | null; 
    setSelectedDate: (date: Dayjs | null) => void;
    makeReservation: Function;
  }
  
  export default function SecondReservationPage({ therapist, secondPageHandler, selectedShopName, selectedDate, setSelectedDate, makeReservation }: SecondReservationPageProps) {    

    return (
        <div className="flex w-full justify-center flex-col items-center">
            
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 w-full md:max-w-3xl pb-2">
            <div className="text-center text-2xl font-bold pb-2">Reservation Details</div>
                <button className="text-sm px-4 py-2 bg-white shadow-lg  hover:bg-gray-200 rounded-lg hover:cursor-pointer transition" onClick={() => secondPageHandler(false)}>
                    ← Go back
                </button>
            </div>
            <div className="flex md:flex-row w-full justify-center md:space-x-4 flex-col space-y-4 md:space-y-0">
                {therapist && (
                    <div className="bg-white shadow-lg rounded-lg p-8 w-full md:max-w-xs">
                         <div className="text-center text-xl font-bold pb-2">Massage Therapist</div>
                         
                        <img
                            src={`/image/${therapist.sex}.png`}
                            alt={therapist.name}
                            className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-300 mb-5 mt-2"
                        />
                        <div className="text-left w-full space-y-1">
                        <span className="block font-semibold text-lg">{therapist.name}</span>
                        {/* <span className="block text-sm text-gray-700">Tel: {therapist.tel}</span> */}
                        <span className="block text-sm text-gray-700">
                            Age: {therapist.age} | Gender: {therapist.sex.charAt(0).toUpperCase() + therapist.sex.slice(1)}
                        </span>
                        <div className="text-sm text-gray-700 space-y-1">
                            <div>
                            <span className="font-semibold">Specialties:</span>
                            <ul className="list-disc list-inside ml-2">
                                {therapist.specialty.map((s: string, i: number) => (
                                <li key={i}>{s}</li>
                                ))}
                            </ul>
                            </div>
                            <div>
                            <span className="font-semibold">Availability:</span>
                            <ul className="list-disc list-inside ml-2">
                                {therapist.available.map((a: string, i: number) => (
                                <li key={i}>{a}</li>
                                ))}
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
                <div className="items-center content-center bg-white shadow-lg rounded-lg p-8 w-full md:max-w-md">
                    <div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2">
                            Massage Shop
                        </label>
                        <div
                            className="w-full rounded-lg p-3 bg-gray-100 text-gray-700 hover:cursor-pointer">
                          {selectedShopName}
                        </div>
                    </div>

                    <div className="mb-4 w-full">
                        <label className="block text-lg font-semibold mb-2 w-full">
                            Date Reservation
                        </label>
                        <DateReserve selectedDate={selectedDate} setSelectedDate={setSelectedDate} allowDay={therapist.available} allowPastDay={false} lock={false}/>
                    </div>
                    
                    <button
                        onClick={() => {makeReservation()}}
                        className="hover:cursor-pointer w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold text-lg transition mt-3"
                        >
                        Make a reservation
                    </button>
                    </div>
                </div>
                <div className="h-24 md:hidden"></div>
            </div>
        </div>
    )
}