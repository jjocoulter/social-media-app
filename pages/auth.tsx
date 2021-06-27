import { useState } from "react";
import { auth } from "@lib/firebase";
import styles from "@styles/Mat.module.css";
import RegisterModal from "@components/RegisterModal";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

export default function Auth() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <main>
      {!auth.currentUser ? (
        <Card className={styles.card}>
          <Button onClick={handleOpen}>Register</Button>
          <RegisterModal open={open} handleClose={handleClose} />
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
