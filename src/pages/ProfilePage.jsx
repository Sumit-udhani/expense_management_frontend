import { useEffect, useRef, useState, useMemo } from "react";
import api from "../api/axiosInterceptor";
import { Typography, Paper, Stack, Box, Avatar, Button } from "@mui/material";
import AuthButton from "../Component/AuthButton";
import ReusableModal from "../Component/ReusableModal";
import AuthForm from "../Component/AuthForm";
import { useFormik } from "formik";
import * as yup from "yup";
import ReusableTextField from "../Component/ReusableTextfield";
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

  const imageUrl = profile.image
    ? `http://localhost:8085/files/${encodeURIComponent(profile.image)}`
    : undefined;

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
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        My Profile
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2} alignItems="flex-start">
          <Avatar src={imageUrl} alt="Profile" sx={{ width: 80, height: 80 }}>
            {!profile.image && profile.name
              ? profile.name[0].toUpperCase()
              : null}
          </Avatar>

          <ReusableTextField
            type="file"
            accept="image/*"
            inputRef={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files[0])}
            disabled={loading}
          />

          <AuthButton
            label="Upload Image"
            onClick={handleImageUpload}
            isLoading={loading}
            variant="outlined"
          />

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Name:
            </Typography>
            <Typography>{profile.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Email:
            </Typography>
            <Typography>{profile.email}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Mobile No:
            </Typography>
            <Typography>{profile.mobileNo || "-"}</Typography>
          </Box>

          <AuthButton
            label={"Edit Profile"}
            variant="outlined"
            onClick={() => setEditOpen(true)}
          />
        </Stack>
      </Paper>

      <ReusableModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        title="Edit Profile"
        maxWidth={400}
      >
        <AuthForm
          fields={fields}
          formik={formik}
          buttonLabel={formik.isSubmitting ? "Saving..." : "Save"}
          isLoading={formik.isSubmitting}
          fullWidth
          autoComplete="off"
        />
      </ReusableModal>
    </Box>
  );
};

export default ProfilePage;
