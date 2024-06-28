import React, { useRef, useState, useEffect } from "react";
import { content, likeURL } from "../utils/apiRoutes";
import { Typography, useMediaQuery, Box } from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";
import Forum from "./components/forum";

function MainWindow({ data, token }) {
  // const [data, setData] = useState([]);
  const [likedForums, setLikedForums] = useState([]);

  // useEffect(() => {
  //   const retrieved = async () => {
  //     const dat = await fetch(content, {
  //       method: "POST",
  //       body: JSON.stringify({ date: new Date() }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((res) => res.json());
  //     setData([...dat.data]);
  //   };
  //   retrieved();
  // }, []);

  useEffect(() => {
    if (token) {
      setLikedForums(token.liked);
    }
  }, [token]);

  return (
    <>
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
              return <Forum key={index} item={item} token={token} />;
            })}
          </div>
        </div>
    </>
  );
}

export default MainWindow;
