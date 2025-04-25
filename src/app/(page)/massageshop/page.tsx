"use client"
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmPopup from "@/components/ConfirmPopup";
import { MassageJson } from "../../../../interface";
import getShops from "@/libs/getShops";
import ShopItem from "@/components/ShopItem";
import deleteShop from "@/libs/deleteShop";
import getReservations from "@/libs/getReservations";
import CreateShopPopup from "@/components/CreateShopPopup";
import createShop from "@/libs/createShop";

export default function massageShopPage() {
    const [shops, setShops] = useState<MassageJson | null>(null);
    const [selecting2Delete, setSelecting2Delete] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState<Boolean>(false);
    const [showAddShop, setShowAddShop] = useState<Boolean>(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const checkAdmin = (): boolean => {
    try {
        const userString = localStorage.getItem("user");
        if (userString) {
        const user = JSON.parse(userString);
        return user.role === "admin";
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
    return false;
    };

    const handleShowDelete = (id:string) => {
        setShowDelete(true);
        setSelecting2Delete(id);
    }

    const fetchShops = async () => {
        try {
            const shopsData: MassageJson = await getShops();
            setShops(shopsData);
        } 
        catch (error) {
            console.error("Error fetching shops:", error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsAdmin(checkAdmin);
        fetchShops();
    }, []);

    const handleDelete = async () => {
        if(selecting2Delete != null){
            try {
            const token = localStorage.getItem("token");
            if(token){
                await deleteShop(token, selecting2Delete);
            }
            setShowDelete(false);
            setSelecting2Delete(null);
            const shopsData = await getShops();
            setShops(shopsData);
            alert("Delete shop successful!");
            } catch (error) {
            console.error("Error deleting shop:", error);
            }
        }
    };

    const handleAdd = async (
        name: string, 
        address: string, 
        tel: string, 
        openTime: string, 
        closeTime: string
    ) => {
        try {
            const token = localStorage.getItem("token");
            if(token){
                const data = await createShop(token, name, address, tel, openTime, closeTime);
                if(data){
                    alert("Shop added successful!");
                    setShowAddShop(false);
                    fetchShops()
                }
            }
        } catch (error) {
            console.error("Error to add shop:", error);
        }
    };
    
    const handleCloseDelete = () => {
        setShowDelete(false);
        setSelecting2Delete(null);
    };
    const handleCloseAdd = () => {
        setShowAddShop(false);
    };
    
    if (loading) {
        return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <CircularProgress sx={{ color: "rgb(220, 38, 38)" }} size={60} thickness={5} />
            <p className="text-lg font-semibold text-gray-600">Loading...</p>
        </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-10 w-full pt-20 md:pt-10">
                <div className="w-full max-w-4xl space-y-4 mt-16 mb-16 md:mb-0">
                    <div className="flex flex-row space-x-4">
                        {isAdmin && (
                            <button onClick={()=>{setShowAddShop(true)}} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-700 hover:cursor-pointer transition">
                                Add Massage shop
                            </button>
                        )}
                    </div>
                    {shops ? (
                        shops.data.map((shop) => <ShopItem key={shop._id} shop={shop} showDeletePopup={(e:string)=>{handleShowDelete(e)}} isAdmin={isAdmin}/>)
                    ) : (
                        <p className="text-gray-500">Loading shops...</p>
                    )}
                </div>
                
                
                {showDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-40">
                    <ConfirmPopup onClose={handleCloseDelete} onDelete={handleDelete} title={"Are you sure you want to delete this shop?"}/>
                    {/* <p>{selecting2Delete}</p> */}
                </div>
                )}

                {showAddShop && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-40">
                    {/* <ConfirmPopup onClose={handleCloseDelete} onDelete={handleDelete} title={"Are you sure you want to delete this shop?"}/> */}
                    {/* <p>{selecting2Delete}</p> */}
                    <CreateShopPopup onClose={handleCloseAdd} onCreate={handleAdd}/>
                </div>
                )}
        </div>
    );
}