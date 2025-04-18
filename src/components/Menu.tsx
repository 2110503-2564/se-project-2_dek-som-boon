"use client";

import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import TopMenu from "./TopMenu";

export default function Menu(){
    const [isLogin, setIsLogin] = useState<Boolean>(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, []);

    function setLogin(login:Boolean){
        setIsLogin(login);
    }

    return(
        <>
            <SideMenu setLogin={setLogin}/>
            <TopMenu isLogin={isLogin}/>
        </>
    )
}