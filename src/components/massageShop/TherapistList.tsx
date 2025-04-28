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
  onEditTherapist: (name:string, tel:string, birthdate:string, sex:string, specialties:string[], availability:string[], id:string) => void;
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

  // Helper function to convert full day names to short format
  const formatDayName = (day: string): string => {
    const dayMap: Record<string, string> = {
      "Monday": "Mon",
      "Tuesday": "Tue",
      "Wednesday": "Wed",
      "Thursday": "Thu",
      "Friday": "Fri",
      "Saturday": "Sat",
      "Sunday": "Sun"
    };
    return dayMap[day] || day;
  };

  return (
    <>
      <div className="mb-10" />
      <h2 className="text-2xl font-bold text-center mt-14 mb-6 text-gray-800 tracking-wide">
        Massage Therapist
      </h2>

      <div className="relative w-full max-w-5xl mx-auto m-8">
        {therapists.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg my-6">
            <p className="text-gray-500">No therapists available at this massage shop</p>
          </div>
        )}
        {/* Navigation Arrows - Add hover:cursor-pointer to buttons only */}
        <button
          ref={prevRef}
          aria-label="Previous therapist"
          className="absolute z-10 left-[-40px] top-1/2 transform -translate-y-10 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:cursor-pointer border border-gray-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          ref={nextRef}
          aria-label="Next therapist"
          className="absolute z-10 right-[-40px] top-1/2 transform -translate-y-10 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:cursor-pointer border border-gray-300"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={therapists.length === 1 ? 1 : therapists.length === 2 ? 2 : 3}
          centeredSlides={therapists.length === 1}
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
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: therapists.length === 1 ? 1 : 2, spaceBetween: 20, centeredSlides: therapists.length === 1 },
            1024: { slidesPerView: therapists.length === 1 ? 1 : therapists.length === 2 ? 2 : 3, spaceBetween: 20, centeredSlides: therapists.length === 1 },
          }}
          loop={therapists.length > 1}
        >
          {therapists.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="p-5"> {/* เพิ่ม div ครอบและใส่ padding เพื่อให้เงาแสดงผลได้เต็มที่ */}
                <div className="bg-white rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_20px_-5px_rgba(0,0,0,0.3)] transition-shadow px-5 py-4 text-left mx-auto w-[300px] h-[400px] flex flex-col border border-gray-200">
                  <div className="flex justify-center my-3">
                    <img
                      src={`/image/${t.sex}.png`}
                      alt={t.name}
                      className="w-24 h-24 rounded-full object-cover shadow-lg border-3 border-gray-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-center mb-2">{t.name}</h3>
                    {/*<p className="text-sm text-gray-600"><span className="font-semibold">Tel:</span> {t.tel}</p>*/}
                    <p className="text-sm text-gray-600"><span className="font-semibold">Age:</span> {t.age} | <span className="font-semibold">Gender:</span> {t.sex}</p>
                    
                    <div className="text-sm text-gray-600 mt-2">
                      <p className="font-semibold">Specialties:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {t.specialty.map((spec, i) => (
                          <li key={i} className="text-sm">{spec}</li>
                        ))}
                      </ul>
                      <p className="font-semibold mt-1">Availability: <span className="font-normal">{t.available.map(formatDayName).join(', ')}</span></p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex space-x-2 mt-auto pt-2 justify-end">
                      <button
                        onClick={() => onEditTherapist(t.name, t.tel, t.birthDate, t.sex, t.specialty, t.available, t._id)} 
                        className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded shadow hover:bg-blue-400 hover:shadow-md hover:cursor-pointer transition-all">
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteTherapist(t)}
                        className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded shadow hover:bg-red-500 hover:shadow-md hover:cursor-pointer transition-all"
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
          <div className="flex justify-center mt-10">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow hover:cursor-pointer"
              onClick={onAddTherapist}
            >
              Add Massage Therapist
            </button>
          </div>
        )}
      </div>
    </>
  );
}
