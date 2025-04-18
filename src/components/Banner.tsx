import Link from "next/link";

export default function Banner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full md:p-10 py-10 px-5 bg-gray-100 pt-60">
      {/* ส่วนหัวข้อความเหมือนเดิม ไม่เปลี่ยน layout */}
      <h1 className="text-xl font-semibold text-gray-600">Welcome to</h1>
      <h2 className="text-5xl font-bold mt-2">
        <span className="text-red-600">Antony</span> Massage
      </h2>

      {/* ปุ่มลิงก์: responsive layout */}
      <div className="mt-10 w-full max-w-xs md:w-3/4 md:max-w-4xl">
        <div className="flex flex-col gap-3 md:grid md:grid-cols-4 md:grid-rows-2">
          <Link href="/reservation" className="md:col-span-2 md:row-span-2">
            <button className="bg-red-600 text-white w-full h-20 md:h-full text-xl rounded-lg font-medium shadow-md hover:bg-red-500 transition">
              Make Reservation
            </button>
          </Link>

          <Link href="/myreservation" className="md:col-start-3 md:row-start-1">
            <button className="border-2 border-red-600 text-red-600 w-full h-20 text-lg rounded-lg font-medium hover:bg-red-600 hover:text-white transition">
              <div className="hidden lg:block">My Reservations</div>
              <div className="lg:hidden block">My Reserves</div>
            </button>
          </Link>

          <Link href="/profile" className="md:col-start-4 md:row-start-1">
            <button className="border-2 border-red-600 text-red-600 w-full h-20 text-lg rounded-lg font-medium hover:bg-red-600 hover:text-white transition">
              Profile
            </button>
          </Link>

          <Link href="/massageshop" className="md:col-span-2 md:col-start-3 md:row-start-2">
            <button className="bg-black text-white w-full h-20 text-xl rounded-lg font-medium shadow-md hover:bg-gray-800 transition mb-24 md:mb-0">
              Massage Shops
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
