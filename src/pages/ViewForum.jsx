import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../utils/apiRoutes";
import Forum from "./components/forum";
import Comment from "./components/Comment";
import { useMediaQuery, Box, Typography } from "@mui/material";
import '../styles/forum.css'

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
              <Forum item={post} token={token} updateWindow={setUpdate} />
              <div
                style={{
                  width: matches ? 880 : "100%",
                  backgroundColor: "rgb(18,20,22)",
                  position: "relative",
                  left: matches ? "2%" : "",
                  top: "-10px",
                  paddingTop: "10px",
                  borderRadius: "5px 5px 20px 20px",
                }}
              >
                {post.comments.map((cmnt, index) => {
                  return <Comment key={index} token={token} cmnt={cmnt} />;
                })}
              </div>
            </>
          ) : failed ? (
            <div style={{ color: "white" }}>404 not found</div>
          ) : (
            <div>
              <Box
                className='blink'
                sx={{
                  color: "white",
                  backgroundColor: "rgb(25,30,35)",
                  borderRadius: "15px",
                  marginBottom: "10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
                style={
                  matches
                    ? { maxWidth: "900px" }
                    : { width: "calc(100vw - 60px)" }
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "3px",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "rgb(200,210,220)",
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  ></div>
                  <Box
                    sx={{
                      marginLeft: "8px",
                      fontWeight: 500,
                      height: "18px",
                      bgcolor: "rgb(120,125,130)",
                      borderRadius: "8px",
                      width: "100px",
                    }}
                  />
                </div>
                <div>
                  <Box
                    sx={{
                      fontWeight: 400,
                      paddingBottom: "5px",
                      height: "20px",
                      bgcolor: "rgb(180,185,190)",
                      width: "100%",
                      borderRadius: "10px",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      marginTop: "10px",
                      bgcolor: "rgb(100,105,110)",
                      borderRadius: "10px",
                      width: "100%",
                      height: "50px",
                    }}
                  ></Box>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "fit-content",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      px: 1,
                      py: 0.3,
                      my: 1.3,
                      mx: 0.3,
                      bgcolor: "rgb(60,65,70)",
                      borderRadius: "7px",
                      display: "flex",
                      alignItems: "center",
                      width: "40px",
                      height: "20px",
                      flexDirection: "row",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      color: "rgb(150,155,160)",
                      bgcolor: "rgb(60,65,70)",
                      borderRadius: "5px",
                      p: "3px",
                      width: "50px",
                      height: "20px",
                      marginLeft: "10px",
                    }}
                  ></Box>
                </div>
              </Box>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewForum;
