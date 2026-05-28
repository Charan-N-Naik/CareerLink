import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";


export default function NavBarComponent() {
  const router = useRouter();
    const authState = useSelector((state)=>state.auth);
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {!authState.profileFeached && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
          {authState.profileFeached && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p>Hey, {authState.user.userId.name}</p>
                <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
