import { useFormik } from "formik";
import * as Yup from "yup";
import AuthForm from "./AuthForm";
import api from "../api/axiosInterceptor";
const CreateCategory = ({ onCategoryCreated }) => {
  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await api.post("/category", { name: values.name });
        onCategoryCreated();
        resetForm();
      } catch (error) {
        console.error("Error creating category:", error);
      }
      setSubmitting(false);
    },
  });

  const fields = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
    },
  ];

  return (
    <AuthForm
      fields={fields}
      formik={formik}
      buttonLabel="Create"
      isLoading={formik.isSubmitting}
    />
  );
};
export default CreateCategory