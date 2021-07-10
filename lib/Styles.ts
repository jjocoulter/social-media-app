import {
  makeStyles,
  createStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    card: {
      minWidth: "150px",
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing(2),
      padding: theme.spacing(2),
      "& .MuiButtonBase-card": {
        margin: theme.spacing(2),
      },
    },
    fab: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
    },
    createPostForm: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "1em",
      padding: theme.spacing(2),
    },
    createPostTF: {
      width: "50rem",
    },
  })
);

export default useStyles;
