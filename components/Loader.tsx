import { CircularProgress } from "@material-ui/core";

export default function Loader({ show }: { show: boolean }) {
  return show ? <CircularProgress /> : null;
}
