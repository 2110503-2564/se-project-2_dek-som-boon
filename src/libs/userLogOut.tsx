"use client";
import { useRouter } from "next/navigation";

export default function useUserLogOut() {
  const router = useRouter();

  return (onLogout?: () => void) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (onLogout) onLogout(); // run re-render callback
    router.push("/");
  };
}
