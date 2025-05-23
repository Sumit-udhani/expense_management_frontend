import { useEffect, useRef, useState, useMemo } from "react";
import api from "../api/axiosInterceptor";
import { Typography, Paper, Stack, Box, Avatar, } from "@mui/material";
import AuthButton from "../Component/AuthButton";
import ReusableModal from "../Component/ReusableModal";
import AuthForm from "../Component/AuthForm";
import { useFormik } from "formik";
import * as yup from "yup";
import ReusableTextField from "../Component/ReusableTextfield";
import UserProfileCard from "../Component/UserProfileCard";
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  mobileNo: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
});

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
    mobileNo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const user = res.data;
      setProfile({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        mobileNo: user.UserProfile?.mobileNo || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      await api.post("/auth/upload-profile-image", formData, );
      await fetchProfile();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const initialValues = useMemo(
    () => ({
      name: profile.name || "",
      mobileNo: profile.mobileNo || "",
    }),
    [profile.name, profile.mobileNo]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.put("/auth/update-profile", values);
        await fetchProfile();
        setEditOpen(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fields = [
    { name: "name", label: "Name", type: "text" },
    { name: "mobileNo", label: "Mobile No", type: "text" },
  ];

  return (
    <UserProfileCard
    profile={profile}
    onImageUpload={handleImageUpload}
    selectedFile={selectedFile}
    setSelectedFile={setSelectedFile}
    loading={loading}
    formik={formik}
    fields={fields}
    editOpen={editOpen}
    setEditOpen={setEditOpen}
  />
  );
};

export default ProfilePage;
