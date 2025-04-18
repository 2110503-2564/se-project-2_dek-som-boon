"use client";
import deleteShop from "@/libs/deleteShop";
import { MassageItem } from "../../interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function ShopItem({
  shop,
  showDeletePopup,
  isAdmin,
}: {
  shop: MassageItem;
  showDeletePopup: Function;
  isAdmin: Boolean;
}) {
  const [dummyRating, setDummyRating] = useState(0);
  const [dummyComments, setDummyComments] = useState(0);

  useEffect(() => {
    setDummyRating(Math.floor(Math.random() * 3) + 3); // 3–5 stars
    setDummyComments(Math.floor(Math.random() * 10) + 1); // 1–10 comments
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm">
      {/* Image (left) */}
      <div className="w-24 h-24 flex-shrink-0 mr-4">
        <img
          src="/image/massageshop.jpg" // Replace with shop.image if available
          alt="Shop"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Info (middle) */}
      <div className="flex-grow text-sm">
        <h2 className="text-lg font-semibold text-gray-800">{shop.name}</h2>

        {/* ⭐ Rating */}
        <div className="flex items-center mt-1">
          <span className="text-gray-700 mr-1">{dummyRating}</span>
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              style={{
                color: index < dummyRating ? "#facc15" : "#e5e7eb",
                fontSize: "1rem",
              }}
            />
          ))}
          <span className="ml-1 text-gray-500 text-xs">({dummyComments})</span>
        </div>

        {/* 💬 Comments */}
        <div className="flex items-center mt-1 text-gray-600 text-sm">
          <ChatBubbleOutlineIcon style={{ fontSize: "1rem", color: "#6b7280" }} />
          <span className="ml-1">{dummyComments} comments</span>
          <Link href={`/massageshop/${shop._id}/comment`}>
            <button className="ml-3 text-blue-600 hover:underline text-sm">
              View/Add Comment
            </button>
          </Link>
        </div>

        {/* 📍 Address & Info */}
        <p className="text-gray-500 mt-1">{shop.address}</p>
        <p className="text-gray-500">Tel: {shop.tel}</p>
        <p className="text-gray-500">
          Open: {shop.openTime} - {shop.closeTime}
        </p>
      </div>

      {/* Button (right) */}
      <div className="ml-4 flex-shrink-0">
        {!isAdmin ? (
          <Link href={`/reservation?shopId=${shop._id}`}>
            <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full transition">
              Reserve
            </button>
          </Link>
        ) : (
          <button
            onClick={() => showDeletePopup(shop._id)}
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-full transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
