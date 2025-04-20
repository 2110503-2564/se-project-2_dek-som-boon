"use client";
import deleteShop from "@/libs/deleteShop";
import { MassageItem } from "../../interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import Image from "next/image";

export default function ShopItem({
  shop,
  showDeletePopup,
  isAdmin,
}: {
  shop: MassageItem;
  showDeletePopup: Function;
  isAdmin: Boolean;
}) {
  const router = useRouter(); // ✅ แก้ตรงนี้

  return (
    <div
      onClick={() => router.push(`/massageshop/${shop._id}`)}
      className="relative group hover:cursor-pointer mb-4"
    >
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition relative">
        {/* Image + Info */}
        <div className="flex items-center flex-grow mr-4">
          <div className="w-24 h-24 flex-shrink-0 mr-4 hidden md:block">
            <Image
              src="/image/massageshop.jpg"
              alt="Shop"
              className="w-full h-full object-cover rounded-md"
              width={1080}
              height={1080}
            />
          </div>
          <div className="text-sm text-left">
            <h2 className="text-lg font-semibold text-gray-800">{shop.name}</h2>
            <div className="flex items-center mt-1">
              <span className="text-gray-700 mr-1">
                {shop.averageRating.toFixed(1)}
              </span>
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  style={{
                    color:
                      index < Math.round(shop.averageRating)
                        ? "#facc15"
                        : "#e5e7eb",
                    fontSize: "1rem",
                  }}
                />
              ))}
              <span className="ml-1 text-gray-500 text-xs">
                ({shop.reviewerCount})
              </span>
            </div>
            <p className="text-gray-500 mt-1">Address:{shop.address}</p>
            <p className="text-gray-500">Tel: {shop.tel}</p>
            <p className="text-gray-500">
              Open: {shop.openTime} - {shop.closeTime}
            </p>
          </div>
        </div>

        {/* Button */}
        <div
          className="flex-shrink-0 z-20 relative"
          onClick={(e) => e.stopPropagation()} // ⛔ prevent router.push()
        >
          <div className="flex flex-col space-y-2">
            <div className="w-[90px] h-[90px] flex-shrink-0 block md:hidden">
            <Image
              src="/image/massageshop.jpg"
              alt="Shop"
              className="w-full h-full object-cover rounded-md"
              width={1080}
              height={1080}
            />
          </div>
            {!isAdmin ? (
              <Link href={`/reservation?shopId=${shop._id}`}>
                <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg transition cursor-pointer">
                  Reserve
                </button>
              </Link>
            ) : (
              <button
                onClick={() => showDeletePopup(shop._id)}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg transition cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
