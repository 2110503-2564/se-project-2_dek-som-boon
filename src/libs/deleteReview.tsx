import { ReviewJson } from "../../interface";
export const deleteReview = async (reviewId: string, token: string): Promise<ReviewJson> => {
    const res = await fetch(`http://localhost:5000/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error("Failed to delete review");
    }
    return await res.json();
  };