import StarIcon from "@mui/icons-material/Star";

type ReviewPopupProps = {
  rating: number;
  comment: string;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ReviewPopup({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onCancel,
  onSubmit
}: ReviewPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="block text-lg font-semibold mb-2 w-full text-center">Review</h3>

        {/* Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              onClick={() => onRatingChange(s)}
              style={{
                cursor: "pointer",
                fontSize: "2rem",
                color: s <= rating ? "#facc15" : "#d1d5db",
              }}
            />
          ))}
        </div>

        {/* Comment box */}
        <div className="mb-4">
          <label className="block text-base font-semibold text-black mb-1">
            Comment
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="w-full p-2 border border-gray-200 bg-gray-50 rounded"
            placeholder="Write your review here..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-500 hover:cursor-pointer transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}