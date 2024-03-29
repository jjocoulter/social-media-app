import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { useRouter } from "next/router";

import "@styles/globals.css";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hook";
import Navbar from "@components/Navbar";
import NewPostFab from "@components/NewPostFab";

import { Toaster } from "react-hot-toast";
import CssBaseline from "@material-ui/core/CssBaseline";

export default function MyApp(props: any) {
  const router = useRouter();
  const { Component, pageProps } = props;
  const userData = useUserData();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    const path: string = router.asPath;
    if (path) console.log("useEffect fired!", { asPath: router.asPath });
  }, [router.asPath]);

  return (
    <React.Fragment>
      <Head>
        <title>Social Media App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <UserContext.Provider value={userData}>
        <CssBaseline />
        <Navbar />
        <Component {...pageProps} />
        {/* <NewPostFab /> */}
        <Toaster />
      </UserContext.Provider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
