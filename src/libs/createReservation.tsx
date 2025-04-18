export interface ReservationPayload {
    massageShopId: string;
    reserveDate: string; // ISO string format (e.g., 2025-03-23T14:00:00Z)
    token: string;
  }
  
  export default async function createReservation({
    massageShopId,
    reserveDate,
    token,
  }: ReservationPayload) {
    console.log("createReservation", massageShopId, reserveDate, token);
    try {
      const response = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${massageShopId}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reserveDate }),
      });
  
      const resText = await response.text(); // อ่าน raw response
      if (!response.ok) {
        console.error("API Error:", resText); // ✅ Log error จาก API
        // throw new Error("Reservation failed");
        throw new Error(JSON.parse(resText).message);
      }
  
      return JSON.parse(resText); // ถ้า response.ok จริง ค่อย parse เป็น JSON
    } catch (error) {
      throw error;
    }
  }
  

  