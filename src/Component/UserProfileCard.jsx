import React, { useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ReusableTextField from "./ReusableTextfield";
import AuthButton from "./AuthButton";
import ReusableModal from "./ReusableModal";
import AuthForm from "./AuthForm";

const UserProfileCard = ({
  profile,
  onImageUpload,
  selectedFile,
  setSelectedFile,
  loading,
  formik,
  fields,
  editOpen,
  setEditOpen,
}) => {
  const fileInputRef = useRef(null);
  const role = localStorage.getItem("role");

  const imageUrl = profile.image
    ? `http://localhost:8085/files/${encodeURIComponent(profile.image)}`
    : undefined;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: "100%", sm: 500, md: 600 },
        mx: role === "Admin" ? 0 : "auto",
        flexGrow: 1,
        overflowY: "auto",
        minHeight: 0,
      }}
    >
      <Typography variant="h5" mb={2}>
        {role === "Admin" ? "User Profile" : "My Profile"}
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2} alignItems="flex-start">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={imageUrl} alt="Profile" sx={{ width: 80, height: 80 }}>
              {!profile.image && profile.name
                ? profile.name[0].toUpperCase()
                : null}
            </Avatar>
            {role !== "Admin" && (
              <Box display="flex" flexDirection="column" gap={1} flexGrow={1}>
                <ReusableTextField
                  type="file"
                  inputRef={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  value={selectedFile}
                  disabled={loading}
                  fullWidth
                />
                <AuthButton
                  label="Upload Image"
                  onClick={onImageUpload}
                  isLoading={loading}
                  variant="outlined"
                />
              </Box>
            )}
          </Stack>

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

          {role !== "Admin" && (
            <AuthButton
              label="Edit Profile"
              variant="outlined"
              onClick={() => setEditOpen(true)}
            />
          )}
        </Stack>
      </Paper>

      {role !== "Admin" && (
        <ReusableModal
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          title="Edit Profile"
          maxWidth={400}
        >
          {formik && (
            <AuthForm
              fields={fields}
              formik={formik}
              buttonLabel={formik.isSubmitting ? "Saving..." : "Save"}
              isLoading={formik.isSubmitting}
              fullWidth
              autoComplete="off"
            />
          )}
        </ReusableModal>
      )}
    </Box>
  );
};

export default UserProfileCard;
