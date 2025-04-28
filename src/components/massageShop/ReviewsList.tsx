import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { Review, User } from "../../../interface";

type ReviewsListProps = {
  comments: Review[];
  user: User | null;
  onEditReview: (review: Review) => void;
  onShowDelete: (review: Review) => void;
}

export default function ReviewsList({ 
  comments, user, onEditReview, onShowDelete 
}: ReviewsListProps) {
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  
  const canEdit = (commentUserId: string) => {
    if (!user) return false;
    return user._id === commentUserId;
  };
  const canDelete = (commentUserId: string) => {
    if (!user) return false;
    return user._id === commentUserId ||user.role==="admin";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-800 text-lg">User review</h2>
        {user && (
          <button
            onClick={() => setShowOnlyMine(!showOnlyMine)}
            className="text-sm bg-white border border-gray-300 hover:bg-gray-100 px-4 py-1 rounded hover:cursor-pointer"
          >
            {showOnlyMine ? "All reviews" : "Your review"}
          </button>
        )}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg mt-2">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          [...comments]
            .filter(c => !showOnlyMine || (user && c.user._id === user._id))
            .reverse()
            .map(c => (
              <div
                key={c._id}
                className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-sm text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{c.user.name}</p>
                  <p className="text-gray-600">{c.comment}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <StarIcon
                        key={i}
                        style={{
                          fontSize: "1rem",
                          color: i <= Math.round(c.score) ? "#fbbf24" : "#d1d5db",
                        }}
                      />
                    ))}
                  </div>
                  
                  {canEdit(c.user._id) && (
                    <>
                      <button
                        onClick={() => onEditReview(c)}
                        className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-400 hover:cursor-pointer"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  {canDelete(c.user._id) && (
                    <>
                      <button
                        onClick={() => onShowDelete(c)}
                        className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-500 hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}