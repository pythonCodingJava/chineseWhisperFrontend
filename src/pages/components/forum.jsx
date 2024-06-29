import React, { useState } from "react";
import { likeURL,addCmnt } from "../../utils/apiRoutes";
import { Typography, TextField, Button, useMediaQuery, Box } from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";
import { Navigate } from "react-router-dom";

function Forum({ item, token, updateWindow }) {
  const matches = useMediaQuery("(min-width:900px)");
  const [redirect, setRedirect] = useState(false);
  const [update, setUpdate] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  let like = 0;

  const postComment = async () => {
    await fetch(addCmnt, {
      method: "POST",
      credentials:'include',
      body: JSON.stringify({
        body: replyText,
        tier:1,
        to: item._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 201) {
        res.json().then((json) => {
          item.comments.unshift(
            {
              body: replyText,
              tier: 1,
              likes: 0,
              to: item._id,
              _id: json.id,
            }
            );
            
    updateWindow((v)=>!v);
        });
      }
    });

    setReplyText("");
    setReplying(false);
    
  };


  const handleclick = (item) => {
    if (like == 0) {
      setRedirect(true);
    } else {
      if (like == 1) {
        console.log("like");
        if (token) {
          fetch(likeURL, {
            method: "POST",
            credentials:'include',
            body: JSON.stringify({
              id: item._id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (token.liked.includes(item._id)) {
            setUpdate(!update)
            item.likes--;
            token.liked.splice(token.liked.indexOf(item._id), 1);
          } else {
            setUpdate(!update)
            item.likes++;
            token.liked.push(item._id);
          }
          sessionStorage.setItem("chineseWhisperToken", JSON.stringify(token));
        }
      }
      like = 0;
    }
  };
  return (
    <>
      {redirect ? <Navigate to={`/forum/${item._id}`} /> : <></>}
      <Box
        sx={{
          color: "white",
          backgroundColor: "rgb(20,25,28)",
          borderRadius: "15px",
          marginBottom: "10px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            backgroundColor: "rgb(25,30,35)",
            cursor: "pointer",
          },
        }}
        style={matches ? { maxWidth: "900px" } : {width:'calc(100vw - 60px)'}}
        onClick={() => {
          handleclick(item);
        }}
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
              backgroundColor: "white",
              display:'flex',
              justifyContent:'center',
              alignContent:'center'
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 24,
                color: "rgb(160,170,180)",
                position:'relative',
                top:'-1px',
                p: 0,
                "&:hover": { cursor: "pointer" },
              }}
            >
              {item.createdBy.Username.charAt(0).toUpperCase()}
            </Typography>
          </div>
          <Typography
            sx={{
              marginLeft: "8px",
              fontWeight: 500,
              fontSize: 18,
              color: "rgb(200,200,200)",
            }}
          >
            {item.createdBy.Username}
          </Typography>
        </div>
        <div>
          <Typography
            sx={{ fontWeight: 400, paddingBottom: "5px", fontSize: 20 }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="subtitle"
            sx={{ marginTop: "10px", color: "rgb(170,170,170)" }}
          >
            {item.body}
          </Typography>
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
              bgcolor:
                token && token.liked.includes(item._id)
                  ? "rgb(200,50,50)"
                  : "rgb(30,35,40)",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
            onClick={function () {
              like = 1;
            }}
          >
            {token && token.liked.includes(item._id) ? (
              <Favourite />
            ) : (
              <FavouriteBorder
                sx={{ "&:hover": { color: "rgb(255,100,100)" } }}
              />
            )}
            {item.likes > 0 ? (
              <>
                <Typography
                  variant="subtitle"
                  sx={{
                    paddingLeft: "5px",
                    color: "rgb(220,220,220)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {item.likes}
                </Typography>
              </>
            ) : (
              <></>
            )}
          </Box>
          <Button
              sx={{
                color: replying ? "rgb(240,250,255)" : "rgb(150,155,160)",
                bgcolor: replying ? "rgb(70,70,200)" : "rgb(30,35,40)",
                borderRadius: "5px",
                p: "3px",
                marginLeft: "10px",
              }}
              onClick={function () {
                if (!replying || (replying && replyText == ""))
                  setReplying(!replying);
                else {
                    postComment();
                }
              }}
            >
              {replying ? "Post" : "Reply"}
            </Button>

          {/* {!token ? (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                alignContent: "center",
                textAlign: "right",
                position: "absolute",
                width: "130px",
                height: "30px",
                borderRadius: "12px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "400",
                  color: "rgb(190,190,190)",
                  paddingRight: "12px",
                }}
              >
                Log In..
              </Typography>
            </div>
          ) : (
            <></>
          )} */}
        </div>
        {replying ? (
        <>
          <TextField
            sx={{
              width: "calc(100% - 20px)",
            }}
            value={replyText}
            onChange={function (val) {
              setReplyText(val.target.value);
            }}
            InputProps={{
              style: {
                borderRadius: "20px",
                color: "rgb(220,225,230)",
                position: "relative",
                backgroundColor: "rgb(50,55,60)",
                top: "0",
                marginLeft:"20px",
                height: "50px",
                border: "none",
              },
              
            }}
            onKeyDown={function (event) {
                if (event.key == "Enter") {
                  postComment();
                }
              }}
          />
        </>
      ) : (
        <></>
      )}
      </Box>
      
    </>
  );
}

export default Forum;
