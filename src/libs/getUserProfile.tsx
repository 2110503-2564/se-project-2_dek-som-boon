export default async function getUserProfile(token:string){
    const response = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/auth/me",{
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`,
        }
    })
    if(!response.ok){
        throw new Error("Cannot get user profile")
    }
    return await response.json()
} 