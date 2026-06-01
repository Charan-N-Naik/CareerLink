import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer";



export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !authState.profileFeached) {
      dispatch(getAboutUser());
    }
  }, [authState.profileFeached, dispatch]);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {!authState.profileFeached && (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}

          {authState.profileFeached && (
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <p>Hey, {authState.user?.userId?.name}</p>
              <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </nav>
      <hr />
    </div>
  );
}
