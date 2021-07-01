import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "@lib/context";

export default function AuthCheck(props: any) {
  const { fullName } = useContext(UserContext);

  return fullName
    ? props.children
    : props.fallback || <Link href="/auth">You must be signed in!</Link>;
}
