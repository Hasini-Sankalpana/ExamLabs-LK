
import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

   
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    
   
    const contextValue = {
           url,
           token,
           setToken,
  

    }

    useEffect (() => {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));

        }
    },[])

    return(
        <StoreContext.Provider value={contextValue}>
        {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider; //1.05
