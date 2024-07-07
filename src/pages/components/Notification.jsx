import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import { Navigate, useLocation } from "react-router-dom";
import { getCmtPath } from "../../utils/apiRoutes";
import ModeCommentIcon from "@mui/icons-material/ModeComment";

function Notification({ notifications, setTab, order }) {
  const [url, setUrl] = useState();
  const location = useLocation();
  const initRender = useRef(false);

  const handleCmtPath = async (cmtid) => {
    await fetch(getCmtPath, {
      method: "POST",
      body: JSON.stringify({ id: cmtid }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setUrl(`/forum/${json.forum}?path=${json.path.toString()}`);
      });
  };

  useEffect(() => {
    if (initRender.current) setTab((v) => !v);
    else {
      initRender.current = true;
    }
  }, [location]);

  useEffect(() => {
    setUrl();
  }, [url]);

  return (
    <div
      style={{
        backgroundColor: "rgb(25,30,33)",
        borderRadius: "10px",
        position: "fixed",
        top: "70px",
        right: "55px",
        width: "300px",
        height: "350px",
        overflowY: "auto",
        fontSize: "20px",
      }}
      className="removeScrollBar"
    >
      {url && <Navigate to={url} />}
      {order.current.map((i, index) => {
        const item = notifications.get(i);
        return (
          <Box
            key={index}
            sx={{
              width: "100%",
              height: "65px",
              bgcolor:
                item.type == "like"
                  ? "rgba(250,50,50,0.1)"
                  : item.type == "comment"
                  ? "rgba(50,150,250,0.1)"
                  : "",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                cursor: "pointer",
                bgcolor: 
                item.type == "like"
                ? "rgba(250,50,50,0.2)"
                : item.type == "comment"
                ? "rgba(50,150,250,0.2)"
                : "",
              },
            }}
            onClick={function () {
              if (item.liking == "post") setUrl(`/forum/${item.id}`);
              else {
                handleCmtPath(item.id);
              }
            }}
          >
            <div
              style={{
                backgroundColor: item.type=='comment'?"rgb(50,100,150)":item.type=='like'?'rgb(180,50,50)':'',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                margin: "10px",
              }}
            >
              {item.type=='like'&&<Favourite sx={{ color: "rgb(220,230,240)" }} />}
              {item.type=='comment'&&<ModeCommentIcon sx={{ color: "rgb(220,230,240,1)" }} />}
            </div>
            <Typography sx={{ color: "rgb(240,245,250)", width: "250px" }}>
              {item.type=='like'?`${item.user} and ${item.likes - 1} others liked your ${item.liking} `:`${item.user} ${item.commenting=='post'?'said':'replied'} "${item.body}" on your ${item.commenting} `}
              "<b>{item.title}</b>"
            </Typography>
          </Box>
        );
      })}
    </div>
  );
}

export default Notification;
