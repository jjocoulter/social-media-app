import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
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
    profile: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      fontSize: theme.spacing(13),
    },
  })
);

const UserAvatar = ({
  profile,
  size = "medium",
  tooltip = profile.fullName || "",
}: {
  profile: User;
  size?: string;
  tooltip?: string;
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
      case "profile":
        return classes.profile;
      default:
        return classes.medium;
    }
  };

  return (
    <Tooltip title={tooltip}>
      {profile.profileURL ? (
        <Avatar src={profile.profileURL} className={getSize()} alt="" />
      ) : (
        <Avatar className={getSize()}>
          {profile.firstName.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Tooltip>
  );
};

export default UserAvatar;
