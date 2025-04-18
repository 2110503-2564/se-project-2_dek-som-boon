"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

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
  // your API returns { success: true, data: { ...user fields... } }
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

  // Fetch reviews for this shop
  const fetchReviews = async () => {
    const res = await fetch(
      `http://localhost:5000/api/v1/massage-shops/${id}/reviews`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const json = await res.json();
    setComments(json.data);
  };

  // Fetch current profile
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

  useEffect(() => {
    fetchReviews();
    fetchUser();
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
      ? `http://localhost:5000/api/v1/reviews/${editId}`
      : `http://localhost:5000/api/v1/massage-shops/${id}/reviews`;
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
      `http://localhost:5000/api/v1/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (res.ok) setComments((prev) => prev.filter((c) => c._id !== reviewId));
    else alert("Failed to delete.");
  };

  return (
    <div className="flex flex-col items-center p-10 w-full pt-20 md:pt-10">
      <h1 className="text-4xl font-bold text-center mb-4">💬 COMMENTS</h1>
      <Link href="/massageshop">
        <button className="mb-6 bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded">
          ← Back to Shops
        </button>
      </Link>

      {/* Add/Edit Form Toggle */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
          setNewComment("");
          setNewRating(0);
        }}
        className="mb-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded"
      >
        {showForm ? "Cancel" : "+ Add Comment & Rating"}
      </button>

      {showForm && (
        <div className="w-full max-w-2xl bg-gray-50 p-6 rounded shadow mb-6">
          <div className="mb-4">
            <label className="block mb-1">Rating:</label>
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
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Write your comment..."
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Submit"}
          </button>
        </div>
      )}

      <div className="w-full max-w-2xl space-y-4">
      {[...comments].reverse().map((c) => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-lg shadow-sm p-4 shadow flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{c.user.name}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon
                    key={s}
                    style={{
                      color: s <= c.score ? "#fbbf24" : "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mb-2">{c.comment}</p>
            {canEditOrDelete(c.user._id) && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
