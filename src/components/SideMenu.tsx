"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Map, Calendar, User, LogOut, Plus } from "lucide-react";
import useUserLogOut from "@/libs/userLogOut";

export default function SideMenu({ setLogin }: { setLogin: (login: boolean) => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const logout = useUserLogOut();
  const pathname = usePathname();
  
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

  const handleLogout = () => {
    logout(() => setIsLoggedIn(false));
    setLogin(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    setIsAdmin(checkAdmin);
  }, []);

  return (
    <>
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 px-4 flex justify-between md:hidden">
        <NavItemMobile href="/" pathname={pathname} icon={Home} label="Home" />
        <NavItemMobile href="/massageshop" pathname={pathname} icon={Map} label="Shops" />
        
        <div className="relative -top-6">
          <Link href="/reservation">
            <button className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Plus size={28} />
            </button>
          </Link>
        </div>
  
        <NavItemMobile href="/myreservation" pathname={pathname} icon={Calendar} label="My reserve" />
        <NavItemMobile href="/profile" pathname={pathname} icon={User} label="Profile" />
      </div>
  
      <div className="fixed w-70 h-screen bg-white border-gray-200 border-r pt-22 md:flex flex-col hidden">
        <div className="px-4 py-2">
          <Link href="/reservation">
            <button className="hover:cursor-pointer w-full p-3 text-white bg-red-600 border rounded-lg hover:bg-red-500 flex items-center gap-2 transition">
              <Plus size={20} />
              <span>Make Reservation</span>
            </button>
          </Link>
        </div>
  
        <nav className="flex-1 px-4 py-2 space-y-2">
          <NavItem href="/" pathname={pathname} icon={Home} label="Home" />
          <NavItem href="/massageshop" pathname={pathname} icon={Map} label="Massage shops" />
          <NavItem href="/myreservation" pathname={pathname} icon={Calendar} label={isAdmin ? "All reservations" : "My reservations"} />
          <NavItem href="/profile" pathname={pathname} icon={User} label="Profile" />
        </nav>

      {isLoggedIn && (
        <div className="px-4 py-2 pb-4">
          <button
            onClick={handleLogout}
            className="px-16 w-full flex items-center justify-between p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-100 hover:cursor-pointer transition-colors"
          >
            <span>Logout</span>
            <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
    </>
);
}

type NavItemProps = {
  href: string;
  pathname: string;
  icon: React.ElementType;
  label: string;
};

function NavItem({ href, pathname, icon: Icon, label }: NavItemProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? "bg-gray-100 text-red-600" : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"}`}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}

function NavItemMobile({ href, pathname, icon: Icon, label }: NavItemProps) {
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`flex flex-col items-center text-xs transition-colors ${isActive ? "text-red-600" : "text-gray-500 hover:text-gray-900"}`}
    >
      <Icon size={24} />
      {label}
    </Link>
  );
}