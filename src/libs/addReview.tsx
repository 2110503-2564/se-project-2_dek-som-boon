import { ReviewJson } from "../../interface";
export const createReview = async (
    shopId: string,
    reviewData: {
      title: string;
      text: string;
      rating: number;
    },
    token: string // JWT for authorization
  ): Promise<ReviewJson> => {
    const res = await fetch(`http://localhost:5000/api/v1/massage-shops/${shopId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      throw new Error("Failed to create review");
    }
    return await res.json();
  };