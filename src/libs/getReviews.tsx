import { ReviewJson } from "../../interface";

export const getAllReviews = async (shopId: string): Promise<ReviewJson> => {
    const res = await fetch(`http://localhost:5000/api/v1/massage-shops/${shopId}/reviews`);
    if (!res.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await res.json();
  };