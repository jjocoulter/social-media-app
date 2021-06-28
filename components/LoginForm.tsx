import React, { useState } from "react";
import toast from "react-hot-toast";

import { auth } from "@lib/firebase";
import useStyles from "@lib/Styles";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";

const LoginForm = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(false);

    const user = await auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        setError(true);
        toast.error(err.message);
      });
    console.log(user);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.root}>
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
      <TextField
        id="password"
        label="Password"
        margin="normal"
        type="password"
        error={error}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" type="submit" color="primary">
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
