import react, { useState } from "react";
import UserLayout from "@/layout/userlauout/MainUserLayout";

import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function login(params) {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  if (authState.loggedIn) {
    router.push("/dashboard");
  }

  const [isuserloginMethod,setisuserloginMethod] = useState(false);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.leftCardheadline}> {isuserloginMethod ? "Sign In" : "Sign Up"}</p>
            
            <div className={styles.inputContainer}>
                <div className={styles.inputRow}>
                    <input type="text" placeholder="userName" className={styles.inputField} />
                    <input type="text" placeholder="Name" className={styles.inputField} />
                </div>
                <input type="text" placeholder="password" className={styles.inputField} />
                <input type="text" placeholder="Name" className={styles.inputField} /> 
                <div className={styles.buttonWithOutline}>
                    <p>{isuserloginMethod? "Sign In":"Sign Up"}</p>

                </div>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
