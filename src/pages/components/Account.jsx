import React from "react";
import { Typography, Box } from "@mui/material";

function Account({ token, onClick }) {
  return (
    <div onClick={onClick}>
      <Box
        sx={{
          borderRadius: "50%",
          marginLeft:'5px',
          border: "solid rgba(0,0,0,0) 3px",
          "&:hover": { border: "solid rgb(80,80,80) 3px", cursor: "pointer" },
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(30,35,40)",
            width:'40px',
            height:'40px',
            borderRadius: "50%",
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 30,
              color: "rgb(180,190,200)"
            }}
          >
            {token.Username.charAt(0).toUpperCase()}
          </Typography>
        </div>
      </Box>
    </div>
  );
}

export default Account;
