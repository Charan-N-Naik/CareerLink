import React, { useEffect } from "react";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "@/layout/dashboardlayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import styles from "./styles.module.css";

import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
export default function Discover() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  const router = useRouter();

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>Discover</h1>

        <div className={styles.allUserProfile}>
          {authState.all_profile_fetched &&
            authState.alluser.map((user) => {
              return (
                <div
                  onClick={() => {
                    router.push(`view_profile/${user.userId.username}`);
                  }}
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    src={`${BASE_URL}/uploads/${user.userId?.profilePicture}`}
                    alt="profile"
                    className={styles.userCard_image}
                  />
                  <div>
                    <h1>{user.userId?.name}</h1>
                    <p>@{user.userId?.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
