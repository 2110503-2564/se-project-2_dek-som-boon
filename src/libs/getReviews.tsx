export default async function getReviews(id: string) {
    const res = await fetch(
      `https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}/reviews`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const json = await res.json();
    return json.data
};