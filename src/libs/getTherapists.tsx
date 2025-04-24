import { Therapist } from "../../interface";

export const getTherapists = async (shopId: string): Promise<Therapist[]> => {
    const res = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${shopId}/therapists`);
    if (!res.ok) {
      throw new Error("Failed to fetch therapists");
    }
    const json = await res.json();
    return json.data;
  };
