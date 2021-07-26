import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  makeStyles,
  createStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Divider from "@material-ui/core/Divider";

import type { User } from "@lib/types";
import { firestore } from "@lib/firebase";
import UserAvatar from "@components/UserAvatar";
import Loader from "@components/Loader";
import { Avatar, Tooltip } from "@material-ui/core";
import Link from "next/link";

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
      // backgroundColor: "grey",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "bold",
    },
    avatars: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: theme.spacing(2),
    },
    optionsList: {
      display: "flex",
      justifyContent: "space-between",
      textAlign: "center",
      width: "50%",
      height: "4rem",
      lineHeight: "4rem",
      listStyle: "none",
      padding: "0",
    },
    optionsListItem: {
      margin: "auto",
      fontWeight: "bold",
      width: "100%",
      height: "100%",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ccc",
      },
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

  let friendList: User[] = [];
  for (let i = 0; i < 12; i++) {
    friendList.push(user as User);
  }

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

  const Content = () => {
    return <div>Content</div>;
  };

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
              <div>
                {/* Header section */}
                <div className={classes.header}>
                  <div className={classes.profileSection}>
                    <UserAvatar profile={user} size="profile" />
                    <div
                      style={{
                        display: "block",
                        margin: "none",
                        padding: "30px",
                        height: "100%",
                      }}
                    >
                      <span className={classes.title}>{user.fullName}</span>
                      <br />
                      <Link href={`/users/${userId}/friends`}>Friends: 0</Link>
                      <AvatarGroup
                        max={5}
                        classes={{
                          root: classes.avatars,
                          avatar: classes.avatars,
                        }}
                      >
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                        <Tooltip title="Josh Coulter">
                          <Avatar>J</Avatar>
                        </Tooltip>
                      </AvatarGroup>
                    </div>
                  </div>
                  <div className={classes.profileSection}>
                    <UserAvatar profile={user} size="large" />
                    {user.fullName}
                  </div>
                </div>
                <Divider />
                {/* Selection Menu section */}
                <div>
                  <ul className={classes.optionsList}>
                    <Link href="#" passHref>
                      <li className={classes.optionsListItem}>Posts</li>
                    </Link>
                    <li className={classes.optionsListItem}>
                      <Link href="#">About</Link>
                    </li>
                    <li className={classes.optionsListItem}>
                      <Link href="#">Friends</Link>
                    </li>
                    <li className={classes.optionsListItem}>
                      <Link href="#">Photos</Link>
                    </li>
                  </ul>
                </div>
                {/* Content section */}
                <Content />
              </div>
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
