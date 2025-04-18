import { ReviewJson } from "../../interface";
export const updateReview = async (
    reviewId: string,
    updatedData: {
      title?: string;
      text?: string;
      rating?: number;
    },
    token: string
  ): Promise<ReviewJson> => {
    const res = await fetch(`http://localhost:5000/api/v1/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) {
      throw new Error("Failed to update review");
    }
    return await res.json();
  };