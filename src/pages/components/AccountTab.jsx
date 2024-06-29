import React, {useState} from "react";
import { Typography, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Navigate } from "react-router-dom";
import {logoutURL} from '../../utils/apiRoutes'

function AccountTab({ token, setAccountTab }) {
    const [redirect, setRedirect] = useState(false);
  const logout = async () => {
    await fetch(logoutURL, {
      method:'GET',
      credentials:'include',
      headers:{
        "Content-Type":"application/json"
      }
    }).then((res)=>{
      console.log(res);
      if(res.status == 201){
        token.setToken(null);
        sessionStorage.removeItem("chineseWhisperToken");
        setAccountTab(false);
        document.cookie = "uid=;"
        setRedirect(true);
      }
    })
  };

  return (
    <>
    {redirect?<Navigate to="/" />:<></>}
    {token.token?
    <div
      style={{
        backgroundColor: "rgb(30,35,40)",
        borderRadius: "10px",
        padding: "10px",
        position: "fixed",
        top: "70px",
        right: "5px",
      }}
    >
      <Box sx={{ width: "200px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "rgb(240,245,250)" }}
        >
          {token.token.Username}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "rgb(150,150,150)" }}>
          View Profile
        </Typography>
        <hr color="gray"></hr>
      </Box>
      <Box
        sx={{
          width: "200px",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          "&:hover": { cursor: "pointer", bgcolor: "rgb(255,255,255,0.05)" },
        }}
        onClick={logout}
      >
        <LogoutIcon sx={{ color: "rgb(220,225,230)", m: "10px" }} />
        <Typography
          variant="body"
          sx={{
            fontWeight: "500",
            color: "rgb(240,245,250)",
            fontSize: "16px",
          }}
        >
          Log out
        </Typography>
      </Box>
    </div>:<></>}
    </>
  );
}

export default AccountTab;
