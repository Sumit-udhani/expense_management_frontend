import { useFormik } from "formik";
import * as Yup from "yup";
import AuthForm from "./AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { addCategories } from "../store/features/categorySlice";

const CreateCategory = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.categories);

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await dispatch(addCategories({ name: values.name })).unwrap();
        resetForm();
      } catch (error) {
        console.error("Error creating category:", error);
      } finally {
        setSubmitting(false);
      }
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
      isLoading={loading || formik.isSubmitting}
    />
  );
};

export default CreateCategory;
