import { CircularProgress } from "@material-ui/core";
import useStyles from "@lib/Styles";

export default function Loader({ show }: { show: boolean }) {
  const classes = useStyles();
  return show ? <CircularProgress className={classes.centerItems} /> : null;
}
