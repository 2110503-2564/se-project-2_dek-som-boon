"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Therapist, User, MassageItem, Review } from "../../../../../interface";
import { getTherapists } from "@/libs/getTherapists";
import addMassageTherapist from "@/libs/addMassageTherapist";
import getUserProfile from "@/libs/getUserProfile";
import ConfirmPopup from "@/components/ConfirmPopup";
import AddMassageTherapistPopup from "@/components/AddMassageTherapistPopup";
import EditMassageTherapistPopup from "@/components/EditMassageTherapistPopup";

// New components
import ShopHeader from "@/components/massageShop/ShopHeader";
import ShopDetails from "@/components/massageShop/ShopDetails";
import ReviewSummary from "@/components/massageShop/ReviewSummary";
import ReviewsList from "@/components/massageShop/ReviewsList";
import TherapistList from "@/components/massageShop/TherapistList";
import ReviewPopup from "@/components/massageShop/ReviewPopup";
import dayjs from "dayjs";
import updateMassageTherapist from "@/libs/updateMassageTherapist";

export default function MassageShopPage() {
  const { id } = useParams(); // massageShopId
  const router = useRouter();
  
  // State
  const [shop, setShop] = useState<MassageItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Reviews state
  const [comments, setComments] = useState<Review[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selecting2Delete, setSelecting2Delete] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Therapist state
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [showDeleteTherapist, setShowDeleteTherapist] = useState(false);
  const [selecting2DeleteTherapist, setSelecting2DeleteTherapist] = useState<string | null>(null);
  const [editingTherapistName, setEditingTherapistName] = useState<string>("");
  const [editingTherapistTel, setEditingTherapistTel] = useState<string>("");
  const [editingTherapistBirthdate, setEditingTherapistBirthdate] = useState<string>("");
  const [editingTherapistSex, setEditingTherapistSex] = useState<string>("");
  const [editingTherapistSpecialties, setEditingTherapistSpecialties] = useState<string[]>([]);
  const [editingTherapistAvailability, setEditingTherapistAvailability] = useState<string[]>([]);
  const [editingTherapistId, setEditingTherapistId] = useState<string>("");
  const [showEditTherapistPopup, setShowEditTherapistPopup] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    fetchReviews();
    fetchUser();
    fetchShop();
    fetchTherapists();
    
    // Check if user is admin
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setIsAdmin(userData.role === "admin");
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}/reviews`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const json = await res.json();
      setComments(json.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const prof = await getUserProfile(token);
      setUser(prof.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchShop = async () => {
    try {
      const res = await fetch(`https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}`);
      const json = await res.json();
      setShop(json.data);
    } catch (err) {
      console.error("Failed to fetch shop info", err);
    }
  };

  const fetchTherapists = async () => {
    try {
      const data = await getTherapists(id as string);
      setTherapists(data);
    } catch (err) {
      console.error("Failed to fetch therapists", err);
    }
  };

  // Review handlers
  const handleShowAddReview = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setShowPopup(true);
    setEditId(null);
    setNewComment("");
    setNewRating(0);
  };

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      return alert("Please fill out rating.");
    }
    
    const payload = { comment: newComment, score: newRating };
    const url = editId
      ? `https://antony-massage-backend-production.up.railway.app/api/v1/reviews/${editId}`
      : `https://antony-massage-backend-production.up.railway.app/api/v1/massage-shops/${id}/reviews`;
    const method = editId ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        setShowPopup(false);
        setNewComment("");
        setNewRating(0);
        setEditId(null);
        fetchReviews();
      } else {
        alert("The comment must be less than 250 words.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const handleEditReview = (review: Review) => {
    setShowPopup(true);
    setNewComment(review.comment);
    setNewRating(review.score);
    setEditId(review._id);
  };

  const handleShowDeleteReview = (review: Review) => {
    setShowDelete(true);
    setSelecting2Delete(review._id);
  };

  const handleDeleteReview = async () => {
    try {
      const res = await fetch(
        `https://antony-massage-backend-production.up.railway.app/api/v1/reviews/${selecting2Delete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      
      setShowDelete(false);
      setSelecting2Delete(null);
      
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== selecting2Delete));
      } 
      alert("Delete review successful!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  // Therapist handlers
  const handleShowAddTherapist = () => {
    setShowAddTherapist(true);
  };

  const handleShowDeleteTherapist = (therapist: Therapist) => {
    setShowDeleteTherapist(true);
    setSelecting2DeleteTherapist(therapist._id);
  };

  const handleAddTherapist = async (
    name: string, 
    tel: string,
    birthdate: string,
    sex: string, 
    specialties: string[],
    availability: string[],
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in to add a therapist");
        router.push("/login");
        return;
      }
      
      const shopId = id as string;
      setShowAddTherapist(false);
      
      const data = await addMassageTherapist(token, name, tel, birthdate, sex, specialties, availability, shopId);
      if (data) {
        // Force re-fetch therapists
        setTherapists([]);
        setTimeout(async () => {
          try {
            alert("Therapist added successfully!");
            const updatedTherapists = await getTherapists(shopId);
            setTherapists(updatedTherapists);
          } catch (refreshError) {
            console.error("Error refreshing therapist list:", refreshError);
            alert("Therapist added successfully! Please refresh to see updates.");
          }
        }, 500);
      }
    } catch (error: any) {
      console.error("Error adding therapist:", error);
      alert(`Failed to add therapist: ${error.message || "Unknown error"}`);
    }
  };

  const handleShowEditTherapist = (name:string, tel:string, birthdate:string, sex:string, specialties:string[], availability:string[], therapistId:string) => {
    setShowEditTherapistPopup(true);
    setEditingTherapistName(name);
    setEditingTherapistTel(tel);
    setEditingTherapistBirthdate(birthdate);
    setEditingTherapistSex(sex);
    setEditingTherapistSpecialties(specialties);
    setEditingTherapistAvailability(availability);
    setEditingTherapistId(therapistId);
  }

  const handleCloseEditTherapist = () => {
    setShowEditTherapistPopup(false);
    setEditingTherapistName("");
    setEditingTherapistTel("");
    setEditingTherapistBirthdate("");
    setEditingTherapistSex("");
    setEditingTherapistSpecialties([]);
    setEditingTherapistAvailability([]);
    setEditingTherapistId("");
  }

  const handleUpdateTherapist = async (
    name: string, 
    tel: string,
    birthdate: string,
    sex: string, 
    specialties: string[],
    availability: string[],
    therapistId: string
  ) => {
    try{
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in to add a therapist");
        router.push("/login");
        return;
      }
      const shopId = id as string;
      setShowEditTherapistPopup(false);

      const data = await updateMassageTherapist(token, name, tel, birthdate, sex, specialties, availability, therapistId);

      if (data) {
        // Force re-fetch therapists
        setTherapists([]);
        setTimeout(async () => {
          try {
            alert("Therapist updated successfully!");
            const updatedTherapists = await getTherapists(shopId);
            setTherapists(updatedTherapists);
          } catch (refreshError) {
            console.error("Error refreshing therapist list:", refreshError);
            alert("Therapist updated successfully! Please refresh to see updates.");
          }
        }, 500);
      }
    }
    catch(err) {
      console.error("Error updating Therapist: ", err);
    }
  }

  const handleDeleteTherapist = async () => {
    try {
      if (!selecting2DeleteTherapist) {
        throw new Error('Missing therapist ID');
      }
      
      const url = `https://antony-massage-backend-production.up.railway.app/api/v1/therapists/${selecting2DeleteTherapist}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete therapist');
      }
      
      setShowDeleteTherapist(false);
      setSelecting2DeleteTherapist(null);
      
      // Update therapist list
      setTherapists(therapists.filter(t => t._id !== selecting2DeleteTherapist));
      alert("Therapist deleted");
    } catch (error: any) {
      // console.error('Delete therapist error:', error);
      alert(error.message || "Failed to delete. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white pt-[180px] md:pt-[140px] pb-[100px] px-4 md:px-10">
      <div className="w-full max-w-3xl space-y-4">
        <ShopHeader shop={shop} comments={comments} />
        <ShopDetails shop={shop} shopId={id as string} />
        <ReviewSummary comments={comments} />
        
        <ReviewsList 
          comments={comments} 
          user={user} 
          onEditReview={handleEditReview}
          onShowDelete={handleShowDeleteReview}
        />
      </div>
      
      <div className="w-full max-w-3xl mt-10 px-4 md:px-0">
        <button 
          onClick={handleShowAddReview}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold text-base py-3 rounded-lg shadow-md transition hover:cursor-pointer"
        >
          Add a review
        </button>
      </div>
      
      <TherapistList 
        therapists={therapists}
        isAdmin={isAdmin}
        onAddTherapist={() => setShowAddTherapist(true)}
        onEditTherapist={handleShowEditTherapist}
        onDeleteTherapist={handleShowDeleteTherapist}
      />

      {/* Popups */}
      {showPopup && (
        <ReviewPopup
          rating={newRating}
          comment={newComment}
          onRatingChange={setNewRating}
          onCommentChange={setNewComment}
          onCancel={() => setShowPopup(false)}
          onSubmit={async () => {
            await handleSubmitReview();
            setShowPopup(false);
          }}
        />
      )}

      {/* Delete review popup */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <ConfirmPopup
            onClose={() => {
              setShowDelete(false);
              setSelecting2Delete(null);
            }}
            onDelete={handleDeleteReview}
            title={"Are you sure you want to delete this comment?"}
          />
        </div>
      )}

      {/* Add therapist popup */}
      {showAddTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <AddMassageTherapistPopup
            onClose={() => setShowAddTherapist(false)}
            onAdd={handleAddTherapist}
          />
        </div>
      )}

    {/* Edit Therapist popup */}
    {showEditTherapistPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <EditMassageTherapistPopup
            nameval = {editingTherapistName}
            telval = {editingTherapistTel}
            birthdateval = {dayjs(editingTherapistBirthdate)}
            sexval = {editingTherapistSex}
            specialtiesval = {editingTherapistSpecialties}
            availabilityval = {editingTherapistAvailability}
            therapistIdval= {editingTherapistId}
            onClose={handleCloseEditTherapist}
            onUpdate={handleUpdateTherapist}
          />
        </div>
      )}

      {/* Delete therapist popup */}
      {showDeleteTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <ConfirmPopup 
            onClose={() => {
              setShowDeleteTherapist(false);
              setSelecting2DeleteTherapist(null);
            }} 
            onDelete={handleDeleteTherapist} 
            title={"Are you sure you want to delete this Massage Therapist?"}
          />
        </div>
      )}
    </div>
  );
}