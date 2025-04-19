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
  return (
    <div className="relative">
      <Link href={`/massageshop/${shop._id}/comment`} className="absolute inset-0 z-10" />
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm relative z-0">
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
            <span className="text-gray-700 mr-1">{shop.averageRating.toFixed(1)}</span>
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                style={{
                  color: index < shop.averageRating ? "#facc15" : "#e5e7eb",
                  fontSize: "1rem",
                }}
              />
            ))}
            <span className="ml-1 text-gray-500 text-xs">({shop.reviewerCount})</span>
          </div>

          {/* 📍 Address & Info */}
          <p className="text-gray-500 mt-1">{shop.address}</p>
          <p className="text-gray-500">Tel: {shop.tel}</p>
          <p className="text-gray-500">
            Open: {shop.openTime} - {shop.closeTime}
          </p>
        </div>

        {/* Button (right) */}
        <div className="ml-4 flex-shrink-0 z-20">
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
    </div>
  );
}
