export default async function deleteReservation(reservationId: string, token: string) {
    try {
      if (!token) {
        alert("You need to be logged in to delete a reservation.");
        return;
      }

      const response = await fetch(
        `https://antony-massage-backend-production.up.railway.app/api/v1/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const resText = await response.text();
      if (!response.ok) {
        console.error("API Error:", resText);
        throw new Error("Delete reservation failed");
      }
  
      return JSON.parse(resText);
    } catch (error) {
      throw error;
    }
  }
  