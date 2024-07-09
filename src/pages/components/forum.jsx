import React, { useState } from "react";
import { likeURL, addCmnt, deleteURL } from "../../utils/apiRoutes";
import {
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Box,
} from "@mui/material";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";
import { Navigate } from "react-router-dom";
import { processTime } from "../../utils/utilities";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import "../../styles/forum.css";

function Forum({ item, token, deleteFunc, updateWindow, setLoadCmnt }) {
  const matches = useMediaQuery("(min-width:900px)");
  const [redirect, setRedirect] = useState(false);
  const [update, setUpdate] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  let like = 0;

  const postComment = async () => {
    setLoadCmnt(true);
    await fetch(addCmnt, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        body: replyText,
        tier: 1,
        to: item._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 201) {
        setLoadCmnt(false);
        res.json().then((json) => {
          item.comments.unshift({
            body: replyText,
            tier: 1,
            from: { Username: token.Username },
            likes: [],
            to: item._id,
            _id: json.id,
          });

          updateWindow((v) => !v);
        });
      }
    });

    setReplyText("");
    setReplying(false);
  };

  const handleclick = async (item) => {
    if (like == 0) {
      if (!replying) setRedirect(true);
    } else {
      if (like == 1) {
        console.log("like");

        if (item.likes.includes(token.id)) {
          setUpdate(!update);
          item.likes.splice(item.likes.indexOf(token.id), 1);
        } else {
          setUpdate(!update);
          item.likes.push(token.id);
        }

        if (token) {
          await fetch(likeURL, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
              id: item._id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.status == 401) {
              if (item.likes.includes(token.id)) {
                setUpdate(!update);
                item.likes.splice(item.likes.indexOf(token.id), 1);
              } else {
                setUpdate(!update);
                item.likes.push(token.id);
              }
            }

            sessionStorage.setItem(
              "chineseWhisperToken",
              JSON.stringify(token)
            );
          });
        }
      }
      if (like == 2) {
        if (!replying || (replying && replyText == "")) setReplying(!replying);
        else {
          postComment();
        }
      }
      if (like == 3) {
        setOpenEditMenu((v) => !v);
      }
      if (like == 4) {
        await fetch(deleteURL, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            id: item._id,
            type: "Post",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.status == 201) {
            deleteFunc(item);
          }
        });
      }
      if (like == 5) {
        setDeleting(true);
        console.log(deleting);
      }
      like = 0;
    }
  };
  return (
    <>
      {redirect ? <Navigate to={`/forum/${item._id}?path=`} /> : <></>}
      <Box
        sx={{
          position: "relative",
          color: "white",
          backgroundColor: "rgb(20,25,28)",
          borderRadius: "15px",
          marginBottom: "10px",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          "&:hover": !deleting
            ? {
                backgroundColor: "rgb(25,30,35)",
                cursor: "pointer",
              }
            : {},
        }}
        style={matches ? { width: "900px" } : { width: "calc(100vw - 50px)" }}
        onClick={() => {
          if (!deleting) handleclick(item);
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
              width: 25,
              height: 25,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: 20,
                color: "rgb(160,170,180)",
                p: 0,
                position: "relative",
                top: "-1px",
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
              fontSize: 16,
              color: "rgb(200,200,200)",
            }}
          >
            {item.createdBy.Username}
          </Typography>
          <Typography
            sx={{
              marginLeft: "8px",
              fontWeight: 500,
              fontSize: 15,
              color: "rgb(200,200,200,0.6)",
            }}
          >
            • {processTime(new Date(), new Date(item.createdAt))}
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
                token && item.likes.includes(token.id)
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
            {token && item.likes.includes(token.id) ? (
              <Favourite />
            ) : (
              <FavouriteBorder
                sx={{ "&:hover": { color: "rgb(255,100,100)" } }}
              />
            )}
            {item.likes.length > 0 ? (
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
                  {item.likes.length}
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
              like = 2;
            }}
          >
            {replying ? "Post" : "Reply"}
          </Button>

          {!token ? (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                alignContent: "center",
                textAlign: "right",
                position: "absolute",
                width: "140px",
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
          )}
        </div>
        {replying ? (
          <>
            <TextField
              autoFocus
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
                  marginLeft: "20px",
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
        <Box
          sx={{
            position: "absolute",
            right: "10px",
            top: "5px",
            bgcolor: openEditMenu ? "rgb(10,15,20)" : "",
            p: "5px",
            borderRadius: "25px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {item.createdBy.Username == token?.Username && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  float: "right",
                  bgcolor: openEditMenu ? "rgb(30,35,40)" : "rgba(20,25,30,0)",
                  "&:hover": { bgcolor: "rgba(220,230,240,0.2)" },
                  borderRadius: "50%",
                  height: "35px",
                  width: "35px",
                }}
                onClick={function () {
                  like = 3;
                }}
              >
                <MoreHorizIcon sx={{ p: "3px", color: "rgb(200,210,220)" }} />
              </Box>
              {openEditMenu && (
                <Box
                  className="slideAnim"
                  sx={{
                    display: "flex",
                    marginTop: "10px",
                    borderRadius: "50%",
                    "&:hover": { bgcolor: "rgba(250,90,90,0.3)" },
                    justifyContent: "center",
                  }}
                  onClick={function () {
                    like = 5;
                  }}
                >
                  <DeleteRoundedIcon
                    sx={{ color: "rgb(210,220,230)", p: "5px" }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
        {deleting && (
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: "15px",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0px",
              left: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontWeight: "600" }}>Are you sure?</Typography>
            <div
              style={{
                display: "flex",
                margin: "7px",
                flexDirection: "row",
                width: "100px",
              }}
            >
              <Typography
                sx={{
                  color: "rgb(200,150,150)",
                  "&:hover": {
                    bgcolor: "rgba(200,50,50,0.8)",
                    cursor: "pointer",
                    color: "white",
                  },
                  px: "5px",
                  borderRadius: "10px",
                  transition: "0.2s",
                }}
                onClick={function(){
                  like = 4;
                  handleclick(item);
                }}
              >
                Yes
              </Typography>
              <Typography
                sx={{
                  color: "rgb(150,150,200)",
                  "&:hover": {
                    bgcolor: "rgba(50,50,200,0.8)",
                    cursor: "pointer",
                    color: "white",
                  },
                  px: "5px",
                  borderRadius: "10px",
                  marginLeft:'auto',
                  transition: "0.2s",
                }}
                onClick={function(){setOpenEditMenu(false);setDeleting(false);}}
              >
                No
              </Typography>
            </div>
          </div>
        )}
      </Box>
    </>
  );
}

export default Forum;
