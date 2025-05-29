import React, { useRef } from "react";
import ReusableTextField from "./ReusableTextfield";
import Dropdown from "./ReusableDropdown";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AuthForm({
  fields,
  buttonLabel,
  isLoading,
  error,
  footer,
  formik,
  customLayout = false,
  fieldSpacingProps = {},
  fieldPropsOverride = () => ({}),
  ...props
}) {
  const fileInputRefs = useRef({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            display: customLayout ? "grid" : "block",
            gridTemplateColumns: customLayout
              ? isMobile
                ? "1fr"
                : "1fr 1fr"
              : "none",

            rowGap: customLayout ? fieldSpacingProps?.rowGap ?? 2 : 0,
            columnGap: customLayout ? fieldSpacingProps?.columnGap ?? 2 : 0,
          }}
        >
          {fields.map((field) => {
            if (field.type === "dropdown") {
              return (
                <Dropdown
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={(value) => formik.setFieldValue(field.name, value)}
                  onBlur={formik.handleBlur}
                  options={field.options}
                  error={formik.errors[field.name]}
                  touched={formik.touched[field.name]}
                  sx={{ ...fieldSpacingProps }}
                />
              );
            } else if (field.type === "file") {
              if (!fileInputRefs.current[field.name]) {
                fileInputRefs.current[field.name] = React.createRef();
              }

              return (
                <Box
                  key={field.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    minWidth: 0,
                    maxWidth: "100%", 
                    overflow: "hidden",
                    mt: 2,
                    gridColumn: isMobile ? "auto" : "span 2",
                  }}
                >
                  <ReusableTextField
                    type="file"
                    name={field.name}
                    inputRef={fileInputRefs.current[field.name]}
                    onChange={(e) =>
                      formik.setFieldValue(field.name, e.currentTarget.files[0])
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.name] &&
                      Boolean(formik.errors[field.name])
                    }
                    helperText={
                      formik.touched[field.name] && formik.errors[field.name]
                    }
                    fullWidth
                    size="large"
                    {...fieldPropsOverride(field)}
                    sx={{ flex: 1 }}
                  />

                  {formik.values[field.name] && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: { xs: 140, sm: 180, md: 200 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formik.values[field.name]?.name}
                      </Typography>

                      <IconButton
                        onClick={() => {
                          formik.setFieldValue(field.name, null);
                          if (fileInputRefs.current[field.name]?.current) {
                            fileInputRefs.current[field.name].current.value =
                              null;
                          }
                        }}
                      >
                        <CloseIcon color="error" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            } else {
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    formik.touched[field.name] && formik.errors[field.name]
                  }
                  fullWidth
                  margin="normal"
                  sx={{ ...fieldSpacingProps }}
                  inputProps={field.type === "number" ? { min: 0 } : {}}
                />
              );
            }
          })}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, position: "relative" }}
          {...props}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={24}
                color="inherit"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
              <span style={{ opacity: 0 }}>{buttonLabel}</span>
            </>
          ) : (
            buttonLabel
          )}
        </Button>

        {footer}
      </Box>
    </>
  );
}
