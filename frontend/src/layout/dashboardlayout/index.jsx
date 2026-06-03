import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { setTokenisthere } from "@/config/redux/reducer/authReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      window.location.href = "/login";
    }
    dispatch(setTokenisthere());
  }, []);
  const authState = useSelector((state) => state.auth);

  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.homeContainer}>
        <div className={styles.homeContainer__leftBar}>
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
            className={styles.sideBarOption}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={24}
              height={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-6.75h4.5V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
              />
            </svg>

            <p>Scroll</p>
          </div>

          <div
            onClick={() => {
              router.push("/discover");
            }}
            className={styles.sideBarOption}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p>Discover</p>
          </div>

          <div
            onClick={() => {
              router.push("/my_connections");
            }}
            className={styles.sideBarOption}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <p>My Connections</p>
          </div>
        </div>

        <div className={styles.homeContainer__feedContainer}>{children}</div>

        <div className={styles.homeContainer__extraContainer}>
          <h3> Top Profiles</h3>
          {authState.all_profile_fetched &&
            authState.alluser.map((data, index) => (
              <div key={index}>{data.userId.username}</div>
            ))}
        </div>
      </div>

      {
        <div className={styles.mobileNavBar}>
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
            className={styles.singleNavItemHolder_mobileView}
          >
              <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={24}
              height={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-6.75h4.5V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
              />
            </svg>
          </div>

          <div
            onClick={() => {
              router.push("/discover");
            }}
            className={styles.singleNavItemHolder_mobileView}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <div
            onClick={() => {
              router.push("/my_connections");
            }}
            className={styles.singleNavItemHolder_mobileView}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
        </div>
      }
    </div>
  );
}
