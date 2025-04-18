"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from "react";
import ConfirmPopup from "@/components/ConfirmPopup";
import Image from "next/image";

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
  };
  comment: string;
  score: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
}

interface Shop {
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  tel: string;
  image?: string;
}

async function getUserProfile(token: string): Promise<User> {
  const res = await fetch(
    "https://antony-massage-backend-production.up.railway.app/api/v1/auth/me",
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Cannot get user profile");
  const json = await res.json();
  return json.data;
}

export default function CommentPage() {
  const { id } = useParams(); // massageShopId
  const [comments, setComments] = useState<Comment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDelete, setShowDelete] = useState<Boolean>(false);
  const [selecting2Delete, setSelecting2Delete] = useState<string | null>(null);

  const fetchReviews = async () => {
    const res = await fetch(
      `https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}/reviews`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const json = await res.json();
    setComments(json.data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const prof = await getUserProfile(token);
      setUser(prof);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShop = async () => {
    try {
      const res = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}`);
      const json = await res.json();
      setShop(json.data);
    } catch (err) {
      console.error("Failed to fetch shop info", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchUser();
    fetchShop();
  }, [id]);

  const canEditOrDelete = (commentUserId: string) => {
    if (!user) return false;
    return user._id === commentUserId || user.role === "admin";
  };

  const handleSubmit = async () => {
    if (!newComment || newRating === 0) {
      return alert("Please fill out all fields.");
    }
    const payload = { comment: newComment, score: newRating };
    const url = editId
      ? `https://antony-massage-backend-production.up.railway.app/api/v1/reviews/${editId}`
      : `https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}/reviews`;
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setShowForm(false);
      setNewComment("");
      setNewRating(0);
      setEditId(null);
      fetchReviews();
    } else {
      alert("Something went wrong.");
    }
  };

  const handleEdit = (c: Comment) => {
    setShowPopup(true);
    setNewComment(c.comment);
    setNewRating(c.score);
    setEditId(c._id);
  };

  const handleShowDelete = (c: Comment) => {
    setShowDelete(true);
    setSelecting2Delete(c._id);
}

  const handleDelete = async () => {
    // if (!confirm("Delete this comment?")) return;
    const res = await fetch(
      `https://antony-massage-backend-production.up.railway.app/api/v1/reviews/${selecting2Delete}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setShowDelete(false);
    setSelecting2Delete(null);
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== selecting2Delete));
    else alert("Failed to delete.");
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelecting2Delete(null);
};

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pt-[140px] px-4 md:px-10">
      <div className="w-full max-w-3xl space-y-4">

        {/* Header + Go Back */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{shop?.name || "Loading..."}</h1>
          <Link href="/massageshop">
            <button className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg hover:cursor-pointer transition">
              ← Go back
            </button>
          </Link>
        </div>

        {/* Star Rating Below Name */}
        <div className="flex items-center">
          <span className="text-gray-700 text-sm mr-2">
            {comments.length > 0
              ? (comments.reduce((s, c) => s + c.score, 0) / comments.length).toFixed(1)
              : "0.0"}
          </span>
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} style={{ fontSize: "1rem", color: i <= (comments.reduce((s, c) => s + c.score, 0) / comments.length || 0) ? "#facc15" : "#e5e7eb" }} />
          ))}
          <span className="text-gray-500 text-sm ml-2">({comments.length})</span>
        </div>

        {/* Shop Top Info */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* 🖼 Image */}
          <div className="flex justify-center">
            <Image
              src={shop?.image || "/image/massageshop.jpg"}
              alt="Shop"
              className="w-full h-48 object-cover rounded-xl"
              width="1920"
              height="1080"
            />
          </div>

          {/* 📄 Detail + 🔘 Button aligned to bottom */}
          <div className="flex flex-col justify-between">
            {/* Top: Text Info */}
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

            {/* Bottom: Reserve Button */}
            <div className="pt-4">
              <Link href={`/reservation?shopId=${id}`}>
                <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-lg w-full hover:cursor-pointer transition">
                  Reserve
                </button>
              </Link>
            </div>
          </div>
        </div>



        {/* Review Summary */}
        <h2 className="font-semibold text-gray-800 text-lg">Review Summary</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-1 text-sm">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = comments.filter((c) => c.score === score).length;
              const percent = (count / comments.length) * 100 || 0;
              return (
                <div key={score} className="flex items-center space-x-2">
                  <span className="w-4">{score}</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-yellow-500">
              {comments.length > 0
                ? (comments.reduce((s, c) => s + c.score, 0) / comments.length).toFixed(1)
                : "0.0"}
            </span>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarIcon key={i} style={{ color: i <= (comments.reduce((s, c) => s + c.score, 0) / comments.length || 0) ? "#facc15" : "#e5e7eb" }} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{comments.length} Reviews</span>
          </div>
        </div>

        {/* User Review Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-800 text-lg">User review</h2>
            {user && (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditId(null);
                  setNewComment("");
                  setNewRating(0);
                  setShowOnlyMine(!showOnlyMine);
                }}
                className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-4 py-1 rounded  hover:cursor-pointer"
              >
                {showForm ? "Cancel" : "Your review"}
              </button>
            )}
          </div>
          

          {/* Review List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
  {[...comments]
    .filter((c) => !showOnlyMine || c.user._id === user?._id)
    .reverse()
    .map((c) => (
      <div
        key={c._id}
        className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm text-sm"
      >
        {/* 👤 User Info + Comment */}
        <div>
          <p className="font-semibold text-gray-800">{c.user.name}</p>
          <p className="text-gray-600">{c.comment}</p>
        </div>

        {/* ⭐ Rating + Buttons */}
        <div className="flex items-center space-x-2">
          {/* ⭐ Stars */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                style={{
                  fontSize: "1rem",
                  color: i <= Math.round(c.score) ? "#fbbf24" : "#d1d5db",
                }}
              />
            ))}
          </div>

          {/* ✏️ Edit / ❌ Delete */}
          {canEditOrDelete(c.user._id) && (
            <>
              <button
                onClick={() => handleEdit(c)}
                className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-400 hover:cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleShowDelete(c)}
                className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-500 hover:cursor-pointer"
              >
                Del
              </button>
            </>
                  )}
                </div>
              </div>
            ))}
        </div>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-10 px-4 md:px-0">
        <button 
        onClick={() => {
          setShowPopup(true);
          setEditId(null);
          setNewComment("");
          setNewRating(0);
        }}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold text-base py-3 rounded-lg shadow-md transition hover:cursor-pointer">
          Add a review
        </button>
      </div>
      <div className="mb-10"></div>
      {/* 🧑‍ Our หมอนวด Title */}
      {/* <h2 className="text-2xl font-bold text-center mt-14 mb-6 text-gray-800 tracking-wide">
        Our หมอนวด
      </h2> */}

      {/* 🌀 Swiper Carousel */}
      {/* <div className="relative w-full max-w-3xl mx-auto mt-14"> */}
      {/* Arrows */}
      {/* <button
        ref={prevRef}
        className="absolute z-10 left-[-30px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100"
      >
        ←
      </button>
      <button
        ref={nextRef}
        className="absolute z-10 right-[-30px] top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-gray-100"
      >
        →
      </button> */}

      {/* <Swiper
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
        {[1, 2, 3, 4, 5].map((i) => (
          <SwiperSlide key={i}>
            <div className="w-[180px] bg-white border rounded-xl shadow-md px-4 py-6 text-center transition hover:shadow-lg mx-auto">
              <img
                src="/image/antony.jpg"
                alt="Therapist"
                className="w-20 h-20 mx-auto rounded-full object-cover mb-4 border-2 border-gray-300"
              />
              <h3 className="font-semibold text-base text-gray-800">Ant Man Uni</h3>
              <ul className="text-sm mt-3 text-left list-disc ml-6 text-gray-600 leading-relaxed">
                <li>ความเชี่ยวชาญ 1</li>
                <li>ความเชี่ยวชาญ 2</li>
                <li>ความเชี่ยวชาญ 3</li>
              </ul>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div> */}

    {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm backdrop-brightness-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
    <h3 className="block text-lg font-semibold mb-2 w-full text-center">Review</h3>

      {/* ⭐ Rating */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon
            key={s}
            onClick={() => setNewRating(s)}
            style={{
              cursor: "pointer",
              fontSize: "2rem",
              color: s <= newRating ? "#facc15" : "#d1d5db",
            }}
          />
        ))}
      </div>

      {/* 📝 Comment box */}
      <div className="mb-4">
          <label className="block text-base font-semibold text-black mb-1">
            Comment
          </label>
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border border-gray-200 bg-gray-50 rounded"
          placeholder="Write your review here..."
        />
      </div>

      {/* ❌ Cancel / ✅ Post */}
      <div className="flex gap-4">
        <button
            onClick={() => setShowPopup(false)}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition"
          >
            Cancel
        </button>
        <button
            onClick={async () => {
              await handleSubmit();
              setShowPopup(false);
            }}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-500 hover:cursor-pointer transition"
          >
            Post
          </button>
          </div>
        </div>
      </div>
    )}

    {/* delete pop up */}
    {showDelete && (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <ConfirmPopup onClose={handleCloseDelete} onDelete={handleDelete} title={"Are you sure you want to delete this comment?"}/>
          {/* <p>{selecting2Delete}</p> */}
      </div>
      )}
    </div>
  );
}
