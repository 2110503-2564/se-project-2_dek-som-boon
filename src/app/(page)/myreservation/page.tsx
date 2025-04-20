"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReservationItem from "@/components/ReservationItem";
import { ReserveItem } from "../../../../interface";
import getReservations from "@/libs/getReservations";
import deleteReservation from "@/libs/deleteReservation";
import EditReservation from "@/components/EditReservation";
import updateReservation from "@/libs/updateReservation";
import dayjs, { Dayjs } from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmPopup from "@/components/ConfirmPopup";

export default function ReservationPage() {
  const [reservations, setReservations] = useState<ReserveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
  const [editingReservationShopId, setEditingReservationShopId] = useState<string | null>(null);
  const [editingReservationDate, setEditingReservationDate] = useState<Dayjs | null>(null);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deletingReservationId, setDeletingReservationId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    } catch (err) {
      console.error("Failed to parse user data", err);
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await getReservations();
        setReservations(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleEdit = (reservationId: string, reservationShopId: string, reservationDate: string) => {
    setEditingReservationId(reservationId);
    setEditingReservationShopId(reservationShopId);
    setEditingReservationDate(dayjs(reservationDate));
  };

  const handleDeleteClick = (reservationId: string) => {
    setDeletePopup(true);
    setDeletingReservationId(reservationId);
  };

  const handleDelete = async () => {
    if(deletingReservationId != null){
      try {
        const token = localStorage.getItem("token");
        await deleteReservation(deletingReservationId, token || "");
        
        setDeletePopup(false);
        setDeletingReservationId(null);
        const data = await getReservations();
        alert("Delete Reservation successful!");
        setReservations(data || []);
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const handleUpdate = async (reservationId: string, updatedData: any) => {
    try {
      const token = localStorage.getItem("token");
      await updateReservation({
        reservationId,
        ...updatedData,
        token: token || "",
      });
      const data = await getReservations();
      alert("Update Reservation successful!");
      setReservations(data || []);
      setEditingReservationId(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleCloseEdit = () => {
    setEditingReservationId(null);
    setEditingReservationShopId(null);
    setEditingReservationDate(null);
  };

  const handleCloseDelete = () => {
    setDeletePopup(false);
    setDeletingReservationId(null);
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
    <div className="flex flex-col items-center p-10 w-full pt-20 md:pt-10 mb-16 md:mb-0">
      <div className="w-full max-w-4xl space-y-4 mt-15">
      <div className="h-2 md:hidden"></div>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <ReservationItem
            key={reservation._id}
            reserve={reservation}
            onEdit={() =>
              handleEdit(
                reservation._id,
                reservation.massageShop._id,
                reservation.reserveDate
              )
            }
            onDelete={() => handleDeleteClick(reservation._id)}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <p className="text-center text-gray-600 text-lg">{!isAdmin ? "You don't have any reservations." : "Don't have any reservations."}</p>
      )}
      </div>

      {editingReservationId && editingReservationShopId && editingReservationDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <EditReservation
            reservationId={editingReservationId}
            reservationShopId={editingReservationShopId}
            reservationDate={editingReservationDate}
            onClose={handleCloseEdit}
            onUpdate={handleUpdate}
          />
        </div>
      )}

      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <ConfirmPopup onClose={handleCloseDelete} onDelete={handleDelete} title={"Are you sure you want to delete this reservation?"}/>
        </div>
      )}
    </div>
  );
}
