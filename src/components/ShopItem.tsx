"use client";
import deleteShop from "@/libs/deleteShop";
import { MassageItem } from "../../interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
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
  return (
    <Link className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-50" href={`/massageshop/${shop._id}`}>
      {/* Clickable Area (Image + Info) */}
      {/* <Link
        href={`/massageshop/${shop._id}`}
        className="flex items-center flex-grow mr-4 no-underline rounded-lg transition p-2"
      > */}
      <div className="flex items-center flex-grow mr-4 no-underline rounded-lg transition p-2">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 mr-4">
          <Image
            src="/image/massageshop.jpg" // Replace with shop.image if available
            alt="Shop"
            className="w-full h-full object-cover rounded-md"
            width={1080}
            height={1080}
          />
        </div>

        {/* Info */}
        <div className="text-sm text-left">
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

          {/* 💬 Comments */}
          {/* <div className="flex items-center mt-1 text-gray-600 text-sm">
            <ChatBubbleOutlineIcon style={{ fontSize: "1rem", color: "#6b7280" }} />
            <span className="ml-1">{shop.reviewerCount} comments</span>
          </div> */}

          {/* 📍 Address & Info */}
          <p className="text-gray-500 mt-1">{shop.address}</p>
          <p className="text-gray-500">Tel: {shop.tel}</p>
          <p className="text-gray-500">
            Open: {shop.openTime} - {shop.closeTime}
          </p>
        </div>
      {/* </Link> */}
      </div>

      {/* Button Area */}
      <div className="flex-shrink-0 z-20">
        {!isAdmin ? (
          <Link href={`/reservation?shopId=${shop._id}`}>
            <button className="bg-red-600 hover:bg-red-500 hover:cursor-pointer text-white px-5 py-2 rounded-lg transition">
              Reserve
            </button>
          </Link>
        ) : (
          <button
            onClick={() => showDeletePopup(shop._id)}
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg transition"
          >
            Delete
          </button>
        )}
      </div>
    </Link>
  );
}
