import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { Review } from "../../../interface";

type ReviewSummaryProps = {
  comments: Review[];
}

export default function ReviewSummary({ comments }: ReviewSummaryProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  const averageScore = comments.length > 0
    ? (comments.reduce((s, c) => s + c.score, 0) / comments.length)
    : 0;
    
  const formattedAvg = averageScore.toFixed(1);
  
  return (
    <div>
      <h2 className="font-semibold text-gray-800 text-lg">Review Summary</h2>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Bar chart for ratings */}
        <div className="space-y-1 text-sm">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = comments.filter((c) => c.score === score).length;
            const percent = (count / comments.length) * 100 || 0;
            const isHovered = hoveredRating === score;

            return (
              <div
                key={score}
                className="flex items-center space-x-2 relative"
                onMouseEnter={() => setHoveredRating(score)}
                onMouseLeave={() => setHoveredRating(null)}
              >
                <span className="w-4">{score}</span>
                <div className="flex-1 bg-gray-200 h-2 rounded relative">
                  <div
                    className="h-2 bg-yellow-400 rounded"
                    style={{ width: `${percent}%` }}
                  />
                  {isHovered && (
                    <div className="absolute left-full -top-3 ml-5 z-10">
                      <div className="relative inline-block">
                        <div className="absolute -left-2 top-1/2 -translate-y-1 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-gray-300" />
                        <div className="bg-white border border-gray-300 rounded px-2 py-1 text-sm shadow text-center min-w-[40px]">
                          {count}/{comments.length}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Average score display */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-yellow-500">{formattedAvg}</span>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                style={{
                  color: i <= averageScore ? "#facc15" : "#e5e7eb",
                }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">{comments.length} Reviews</span>
        </div>
      </div>
    </div>
  );
}