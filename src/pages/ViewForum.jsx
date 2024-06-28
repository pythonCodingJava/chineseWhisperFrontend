import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../utils/apiRoutes";
import Forum from "./components/forum";
import Comment from "./components/Comment";
import { useMediaQuery } from "@mui/material";

function ViewForum({ token }) {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [failed, setFailed] = useState(false);
  const [update, setUpdate] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");

  useEffect(() => {
    const func = async () => {
      await fetch(getPost, {
        method: "POST",
        body: JSON.stringify({ id: postId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status == 400) {
            console.log("error");
            setFailed(true);
          } else {
            setPost(json);
          }
        });
    };
    func();
  }, []);
  return (
    <>
      {post != null ? (
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
          <Forum item={post} token={token} updateWindow={setUpdate} />
          <div
            style={{
              width: matches ? 880 : "100%",
              backgroundColor: "rgb(18,20,22)",
              position: "relative",
              left:(matches?"2%":""), 
              top: "-10px",
              paddingTop: "10px",
              borderRadius: "5px 5px 20px 20px",
            }}
          >
            {post.comments.map((cmnt, index) => {
              return <Comment key={index} token={token} cmnt={cmnt} />;
            })}
          </div>
          </div>
        </div>
      ) : failed ? (
        <div style={{ color: "white" }}>404 not found</div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ViewForum;
