import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Home,
  Edit,
  Save,
  Cancel,
  Lock,
  Visibility,
  VisibilityOff,
  PhotoCamera,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

import {
  updateProfile,
  changePassword,
  reset,
} from "../../store/slices/authSlice";

const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  phone: Yup.string().matches(
    /^[\+]?[1-9][\d]{0,15}$/,
    "Please provide a valid phone number"
  ),
  unitNumber: Yup.string().max(10, "Unit number cannot exceed 10 characters"),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
      setEditMode(false);
      setPasswordDialogOpen(false);
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleProfileUpdate = (values) => {
    dispatch(updateProfile(values));
  };

  const handlePasswordChange = (values) => {
    dispatch(changePassword(values));
  };

  const getRoleColor = (role) => {
    const colors = {
      administrator: "#f44336",
      president: "#9c27b0",
      secretary: "#2196f3",
      treasurer: "#ff9800",
      council: "#4caf50",
      resident: "#607d8b",
    };
    return colors[role] || "#607d8b";
  };

  const getRoleDisplayName = (role) => {
    const names = {
      administrator: "Administrator",
      president: "President",
      secretary: "Secretary",
      treasurer: "Treasurer",
      council: "Council Member",
      resident: "Resident",
    };
    return names[role] || "Resident";
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - Span Tower 27</title>
        <meta name="description" content="Manage your profile settings" />
      </Helmet>

      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
              color="primary"
            >
              My Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your personal information and account settings
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Profile Overview Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "fit-content" }}>
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      bgcolor: getRoleColor(user.role),
                      fontSize: "2rem",
                    }}
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </Avatar>

                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: getRoleColor(user.role),
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {getRoleDisplayName(user.role)}
                  </Typography>

                  {user.unitNumber && (
                    <Typography variant="body2" color="text.secondary">
                      Unit {user.unitNumber}
                    </Typography>
                  )}

                  <Button
                    startIcon={<PhotoCamera />}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    disabled
                  >
                    Change Photo
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Status
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Email Verified</Typography>
                    <Typography
                      variant="body2"
                      color={
                        user.isEmailVerified ? "success.main" : "warning.main"
                      }
                    >
                      {user.isEmailVerified ? "Verified" : "Pending"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Account Status</Typography>
                    <Typography
                      variant="body2"
                      color={user.isActive ? "success.main" : "error.main"}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">Member Since</Typography>
                    <Typography variant="body2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  <Button
                    startIcon={editMode ? <Cancel /> : <Edit />}
                    onClick={() => setEditMode(!editMode)}
                    variant={editMode ? "outlined" : "contained"}
                  >
                    {editMode ? "Cancel" : "Edit"}
                  </Button>
                </Box>

                <Formik
                  initialValues={{
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    phone: user.phone || "",
                    unitNumber: user.unitNumber || "",
                    preferences: {
                      emailNotifications:
                        user.preferences?.emailNotifications ?? true,
                      smsNotifications:
                        user.preferences?.smsNotifications ?? false,
                      theme: user.preferences?.theme || "light",
                    },
                  }}
                  validationSchema={profileValidationSchema}
                  onSubmit={handleProfileUpdate}
                  enableReinitialize
                >
                  {({
                    errors,
                    touched,
                    values,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                  }) => (
                    <Form>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.firstName && Boolean(errors.firstName)
                            }
                            helperText={touched.firstName && errors.firstName}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            value={user.email}
                            disabled
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email color="action" />
                                </InputAdornment>
                              ),
                            }}
                            helperText="Email cannot be changed. Contact administrator if needed."
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            as={TextField}
                            fullWidth
                            label="Unit Number"
                            name="unitNumber"
                            value={values.unitNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.unitNumber && Boolean(errors.unitNumber)
                            }
                            helperText={touched.unitNumber && errors.unitNumber}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Home color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        {editMode && (
                          <>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="h6" gutterBottom>
                                Notification Preferences
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      values.preferences.emailNotifications
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "preferences.emailNotifications",
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label="Email Notifications"
                              />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      values.preferences.smsNotifications
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        "preferences.smsNotifications",
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label="SMS Notifications"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  startIcon={<Save />}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditMode(false)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Paper>

              {/* Security Section */}
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Security
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1">Password</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last changed:{" "}
                      {user.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : "Never"}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add an extra layer of security to your account
                    </Typography>
                  </Box>
                  <Button variant="outlined" disabled>
                    Enable 2FA
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Change Password Dialog */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={handlePasswordChange}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={values.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.currentPassword &&
                          Boolean(errors.currentPassword)
                        }
                        helperText={
                          touched.currentPassword && errors.currentPassword
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                                edge="end"
                              >
                                {showCurrentPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.newPassword && Boolean(errors.newPassword)
                        }
                        helperText={touched.newPassword && errors.newPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                                edge="end"
                              >
                                {showNewPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.confirmPassword &&
                          Boolean(errors.confirmPassword)
                        }
                        helperText={
                          touched.confirmPassword && errors.confirmPassword
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                edge="end"
                              >
                                {showConfirmPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setPasswordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Container>
    </>
  );
};

export default ProfilePage;
