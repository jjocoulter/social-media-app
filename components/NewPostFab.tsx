import { useEffect } from "react";
import Link from "next/link";

import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";

import useStyles from "@lib/Styles";
import { auth } from "@lib/firebase";

const NewPostFab = () => {
  const classes = useStyles();

  useEffect(() => {
    // useEffect to decide which routes to display FAB on
  }, []);

  return (
    <>
      {auth.currentUser ? (
        <Fab color="secondary" className={classes.fab}>
          <Link href="/posts/create" passHref>
            <EditIcon />
          </Link>
        </Fab>
      ) : (
        ""
      )}
    </>
  );
};

export default NewPostFab;
