import React, { useState } from "react";
import toast from "react-hot-toast";

import { auth } from "@lib/firebase";

import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

import EmailIcon from "@material-ui/icons/Email";
import useStyles from "@lib/Styles";

const ResetPasswordModal = ({ open, handleClose }: any) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const classes = useStyles();

  const handlePasswordReset = () => {
    // TODO: Firebase renders an 'email address is badly formatted' error toast regardless of success of function.
    setError(false);
    console.log(email);

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        toast.success("Password reset sent. Check your emails.");
        handleClose();
      })
      .catch((err) => {
        setError(true);
        toast.error(err.message);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handlePasswordReset} className={classes.root}>
        <TextField
          id="email"
          label="Email"
          margin="normal"
          type="email"
          error={error}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Send password reset
        </Button>
      </form>
    </Dialog>
  );
};

export default ResetPasswordModal;
