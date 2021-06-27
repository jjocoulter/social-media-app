import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { firestore, auth } from "@lib/firebase";

import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
}));

const RegisterModal = ({ open, handleClose }: any) => {
  const password = useRef({});
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, errors },
  } = useForm({ mode: "onChange" });

  password.current = watch("password", "");

  const createAccount = async ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        firestore
          .collection("users")
          .doc(user?.user?.uid)
          .set({
            firstName: firstName,
            lastName: lastName,
            email: email,
            fullName: firstName + " " + lastName,
          });
      })
      .catch((e) => {
        toast.error(e);
      });
    toast.success("User created successfully!");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(createAccount)} className={classes.root}>
        <TextField
          {...register("firstName", {
            minLength: { value: 2, message: "Name is too short" },
            maxLength: { value: 15, message: "Name is too long" },
            required: { value: true, message: "You must provide a first name" },
          })}
          label="First Name"
          margin="normal"
          helperText={errors.firstName ? errors.firstName.message : ""}
          error={!!errors.firstName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ChevronRightIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("lastName", {
            minLength: { value: 2, message: "Name is too short" },
            maxLength: { value: 20, message: "Name is too long" },
            required: { value: true, message: "You must provide a last name" },
          })}
          helperText={errors.lastName ? errors.lastName.message : ""}
          error={!!errors.lastName}
          label="Last Name"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ChevronRightIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please enter a valid email",
            },
          })}
          helperText={errors.email ? errors.email.message : ""}
          error={!!errors.email}
          label="Email"
          margin="normal"
          type="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("password", {
            minLength: {
              value: 6,
              message: "Password must contain at least 6 characters.",
            },
          })}
          helperText={errors.password ? errors.password.message : ""}
          error={!!errors.password}
          label="Password"
          margin="normal"
          type="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          {...register("confirmPassword", {
            validate: (value) =>
              value === password.current || "The passwords must match",
          })}
          helperText={
            errors.confirmPassword ? errors.confirmPassword.message : ""
          }
          error={!!errors.confirmPassword}
          label="Confirm Password"
          margin="normal"
          type="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
        <div>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!isValid || !isDirty}
          >
            Submit
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default RegisterModal;
