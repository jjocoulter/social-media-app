import Avatar from "@material-ui/core/Avatar";
import type { User } from "@lib/types";

const UserAvatar = ({ profile }: { profile: User }) => {
  return profile.profileURL ? (
    <Avatar src={profile.profileURL} alt="" />
  ) : (
    <Avatar>{profile.firstName.charAt(0).toUpperCase()}</Avatar>
  );
};

export default UserAvatar;
