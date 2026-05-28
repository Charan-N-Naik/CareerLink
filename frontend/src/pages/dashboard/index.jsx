import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllposts } from "@/config/redux/action/postAction";

import { getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/userlauout/MainUserLayout";
import DashboardLayout from "@/layout/dashboardlayout";

export default function dashboard() {
  const dispatch = useDispatch();
  const [isTokenthere, setisTokenthere] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      window.location.href = "/login";
    }
    setisTokenthere(true);
  }, []);

  useEffect(() => {
    if (isTokenthere) {
      // console.log("dispatch is called");
      dispatch(getAllposts());
      console.log("dispach is ended");
      // console.log(usertoken);
      dispatch(getAboutUser());
    }
  }, [isTokenthere, dispatch]);

  const authState = useSelector((state) => state.auth);

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
        <div>Dashboard</div>
      </DashboardLayout>
    </UserLayout>
  );
}
