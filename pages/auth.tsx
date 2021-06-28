import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { auth, googleAuthProvider, firestore } from "@lib/firebase";
import styles from "@styles/Mat.module.css";
import RegisterModal from "@components/RegisterModal";
import LoginForm from "@components/LoginForm";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import firebase from "firebase";

export default function Auth() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signInWithGoogle = async () => {
    let googleUser!: firebase.User | null;
    await auth
      .signInWithPopup(googleAuthProvider)
      .then((user) => {
        googleUser = user?.user;
      })
      .catch((e) => {
        toast.error(e);
      });

    const user = firestore.collection("users").doc(googleUser?.uid);
    if (!(await user.get()).exists) {
      const name = googleUser?.displayName?.split(" ", 2);
      await user
        .set({
          fullName: googleUser?.displayName,
          firstName: name![0],
          lastName: name![1],
        })
        .then(() => toast.success("Account created!"));
    }
  };

  return (
    <main>
      {!auth.currentUser ? (
        <Card className={styles.card}>
          <Button
            onClick={signInWithGoogle}
            variant="contained"
            color="primary"
            startIcon={
              <Image src="/google-logo.svg" width="25" height="25" alt="" />
            }
          >
            Google SignIn
          </Button>
          {/* <Button onClick={handleOpen}>Register</Button> */}
          <RegisterModal open={open} handleClose={handleClose} />
          <LoginForm />
        </Card>
      ) : (
        <Card className={styles.card}>
          <p>Currently logged in as {auth.currentUser.email}</p>
          <Button onClick={() => auth.signOut()}>Sign Out</Button>
        </Card>
      )}
    </main>
  );
}
