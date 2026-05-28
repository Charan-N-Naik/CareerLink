import react, { useEffect, useState } from "react";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  registerUser,
  loginUser,
} from "../../config/redux/action/authAction/index";

import { reset, emptymessage } from "../../config/redux/reducer/authReducer";

export default function login(params) {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();
  const [isuserloginMethod, setisuserloginMethod] = useState(false);

//   useEffect(() => {
//     if (authState.loggedIn) {
//       router.push("/dashboard");
//     }
//   }, [useState.loggedIn]); // when login changed that redirect to the dashboard



//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       router.push("/dashboard");
//     }
//   }, []);


useEffect(() => {
  if (authState.loggedIn || localStorage.getItem("token")) {
    router.push("/dashboard");
  }
}, [authState.loggedIn, router]);



  useEffect(() => {
    dispatch(emptymessage());
  }, [isuserloginMethod]);


  useEffect(() => {
    if (authState.message === "You are registered, please login") {
        setisuserloginMethod(true);
    }
    }, [authState.message]);

  const dispatch = useDispatch();

  const [username, setusername] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  function handleRegister(params) {
    console.log("registering>>>>");
    dispatch(
      registerUser({
        username,
        name,
        email,
        password,
      }),
    );
  }

  function handelLogin() {
    console.log("login called");

    dispatch(
      loginUser({
        email,
        password,
      }),
    );
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.leftCardheadline}>
              {" "}
              {isuserloginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainer}>
              {!isuserloginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => {
                      setusername(e.target.value);
                    }}
                    type="text"
                    placeholder="userName"
                    className={styles.inputField}
                  />
                  <input
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                    type="text"
                    placeholder="Name"
                    className={styles.inputField}
                  />
                </div>
              )}
              <input
                onChange={(e) => setemail(e.target.value)}
                type="text"
                placeholder="Email"
                className={styles.inputField}
              />
              

              <input
                onChange={(e) => setpassword(e.target.value)}
                type="text"
                placeholder="password"
                className={styles.inputField}
              />
              <div
              
                onClick={() => {
                  if (isuserloginMethod) {
                    handelLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{isuserloginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <div className={styles.iteamsincont}>
              {!isuserloginMethod ? (
                <p>you already have and account?</p>
              ) : (
                <p>dont have an acccount</p>
              )}
              <div
                className={styles.buttonWithOutline}
                onClick={() => {
                  setisuserloginMethod(!isuserloginMethod);
                }}
              >
                <p>{isuserloginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
