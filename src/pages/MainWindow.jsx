import React, { useRef, useState, useEffect } from "react";
import { content, likeURL } from "../utils/apiRoutes";
import { Typography, useMediaQuery, Box } from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";
import Forum from "./components/forum";

function MainWindow({ data, token }) {
  const [likedForums, setLikedForums] = useState([]);

  useEffect(() => {
    if (token) {
      setLikedForums(token.liked);
    }
  }, [token]);

  return (
    <>
      <title>Chinese Whisper</title>
      {data[0] ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "10px",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {data.map((item, index) => {
              return <Forum key={index} item={item} updateWindow={function(){}} setLoadCmnt={function(){}} token={token} />;
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            color: "white",
            fontSize: "60px",
            left: "50vw",
            top: "50vh",
            transform: "translate(-50%,-50%)",
          }}
        >
          ...
        </div>
      )}
    </>
  );
}

export default MainWindow;
