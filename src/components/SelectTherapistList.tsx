import { Therapist } from "../../interface"
import Image from "next/image";

interface SelectTherapistListProps {
  therapists: Therapist[];
  therapistSetter: Function;
  secondPageHandler: Function;
}

export default function SelectTherapistList({ therapists, therapistSetter, secondPageHandler }: SelectTherapistListProps) {
    function handleSelect(therapist: Therapist){
        // console.log(therapist);
        therapistSetter(therapist);
        secondPageHandler(true);
    }
    return(
        <div className="space-y-3 max-h-60 overflow-y-auto">
            {therapists.map(t => (
                <div key={t._id} className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm text-sm">

                <div className="flex flex-row items-center space-x-4">
                <Image
                    src={`/image/${t.sex}.png`}
                    alt={t.name}
                    width={900}
                    height={900}
                    className="rounded-full object-cover border-2 border-gray-300 w-12 h-auto"
                />
                <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <ul className="mt-2 space-y-1 list-inside">
                        {t.specialty.map((item, index) => (
                            <li key={index} className="text-gray-600 flex items-center space-x-2">
                            <span className="w-1 h-1 rounded-full bg-gray-900"></span>
                            <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                </div>
  
                {true && (
                    <>
                        <button
                        onClick={() => handleSelect(t)}
                        className="text-white text-base font-semibold px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 hover:cursor-pointer"
                        >
                        Select
                        </button>
                    </>
                )}
                </div>
            ))
            }
        </div>
    )
}