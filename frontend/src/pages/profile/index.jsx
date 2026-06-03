import React from "react";
import styles from "./styles.module.css";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "@/layout/dashboardlayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllposts } from "@/config/redux/action/postAction";
import { useDispatch } from "react-redux";
import { getConnectionsRequest } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { clientserver } from "@/config";

import { resetPostId } from "@/config/redux/reducer/postReducer/index";

const ProfilePage = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({
    companyName: "",
    position: "",
    years: "",
  });

  const handleInputChange =  (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const updateProfilePicture = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("token", localStorage.getItem("token"));

    await clientserver.post("/users/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      }),
    );
  };

  useEffect(() => {
    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      }),
    );
    dispatch(getAllposts());
  }, []);

  useEffect(() => {
    if (authState.user !== undefined) {
      setUserProfile(authState.user);

      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });

      console.log(post, authState.user.userId.username);
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfileData = async () => {
    const request = await clientserver.post("users/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientserver.post("users/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      }),
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.avatarWrapper}>
                <img
                  src={`${BASE_URL}/uploads/${userProfile.userId.profilePicture}`}
                  alt="avatar"
                />
                <div className={styles.avatarOverlay}>
                  <label
                    htmlFor="profilePictureInput"
                    style={{ cursor: "pointer" }}
                  >
                    <p>Edit</p>
                  </label>
                  <input
                    type="file"
                    id="profilePictureInput"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      updateProfilePicture(e.target.files[0]);
                    }}
                  />
                </div>
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
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />

                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
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
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt="post"
                              />
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
            <div className="workHistory">
              <h4>Work History</h4>

              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.companyName} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
                <button className={styles.addWorkBtn} onClick={() => {
                    setIsModalOpen(true);
                }}>
                  + Add Work
                </button>
              </div>
            </div>
            {userProfile !== authState.user && (
              <div
                className={styles.connectBtn}
                onClick={() => {
                  updateProfileData();
                }}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        { isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
                <input
                onChange={handleInputChange}
                type="text"
                placeholder="Enter Company name"
                className={styles.inputField}
                name="companyName"
              />
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Enter position"
                className={styles.inputField}
                name="position"
              />
              <input
                onChange={handleInputChange}
                type="number"
                placeholder="Enter number of years work"
                className={styles.inputField}
                name="years"
              />
              <div
              onClick={() => {
                setUserProfile({
                  ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                });
                setInputData({
                  companyName: "",
                  position: "",
                  years: "",
                });
                setIsModalOpen(false);
              }}

              className={styles.connectBtn}>
                add work

              </div>


            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
};

export default ProfilePage;
