import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Therapist } from "../../../interface";

import "swiper/css";
import "swiper/css/navigation";

type TherapistListProps = {
  therapists: Therapist[];
  isAdmin: boolean;
  onAddTherapist: () => void;
  onEditTherapist: (name:string, tel:string, birthdate:string, sex:string, specialties:string[], availability:string[]) => void;
  // onEditTherapist: () => void;
  onDeleteTherapist: (therapist: Therapist) => void;
};

export default function TherapistList({
  therapists,
  isAdmin,
  onAddTherapist,
  onEditTherapist,
  onDeleteTherapist,
}: TherapistListProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      <div className="mb-10" />
      <h2 className="text-2xl font-bold text-center mt-14 mb-6 text-gray-800 tracking-wide">
        Massage Therapist
      </h2>

      <div className="relative w-full max-w-5xl mx-auto mt-8 hover:cursor-pointer">
        {/* Navigation Arrows */}
        <button
          ref={prevRef}
          aria-label="Previous therapist"
          className="absolute z-10 left-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 border border-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          ref={nextRef}
          aria-label="Next therapist"
          className="absolute z-10 right-[-40px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 border border-gray-300"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={3}
          navigation={{
            prevEl: prevRef.current!,
            nextEl: nextRef.current!,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop
        >
          {therapists.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white border rounded-xl shadow-md px-6 py-6 text-center transition hover:shadow-lg mx-auto w-[240px] min-h-[350px] flex flex-col items-center gap-y-4 border-gray-300">
                <img
                  src="/image/antony.jpg"
                  alt={t.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-300"
                />
                <div className="text-left w-full space-y-1">
                  <span className="block font-semibold text-lg">{t.name}</span>
                  <span className="block text-sm text-gray-700">Tel: {t.tel}</span>
                  <span className="block text-sm text-gray-700">
                    Age: {t.age} | Gender: {t.sex}
                  </span>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <span className="font-semibold">Specialties:</span>
                      <ul className="list-disc list-inside ml-2">
                        {t.specialty.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold">Availability:</span>
                      <ul className="list-disc list-inside ml-2">
                        {t.available.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2 mt-2 justify-end">
                      <button
                        onClick={() => onEditTherapist(t.name, t.tel ,t.birthDate, t.sex, t.specialty, t.available)} 
                        className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded hover:bg-blue-400">
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteTherapist(t)}
                        className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {isAdmin && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
              onClick={onAddTherapist}
            >
              Add Massage Therapist
            </button>
          </div>
        )}

        {therapists.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
            <p className="text-gray-500">No therapists available at this massage shop.</p>
          </div>
        )}
      </div>
    </>
  );
}
