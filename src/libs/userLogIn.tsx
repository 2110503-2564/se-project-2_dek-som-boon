export default async function userLogIn(userEmail: string, userPassword: string) {
    try {
        // 1. Login request
        const loginResponse = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: userEmail,
                password: userPassword
            })
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginData.message || "Unknown error"}`);
        }

        const token = loginData.token;
        localStorage.setItem("token", token); 

        // 2. Get user data with token
        const userResponse = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data: ${userData.message || "Unknown error"}`);
        }
        localStorage.setItem("user", JSON.stringify(userData.data)); 
        console.log("User data:", userData.data);   
        return userData; 
    } catch (error) {
        console.error("Error during login or fetching user info:", error);
    }
}
