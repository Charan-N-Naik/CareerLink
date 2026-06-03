import React, { useEffect } from "react";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "../../layout/dashboardlayout/index";
import { useDispatch, useSelector } from "react-redux";
import { getMyConnectionRequests } from "@/config/redux/action/authAction";
import styles from "./styles.module.css";
import { BASE_URL, mediaUrl } from "@/config";

import {AcceptConnection} from "@/config/redux/action/authAction"
import { useRouter } from "next/router";
  
export default function My_connections() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router=useRouter()

  useEffect(() => {
    dispatch(getMyConnectionRequests());
  }, []);

  useEffect(() => {
    if ((authState.connectionRequests, length != 0)) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
          >
            <h4>My Connections</h4>

            {authState.connectionRequests.length === 0 && (
              <h1>No Connection Request Pending</h1>
            )}

            {authState.connectionRequests.length !== 0 &&
              authState.connectionRequests
                .filter((connection) => connection.status_accepted === null)
                .map((user, index) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      className={styles.userCard}
                      key={index}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className={styles.profilePicture}>
                          <img src={mediaUrl(user.userId?.profilePicture)} alt="" />
                          
                        </div>

                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            dispatch(
                              AcceptConnection({
                                connectionId: user._id,
                                token: localStorage.getItem("token"),
                                action: "accept",
                              }),
                            );
                            dispatch(getMyConnectionRequests());
                          }}
                          className={styles.connectedButton}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}

            <h4>My Network</h4>

            {authState.connectionRequests
              .filter((connection) => connection.status_accepted !== null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    className={styles.userCard}
                    key={index}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={mediaUrl(user.userId.profilePicture)}
                          alt=""
                        />
                      </div>

                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
