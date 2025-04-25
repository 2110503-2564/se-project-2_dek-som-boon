import Link from "next/link";
import Image from "next/image";
import { MassageItem } from "../../../interface";

type ShopDetailsProps = {
  shop: MassageItem | null;
  shopId: string;
}

export default function ShopDetails({ shop, shopId }: ShopDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* Image */}
      <div className="flex justify-center">
        <Image
          src={"/image/massageshop.jpg"}
          alt="Shop"
          className="w-full h-48 object-cover rounded-xl"
          width="1920"
          height="1080"
        />
      </div>

      {/* Details and Reserve Button */}
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-gray-800">
            <span className="font-semibold">Address:</span> {shop?.address || "-"}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Open:</span> {shop?.openTime || "--:--"} - {shop?.closeTime || "--:--"}
          </p>
          <p className="text-gray-800">
            <span className="font-semibold">Tel:</span> {shop?.tel || "-"}
          </p>
        </div>

        <div className="pt-4">
          <Link href={`/reservation?shopId=${shopId}`}>
            <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-lg w-full hover:cursor-pointer transition">
              Reserve
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}