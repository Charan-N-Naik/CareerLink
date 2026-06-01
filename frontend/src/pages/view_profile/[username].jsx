import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { clientserver } from "@/config";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "@/layout/dashboardlayout";
import styles from "./styles.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllposts } from "@/config/redux/action/postAction";
import {
  sendConnectionRequest,
  getConnectionsRequest,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUsersPost = async () => {
    await dispatch(getAllposts());
    console.log(userProfile);
    await dispatch(
      getConnectionsRequest({
        token: localStorage.getItem("token"),
      }),
    );
  };

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });

    setUserPosts(post);
  }, [postReducer.posts]);

  useEffect(() => {
    console.log(authState.connections, userProfile.userId._id);
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id,
        )?.status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections]);

  useEffect(() => {
    getUsersPost();
  }, []);

  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("From View: View Profile"); // on the network
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/uploads/${userProfile.userId.profilePicture}`}
              alt="backdrop"
            />
          </div>
        </div>
        <div className={styles.profileContainer__details}>
          <div style={{ display: "flex", gap: "0.7rem" }}>
            <div style={{ flex: "0.8" }}>
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: "1.2rem",
                }}
              >
                <h2>{userProfile.userId.name}</h2>
                <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
              </div>

              {isCurrentUserInConnection ? (
                <button className={styles.connectedButton}>
                  {isConnectionNull ? "pending.." : "Connected"}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const result = await dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        connectionId: userProfile.userId._id,
                      }),
                    );

                    if (sendConnectionRequest.fulfilled.match(result)) {
                      setIsCurrentUserInConnection(true);
                    }
                  }}
                  className={styles.connectBtn}
                >
                  Connect
                </button>
              )}
              <div>
                <p>{userProfile.bio}</p>
              </div>
            </div>

            <div style={{ flex: "0.2" }}>
              <h3>Recent Activity</h3>

              {userPosts.map((post) => {
                return (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card__profileContainer}>
                        {post.media !== "" ? (
                          <img src={`${BASE_URL}/${post.media}`} alt="post" />
                        ) : null}
                      </div>

                      <p>{post.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View");
  console.log(context.query.username);

  const request = await clientserver.get("/users/get-user-based-on-userName", {
    params: {
      username: context.query.username,
    },
  });

  const response = await request.data;
  console.log(response);

  return {
    props: {
      userProfile: request.data.userProfile,
    },
  };
}
