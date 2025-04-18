"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

interface Comment {
  username: string;
  text: string;
  rating: number;
}

export default function CommentPage() {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments([
      { username: "Alice", text: "Super relaxing experience!", rating: 5 },
      { username: "Bob", text: "Nice and clean, very friendly staff.", rating: 4 },
    ]);
  }, []);

  const handleSubmit = () => {
    if (newUsername && newComment && newRating > 0) {
      setComments((prev) => [
        ...prev,
        { username: newUsername, text: newComment, rating: newRating },
      ]);
      setNewUsername("");
      setNewComment("");
      setNewRating(0);
      setShowForm(false);
    } else {
      alert("Please enter name, rating and comment.");
    }
  };

  return (
    <div className="flex flex-col items-center p-10 w-full pt-20 md:pt-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">💬 COMMENT</h1>

        {/* Back Button */}
        <div className="flex justify-center mb-6">
        <Link href="/massageshop">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg shadow transition">
            ← Back to Massage Shops
            </button>
        </Link>
        </div>

      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">💬 COMMENT</h1>

        {/* Add Comment Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg shadow transition"
          >
            {showForm ? "Cancel" : "+ Add Comment & Rating"}
          </button>
        </div>

        {/* Comment Form */}
        {showForm && (
          <div className="bg-gray-50 border rounded-lg p-6 space-y-4">
            <div>
              <label className="block font-semibold mb-1">Your Name:</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Your Rating:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    onClick={() => setNewRating(star)}
                    style={{
                      color: star <= newRating ? "#fbbf24" : "#d1d5db",
                      cursor: "pointer",
                      fontSize: "2rem",
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Your Comment:</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your experience..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-500 text-white font-medium px-6 py-2 rounded-lg shadow transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Comment List */}
        <h2 className="text-2xl font-semibold text-gray-800">All Comments</h2>
        <div className="space-y-4">
          {comments.map((c, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-800">{c.username}</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      style={{
                        color: star <= c.rating ? "#fbbf24" : "#d1d5db",
                        fontSize: "1.1rem",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
