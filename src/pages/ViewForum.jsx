import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getPost } from "../utils/apiRoutes";
import Forum from "./components/forum";
import Comment from "./components/Comment";
import { useMediaQuery, Box, Typography } from "@mui/material";
import "../styles/forum.css";
import LoadingComment from "./components/LoadingComment";
import LoadingForum from "./components/LoadingForum";

function ViewForum({ token }) {
  const params = useParams();
  let postId = params.postId;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [path, setPath] = useState([]);
  const [post, setPost] = useState();
  const [failed, setFailed] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loadCmt, setLoadCmnt] = useState(false);
  const matches = useMediaQuery("(min-width:900px)");

  useEffect(()=>{
    postId = params.postId;
    setPath(searchParams.get("path").split(","));
    setUpdate((v)=>!v);
  },[location])

  useEffect(() => {
    
    setPost(null);
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
  }, [postId]);

  // useEffect(()=>{
  //   setPath(searchParams.get("path").split(","));
  // },[searchParams.get("path")])

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
          {post != null ? (
            <>
              <title>{post.title}</title>
              <Forum
                item={post}
                setLoadCmnt={setLoadCmnt}
                token={token}
                updateWindow={setUpdate}
              />
              <div
                style={{
                  width: matches ? 880 : "calc(100%)",
                  backgroundColor: "rgb(18,20,22)",
                  position: "relative",
                  left: matches ? "2%" : "",
                  top: "-10px",
                  paddingTop: "10px",
                  borderRadius: "5px 5px 20px 20px",
                }}
              >
                {loadCmt && <LoadingComment tier={1} />}
                {post.comments.map((cmnt, index) => {
                  return (
                    <Comment
                      key={index}
                      path={path}
                      token={token}
                      cmnt={cmnt}
                    />
                  );
                })}
              </div>
            </>
          ) : failed ? (
            <div style={{ color: "white" }}>404 not found</div>
          ) : (
            <LoadingForum />
          )}
        </div>
      </div>
    </>
  );
}

export default ViewForum;
