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
import getUserProfile from "@/libs/getUserProfile";

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


export default function CommentPage() {
  const { id } = useParams();
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
    setShowForm(true);
    setNewComment(c.comment);
    setNewRating(c.score);
    setEditId(c._id);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(
      `https://antony-massage-backend-production.up.railway.app/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== reviewId));
    else alert("Failed to delete.");
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
            <img
              src={shop?.image || "/image/massageshop.jpg"}
              alt="Shop"
              className="w-full h-48 object-cover rounded-xl"
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
                <button className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-2 rounded-lg w-full hover:cursor-pointer transition">
                  Reserve
                </button>
              </Link>
            </div>
          </div>
        </div>



        {/* Review Summary */}
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
                }}
                className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-4 py-1 rounded"
              >
                {showForm ? "Cancel" : "Your review"}
              </button>
            )}
          </div>

          
          {showForm && (
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      onClick={() => setNewRating(s)}
                      style={{
                        cursor: "pointer",
                        color: s <= newRating ? "#fbbf24" : "#d1d5db",
                      }}
                    />
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500"
              >
                {editId ? "Update" : "Submit"}
              </button>
            </div>
          )}

          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
  {[...comments]
    .filter((c) => !showOnlyMine || c.user._id === user?._id)
    .reverse()
    .map((c) => (
      <div
        key={c._id}
        className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm text-sm"
      >
        
        <div>
          <p className="font-semibold text-gray-800">{c.user.name}</p>
          <p className="text-gray-600">{c.comment}</p>
        </div>

        
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

          
          {canEditOrDelete(c.user._id) && (
            <>
              <button
                onClick={() => handleEdit(c)}
                className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-500"
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
        className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold text-base py-3 rounded-full shadow-md transition">
          + Add a review
        </button>
      </div>

      
      <h2 className="text-2xl font-bold text-center mt-14 mb-6 text-gray-800 tracking-wide">
        Our หมอนวด
      </h2>

      
      <div className="relative w-full max-w-3xl mx-auto mt-8 mb-10">
      
      <button
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
      </button>

      <Swiper
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
    </div>
    {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-center mb-4">Review</h3>

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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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

      <div className="flex justify-between">
        <button
            onClick={() => setShowPopup(false)}
            className="bg-[#191945] text-white px-6 py-2 rounded font-semibold hover:bg-[#2c2c7a]"
          >
            Cancell
        </button>
        <button
            onClick={async () => {
              await handleSubmit();
              setShowPopup(false);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-500"
          >
            Post
          </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
