import Avatar from "@material-ui/core/Avatar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import type { User } from "@lib/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: theme.spacing(2),
    },
    medium: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      fontSize: theme.spacing(6),
    },
  })
);

const UserAvatar = ({
  profile,
  size = "medium",
}: {
  profile: User;
  size?: string;
}) => {
  const classes = useStyles();

  const getSize = () => {
    switch (size) {
      case "small":
        return classes.small;
      case "medium":
        return classes.medium;
      case "large":
        return classes.large;
      default:
        return classes.medium;
    }
  };

  return profile.profileURL ? (
    <Avatar src={profile.profileURL} className={getSize()} alt="" />
  ) : (
    <Avatar className={getSize()}>
      {profile.firstName.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
