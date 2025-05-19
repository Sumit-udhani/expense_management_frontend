import { Box } from "@mui/material";
import { useState } from "react";
import api from "../api/axiosInterceptor";
import ReusableTextField from "./ReusableTextfield";
import AuthButton from "./AuthButton";

const CreateCategory = ({ onCategoryCreated }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      await api.post("/category", { name });
      onCategoryCreated();
      setName("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2}
      mt={1}
      width="250px" // 👈 Set a smaller fixed width for the form
    >
      <Box>
        <ReusableTextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          variant="filled"
          fullWidth // 👈 still use fullWidth so it fills the 250px parent
        />
      </Box>

      <AuthButton
        label="Create"
        type="submit"
        size="small"
        sx={{ alignSelf: "flex-start" , minWidth: "150px", }}
      />
    </Box>
  );
};

export default CreateCategory;
