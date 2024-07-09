import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {
  addCmnt,
  deleteURL,
  getReplies,
  likeCmntURL,
} from "../../utils/apiRoutes";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";
import LoadingComment from "./LoadingComment";
import { processTime } from "../../utils/utilities";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import DeleteRounded from "@mui/icons-material/DeleteRounded";

function Comment({ cmnt, token, deleteFunc, path }) {
  const [replies, setReplies] = useState();
  const [update, setUpdate] = useState();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [loadCmt, setLoadCmt] = useState(false);
  const element = useRef(null);

  const highlighted = path.indexOf(cmnt._id) == path.length - 1;
  const [showReplies, setShowReplies] = useState(
    path.includes(cmnt._id) && !highlighted
  );

  const [openEditMenu, setOpenEditMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deletefun = (item) => {
    setReplies(
      replies.filter((i) => {
        return i._id != item._id;
      })
    );
  };

  const postComment = async () => {
    setLoadCmt(true);
    await fetch(addCmnt, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        body: replyText,
        tier: cmnt.tier + 1,
        replyTo: cmnt._id,
        to: cmnt.to,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 201) {
        setLoadCmt(false);
        res.json().then((json) => {
          setReplies([
            {
              body: replyText,
              tier: cmnt.tier + 1,
              from: { Username: token.Username },
              likes: [],
              to: cmnt.to,
              _id: json.id,
            },
            ...replies,
          ]);
        });
      }
    });
    if (!showReplies) {
      setShowReplies(true);
    }

    setReplyText("");
    setReplying(false);
  };

  useEffect(() => {
    const func = async () => {
      await fetch(getReplies, {
        method: "POST",
        body: JSON.stringify({ _id: cmnt._id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setReplies(json);
        });
    };
    func();
  }, []);

  useEffect(() => {
    setShowReplies(path.includes(cmnt._id) && !highlighted);
    if (highlighted) {
      element.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [path]);

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "inherit",
          marginRight: "auto",
          position: "relative",
          flexDirection: "row",
          // backgroundColor: highlighted ? "rgba(255,255,255,0.05)" : "",
        }}
        ref={element}
      >
        {highlighted && <div
          style={{
            position: "absolute",
            borderRadius: "15px",
            top: "0px",
            left: "0px",
            backgroundColor: "rgba(255,255,255,0.05)",
            width: "100%",
            height: "100%",
          }}
          className="highlight"
        />}
        <div
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            backgroundColor: "white",
            position: "relative",
            left: cmnt.tier * 25 - 10,
            top: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 20,
              color: "rgb(160,170,180)",
              p: 0,
              position: "relative",
              top: "1px",
              "&:hover": { cursor: "pointer" },
            }}
          >
            {cmnt.from.Username.charAt(0).toUpperCase()}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "inherit",
            marginRight: "auto",
            left: cmnt.tier * 25 - 7,
            paddingBottom: "10px",
            paddingTop: "10px",
            borderRadius: "10px",
            color: "rgb(230,235,240)",
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
            <Typography
              sx={{
                marginLeft: "8px",
                fontWeight: 500,
                fontSize: 16,
                color: "rgb(200,200,200)",
              }}
            >
              {cmnt.from.Username}
            </Typography>
            <Typography
              sx={{
                marginLeft: "8px",
                fontWeight: 500,
                fontSize: 15,
                color: "rgb(200,200,200,0.6)",
              }}
            >
              • {processTime(new Date(), new Date(cmnt.date))}
            </Typography>
          </div>
          <div style={{ width: `calc(100% - ${cmnt.tier * 25 + 3}px)` }}>
            <Typography
              variant="subtitle"
              sx={{
                wordBreak: "break-all",
                marginLeft: "2px",
                color: "rgb(230,235,240)",
              }}
            >
              {cmnt.body}
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
                bgcolor: "rgb(30,35,40)",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                flexDirection: "row",
              }}
              onClick={function () {
                console.log(token);
                if (token) {
                  fetch(likeCmntURL, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                      id: cmnt._id,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (cmnt.likes.includes(token.id)) {
                    setUpdate(!update);
                    cmnt.likes.splice(cmnt.likes.indexOf(token.id), 1);
                  } else {
                    setUpdate(!update);
                    cmnt.likes.push(token.id);
                  }
                }
              }}
            >
              {token && cmnt.likes.includes(token.id) ? (
                <Favourite sx={{ color: "rgb(220,80,80)" }} />
              ) : (
                <FavouriteBorder
                  sx={{ "&:hover": { color: "rgb(255,100,100)" } }}
                />
              )}
              {cmnt.likes.length > 0 ? (
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
                    {cmnt.likes.length}
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
                marginLeft: "5px",
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
        </div>

        <Box
          sx={{
            position: "absolute",
            right: "10px",
            top: "0px",
            bgcolor: openEditMenu ? "rgb(10,15,20)" : "",
            p: "5px",
            borderRadius: "25px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {cmnt.from.Username == token?.Username && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: openEditMenu ? "rgb(30,35,40)" : "rgba(20,25,30,0)",
                  "&:hover": { bgcolor: "rgba(220,230,240,0.2)" },
                  borderRadius: "50%",
                  height: "35px",
                  width: "35px",
                }}
                onClick={function () {
                  setOpenEditMenu((v) => !v);
                }}
              >
                <MoreHoriz sx={{ p: "3px", color: "rgb(200,210,220)" }} />
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
                    setDeleting(true);
                  }}
                >
                  <DeleteRounded sx={{ color: "rgb(210,220,230)", p: "5px" }} />
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
            <Typography sx={{ fontWeight: "600", color: "rgb(220,230,240)" }}>
              Are you sure?
            </Typography>
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
                onClick={async function () {
                  await fetch(deleteURL, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                      id: cmnt._id,
                      type: "Comment",
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }).then((res) => {
                    if (res.status == 201) {
                      deleteFunc(cmnt);
                    }
                  });
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
                  marginLeft: "auto",
                  transition: "0.2s",
                }}
                onClick={function () {
                  setOpenEditMenu(false);
                  setDeleting(false);
                }}
              >
                No
              </Typography>
            </div>
          </div>
        )}
      </div>
      {replying ? (
        <>
          <TextField
            autoFocus
            sx={{
              width: "calc(100% - 80px)",
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
                marginLeft: "40px",
                top: "-10px",
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
      {replies && replies.length > 0 ? (
        <Typography
          variant="subtitle2"
          sx={{
            color: "rgb(150,155,160)",
            position: "relative",
            width: "fit-content",
            left: `calc(40px + ${cmnt.tier * 25 - 7}px)`,
            top: "-5px",
            "&:hover": {
              cursor: "pointer",
              color: "rgb(180,185,190)",
            },
          }}
          onClick={function () {
            setShowReplies((v) => !v);
          }}
        >
          {showReplies ? "Hide" : "Show"} replies ({replies.length})..
        </Typography>
      ) : (
        <></>
      )}

      {loadCmt && <LoadingComment tier={cmnt.tier + 1} />}

      {showReplies && replies ? (
        <>
          {replies.map((cmnt, index) => {
            return (
              <Comment
                key={cmnt._id}
                deleteFunc={deletefun}
                path={path}
                token={token}
                cmnt={cmnt}
              />
            );
          })}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Comment;
