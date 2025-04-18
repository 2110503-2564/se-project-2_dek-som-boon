import { User } from "../../interface";
export default async function updateUser(updatedUser: Partial<User>, token: string | null)  {
    try {
        const response = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/users/${updatedUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                tel: updatedUser.tel,
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error("Error updating user:", error);
    }
}