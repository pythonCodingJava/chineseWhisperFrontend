import React, { useEffect, useState } from "react";
import { Typography, Box, Button, TextField, useMediaQuery } from "@mui/material";
import { addCmnt, getReplies, likeCmntURL } from "../../utils/apiRoutes";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";

function Comment({ cmnt, token }) {
  const matches = useMediaQuery("(min-width:900px)");
  const [replies, setReplies] = useState();
  const [update, setUpdate] = useState();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [showReplies, setShowReplies] = useState(false);
  const [loadCmt, setLoadCmt] = useState(false);

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
              likes: 0,
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

  return (
    <>
      <div
        style={{ display: "flex", width:'inherit' ,marginRight: "auto", flexDirection: "row" }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: "50%",
            backgroundColor: "white",
            position: "relative",
            left: cmnt.tier * 25 - 10,
            top: 8,
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 24,
              color: "rgb(160,170,180)",
              position:'absolute',
              top:'17px',
              left:'14px',
              transform:'translate(-50%,-50%)',
              p: 0,
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
            width:'inherit',
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
                position: "relative",
                top: "1.5px",
                fontWeight: 500,
                fontSize: 18,
                color: "rgb(200,200,200)",
              }}
            >
              {cmnt.from.Username}
            </Typography>
          </div>
          <div style={{width: `calc(100% - ${cmnt.tier*25 + 3}px)`}}>
            <Typography
            variant="subtitle"
            sx={{
              wordBreak:'break-all',
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
                  if (token.likedcmt.includes(cmnt._id)) {
                    setUpdate(!update);
                    cmnt.likes--;
                    token.likedcmt.splice(token.likedcmt.indexOf(cmnt._id), 1);
                  } else {
                    setUpdate(!update);
                    cmnt.likes++;
                    token.likedcmt.push(cmnt._id);
                  }

                  sessionStorage.setItem(
                    "chineseWhisperToken",
                    JSON.stringify(token)
                  );
                }
              }}
            >
              {token && token.likedcmt.includes(cmnt._id) ? (
                <Favourite sx={{ color: "rgb(220,80,80)" }} />
              ) : (
                <FavouriteBorder
                  sx={{ "&:hover": { color: "rgb(255,100,100)" } }}
                />
              )}
              {cmnt.likes > 0 ? (
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
                    {cmnt.likes}
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
      </div>
      {replying ? (
        <>
          <TextField
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
            left: `calc(40px + ${cmnt.tier*25 - 7}px)`,
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

      {loadCmt && <>
        <div className="blink"
        style={{ display: "flex", marginRight: "auto", flexDirection: "row" }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "rgb(200,210,220)",
            position: "relative",
            left: (cmnt.tier+1) * 25 - 10,
            top: 8,
          }}
        >
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            marginRight: "auto",
            left: (cmnt.tier+1) * 25 - 7,
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
            <Box
              sx={{
                marginLeft: "8px",
                position: "relative",
                top: "5px",
                borderRadius:'8px',
                fontWeight: 500,
                height: '18px',
                width:'100px',
                bgcolor: "rgb(120,125,130)",
              }}
            >
            </Box>
          </div>
          <Box
            sx={{
              margin: "2px",
              marginLeft: "10px",
              bgcolor: "rgb(220,230,240)",
              height:'20px',
              width:'100%',
              position:'relative',
              top:'10px',
              borderRadius:'10px'
            }}
          >
          </Box>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              width: "fit-content",
              position:'relative',
              top:'10px'
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
                width: "35px",
                height:'15px',
                flexDirection: "row",
              }}
              
            >
            </Box>
            <Box
              sx={{
                bgcolor: "rgb(60,65,70)",
                borderRadius: "7px",
                p: "3px",
                marginLeft: "5px",
                height:'15px',
                width:'50px'
              }}
            >
            </Box>

          </div>
        </div>
      </div>
      </>}

      {showReplies && replies ? (
        <>
          {replies.map((cmnt, index) => {
            return <Comment key={index} token={token} cmnt={cmnt} />;
          })}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Comment;
