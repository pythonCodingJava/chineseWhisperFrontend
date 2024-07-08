import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import { Navigate, useLocation } from "react-router-dom";
import { getCmtPath } from "../../utils/apiRoutes";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import LoadingForum from "./LoadingForum";
import { processTime } from "../../utils/utilities";

function Notification({ notifications, setTab, order }) {
  const [url, setUrl] = useState();
  const location = useLocation();
  const initRender = useRef(false);

  const handleStrings = (str) => {
    return str.length > 50 ? `${str.substring(0, 50)}..` : str;
  };

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
        // window.location.reload();
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
        width: "350px",
        height: "400px",
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
              if (item.liking == "post") setUrl(`/forum/${item.id}?path=`);
              else {
                handleCmtPath(item.id);
              }
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    item.type == "comment"
                      ? "rgb(50,100,150)"
                      : item.type == "like"
                      ? "rgb(180,50,50)"
                      : "",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  margin: "10px",
                }}
              >
                {item.type == "like" && (
                  <Favourite sx={{ color: "rgb(220,230,240)" }} />
                )}
                {item.type == "comment" && (
                  <ModeCommentIcon sx={{ color: "rgb(220,230,240,1)" }} />
                )}
              </div>
              </div>
            <Typography
              sx={{
                color: "rgb(240,245,250)",
                width: "275px",
                m: "10px 0px 10px 0px",
                fontSize: "14px",
              }}
            >
              {item.type == "like"
                ? `${item.user} and ${item.likes - 1} others liked your ${
                    item.liking
                  } `
                : `${item.user} ${
                    item.commenting == "post" ? "said" : "replied"
                  } "${handleStrings(item.body)}" on your ${item.commenting} `}
              "<b>{handleStrings(item.title)}</b>"
            </Typography>
            <Typography sx={{color:'rgb(200,210,220,0.6)', fontWeight:'500', fontSize:'11px'}}>{processTime(new Date(),new Date(item.date))}.</Typography>
            
          </Box>
        );
      })}

      <div
        style={{
          backgroundColor: "rgb(50,55,60)",
          width: "350px",
          borderRadius:'8px 8px 20px 20px',
          position: "fixed",
          top: "461px",
        }}
      >
        <Typography
          sx={{
            color: "rgb(220,230,240,0.7)",
            fontSize: "12px",
            m: "3px",
            textAlign: "center",
          }}
        >
          Notifications stay for 3 days after which they are removed
        </Typography>
      </div>
    </div>
  );
}

export default Notification;
