// Component button click
//         ↓
// dispatch(action)
//         ↓
// reducer receives action
//         ↓
// reducer updates state
//         ↓
// store stores updated state
//         ↓
// component gets state using useSelector


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"




const store = configureStore({
    reducer:{
        auth:authReducer, // this is the registering the reducer in the store and the auth is the name of the reducer that we will use in the useSelector to get the state from the store and the authReducer is the reducer that we created in the authReducer/index.js file and we will use this reducer to update the state in the store when we dispatch an action from the component and this reducer will receive the action and update the state in the store and then we can get the updated state from the store using useSelector in the component
        posts:postReducer
    }
})





// flow 

// flow 

// first we create the action defined the api call and palyload
// second we create the reducer in that we are handling the states and the action that we created 
// third we register the reducer in the store and then we can use those reduce useing dispatch in the componets and get the state 

export default store;