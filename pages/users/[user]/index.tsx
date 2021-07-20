import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  makeStyles,
  createStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";

import type { User } from "@lib/types";
import { firestore } from "@lib/firebase";
import UserAvatar from "@components/UserAvatar";
import Loader from "@components/Loader";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      fontSize: "3rem",
      color: "darkGrey",
    },
    centerItems: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    main: {
      margin: "none",
      padding: "none",
    },
    container: {
      width: "70%",
      backgroundColor: "grey",
    },
  })
);

const Profile = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const userId = router.query.user;
  const classes = useStyles();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userSnapshot = await firestore
          .collection("users")
          .doc(userId as string)
          .get();
        setUser(userSnapshot.data() as User);
        setShowLoader(false);
      } catch (err) {
        setError(err);
      }
    };
    getUser();
  }, [userId]);

  return (
    <main className={`${classes.main} ${classes.centerItems}`}>
      <div className={`${classes.container}`}>
        {error ? (
          <div className={`${classes.error} ${classes.centerItems}`}>
            {error}
          </div>
        ) : !user && !showLoader ? (
          <div className={`${classes.error} ${classes.centerItems}`}>
            User not found
          </div>
        ) : (
          <div>
            {user ? (
              <UserAvatar profile={user} size="small" />
            ) : (
              <Loader show={showLoader} />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
