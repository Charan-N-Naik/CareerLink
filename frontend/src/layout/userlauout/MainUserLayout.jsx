import React from "react";
// import UserNavBar from "./NavBar";

import NavBar from "../../Components/NavBar/index.jsx";

export default  function UserLayout({children}){

    // heare childeren means the componets  passed by the nav pages that useing this one
    return (
        <>    
            {/* <UserNavBar></UserNavBar> */}
            {/* childeren componet from the any page that is useing  */}
            <NavBar></NavBar>
            <div>{children}</div>
            
        </>
    );
}