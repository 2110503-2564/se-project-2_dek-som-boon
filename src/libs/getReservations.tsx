export default async function getReservations() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found");
        }
        
        const response = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/reservations", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch reservations: ${data.message || "Unknown error"}`);
        }

        return data.data;
    } catch (error) {
        console.error("Error during fetching reservations:", error);
    }
}