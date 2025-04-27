import { Therapist } from "../../interface";

export const getTherapistsByDate = async (shopId: string, workingDate: string): Promise<Therapist[]> => {
    const res = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${shopId}/therapists/?date=${workingDate}`);
    if (!res.ok) {
      throw new Error("Failed to fetch therapists");
    }
    const json = await res.json();
    return json.data;
  };
