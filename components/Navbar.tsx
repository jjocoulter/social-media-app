import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "@lib/firebase";
import styles from "@styles/Navbar.module.css";
import useStyles from "@lib/Styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import MailIcon from "@material-ui/icons/Mail";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";

const Navbar = () => {
  const classes = useStyles();
  const router = useRouter();
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (val: string) => {
    switch (val) {
      case "profile":
        router.push(`/users/${user?.uid}/`);
        break;
      case "account":
        router.push(`/users/${user?.uid}/account`);
        break;
      case "log_out":
        auth.signOut();
        router.push("/auth");
        break;
      default:
        break;
    }
    handleClose();
  };

  return (
    <nav className={styles.navbar}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" noWrap>
            <strong>Social-Media</strong>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          {user ? (
            <div className="nav-icons">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton edge="end" onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-navbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleMenuClick("profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("account")}>
                  Account
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("log_out")}>
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link href="/auth">Sign In</Link>
          )}
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Navbar;
