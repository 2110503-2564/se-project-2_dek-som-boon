import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import { MassageItem, Review } from "../../../interface";

type ShopHeaderProps = {
  shop: MassageItem | null;
  comments: Review[];
}

export default function ShopHeader({ shop, comments }: ShopHeaderProps) {
  const averageScore = comments.length > 0
    ? (comments.reduce((s, c) => s + c.score, 0) / comments.length).toFixed(1)
    : "0.0";
    
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">{shop?.name || "Loading..."}</h1>
        <Link href="/massageshop">
          <button className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg hover:cursor-pointer transition">
            ← Go back
          </button>
        </Link>
      </div>

      <div className="flex items-center">
        <span className="text-gray-700 text-sm mr-2">{averageScore}</span>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon 
            key={i} 
            style={{ 
              fontSize: "1rem", 
              color: i <= (Number(averageScore) || 0) ? "#facc15" : "#e5e7eb" 
            }} 
          />
        ))}
        <span className="text-gray-500 text-sm ml-2">({comments.length})</span>
      </div>
    </div>
  );
}