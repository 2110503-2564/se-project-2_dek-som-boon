export default async function addMassageTherapist(
    token: string, 
    name: string, 
    tel: string,
    birthdate: string,
    sex: string, 
    specialties: string[],
    availability: string
) {
    try {
        const response = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/$%7BmassageShopId%7D/therapists", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                tel:tel,
                birthdate:birthdate,
                sex:sex,
                specialties: specialties,
                availability: availability
            }),
        });
        const resText = await response.text();
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        console.log('Shop created successfully');
        return JSON.parse(resText);
    } catch (error) {
        console.error('Failed to create shop:', error);
        throw error;
    }
}
