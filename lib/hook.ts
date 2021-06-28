import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@lib/firebase";

export function useUserData() {
  const [user]: any = useAuthState(auth);
  const [fullName, setFullName] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setFullName(doc.data()?.fullName);
      });
    } else {
      setFullName(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, fullName };
}
