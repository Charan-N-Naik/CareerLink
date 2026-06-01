import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  getAllposts,
  increamentPostLikes,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer/index";
import { getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "@/layout/dashboardlayout";
import { getAllUsers } from "../../config/redux/action/authAction/index";
import styles from "./styles.module.css";

import { deletePost } from "@/config/redux/action/postAction";

import { BASE_URL } from "../../config/index";

import {
  getAllComments,
  postComment,
} from "../../config/redux/action/postAction/index";
export default function dashboard() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const postState = useSelector((state) => state.posts);

  useEffect(() => {
    if (authState.isTokenisThere) {
      // console.log("dispatch is called");
      dispatch(getAllposts());
      console.log("dispach is ended");
      // console.log(usertoken);
      dispatch(getAboutUser());
    }
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenisThere, authState.all_profile_fetched]);

  // Poll for post updates so likes/counts update across users automatically.
  // useEffect(() => {
  //   if (!authState.isTokenisThere) return;

  //   const intervalId = setInterval(() => {
  //     // silent fetch of posts to keep UI in sync across users
  //     dispatch(getAllposts());
  //   }, 5000); // every 5 seconds

  //   return () => clearInterval(intervalId);
  // }, [authState.isTokenisThere, dispatch]);

  const handelFileUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setFileContent("");
    setPostContent("");
    await dispatch(getAllposts());
  };

  // useState(
  //   setInterval(()=>{
  //     dispatch(getAllposts())
  //   },900)
  // )
  const [commentText, setCommentText] = useState("");

  return (
    <UserLayout>
      {/* // heare  the check is important due to the feaching the data from the database amy take the time that why  we are  specifing the is isprofilefeached 
        // that why in we are speficng the user at top 
        .addCase(getAboutUser.fulfilled, (state, action) => {
              state.user = action.payload.profile;s
              console.log(state.user)
              state.profileFeached = true;
              state.isError = false;
              state.isLoading = false;
              state.message = "fetched successfully";
          }) */}

      {/* {authState.profileFeached && <div>
          {authState.user.userId.username}
          </div>} */}
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.Wrapper}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                width={200}
                src={`${BASE_URL}/uploads/${authState.user?.userId?.profilePicture}`}
                alt=""
              />

              <textarea
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
                placeholder={`whats in your mind?`}
                className={styles.textAreaOfContent}
                name=""
                id=""
              ></textarea>

              <label htmlFor="fileUpload">
                <div className={styles.Fab}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>
              <input
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileUpload"
              />
              {postContent.length > 0 && (
                <div
                  onClick={() => handelFileUpload()}
                  className={styles.uploadButton}
                >
                  Post
                </div>
              )}
            </div>
            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                return (
                  <div key={post._id} className={styles.singleCard}>
                    <div className={styles.singleCard__profileContainer}>
                      <img
                        className={styles.userProfile}
                        src={`${BASE_URL}/uploads/${authState.user?.userId?.profilePicture}`}
                        alt={post.userId.name}
                      />

                      <div>
                        <div
                          className={styles.trashContainer}
                          style={{ justifyContent: "space-between" }}
                        >
                          <p style={{ fontWeight: "bold" }}>
                            {post.userId.name}
                          </p>
                          {post.userId._id === authState.user?.userId?._id && (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                const token = localStorage.getItem("token");
                                const postId = post._id;
                                await dispatch(
                                  deletePost({
                                    token,
                                    postId,
                                  }),
                                );
                                await dispatch(getAllposts());
                              }}
                            >
                              <svg
                                style={{
                                  color: "red",
                                  height: "1.3em",
                                }}
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
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        <p style={{ color: "grey" }}>@{post.userId.username}</p>
                        <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>
                      </div>
                    </div>

                    {post.media && (
                      <div className={styles.singleCard__image}>
                        <img src={`${BASE_URL}/${post.media}`} alt="post" />
                      </div>
                    )}

                    <div className={styles.optionsContainer}>
                      <div
                        onClick={async () => {
                          const postId = post._id;
                          await dispatch(increamentPostLikes({ postId }));
                        }}
                        className={styles.singleOption__optionsContainer}
                        style={{ color: post.isLiked ? "#2563eb" : "inherit" }}
                        aria-pressed={post.isLiked ? "true" : "false"}
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
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        {post.likesCount}
                      </div>

                      <div
                        onClick={async () => {
                          await dispatch(
                            getAllComments({
                              postId: post._id,
                            }),
                          );
                        }}
                        className={styles.singleOption__optionsContainer}
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
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                          />
                        </svg>
                      </div>

                      <div
                        onClick={() => {
                          const text = encodeURIComponent(post.body);
                          const url = encodeURIComponent("apnacollege.in");
                          const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                          window.open(twitterUrl, "_blank");
                        }}
                        className={styles.singleOption__optionsContainer}
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
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {postState.postId !== "" && (
          <div
            onClick={() => {
              dispatch(resetPostId());
            }}
            className={styles.commentsContainer}
          >
            <div
              className={styles.allCommentsContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {postState.comments.length === 0 && <h2>no commnets</h2>}

              {/*  comment body */}
              {postState.comments.map((comment, index) => (
                <div
                  className={styles.singleComment}
                  key={comment._id || index}
                >
                  <div className={styles.singleComment__profileContainer}>
                    {/* <img
                      src={`${BASE_URL}/uploads/${comment.userId?.profilePicture}`}
                      alt=""
                    /> */}

                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        {comment.userId?.name}
                      </p>
                      <p>@{comment.userId?.username}</p>
                    </div>
                  </div>
                  <p>{comment.body}</p>
                </div>
              ))}

              <div className={styles.postCommentContainer}>
                <input
                  type="text"
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Comment"
                />

                <div
                  onClick={async () => {
                    await dispatch(
                      postComment({
                        postId: postState.postId,
                        body: commentText,
                      }),
                    );

                    await dispatch(
                      getAllComments({
                        postId: postState.postId,
                      }),
                    );
                  }}
                  className={styles.postCommentContainer__commentBtn}
                >
                  comment
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
