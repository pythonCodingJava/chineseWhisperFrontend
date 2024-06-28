import React, { useEffect, useState } from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import { addCmnt, getReplies, likeCmntURL } from "../../utils/apiRoutes";
import Favourite from "@mui/icons-material/Favorite";
import FavouriteBorder from "@mui/icons-material/FavoriteBorder";

function Comment({ cmnt, token }) {
  const [replies, setReplies] = useState();
  const [update, setUpdate] = useState();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const postComment = async () => {
    await fetch(addCmnt, {
      method: "POST",
      body: JSON.stringify({
        body: replyText,
        tier: cmnt.tier + 1,
        from: token.Username,
        replyTo: cmnt._id,
        to: cmnt.to,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status == 201) {
        res.json().then((json) => {
          setReplies([
            ...replies,
            {
              body: replyText,
              tier: cmnt.tier + 1,
              from: { Username: token.Username },
              likes: 0,
              to: cmnt.to,
              _id: json.id,
            },
          ]);
        });
      }
    });

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
        style={{ display: "flex", marginRight: "auto", flexDirection: "row" }}
      >
        <div
          style={{
            width: 30,
            height: 30,
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
              position: "relative",
              top: "-2px",
              left: "7px",
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
          <Typography
            variant="subtitle"
            sx={{
              margin: "2px",
              marginLeft: "10px",
              color: "rgb(230,235,240)",
            }}
          >
            {cmnt.body}
          </Typography>

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
                    body: JSON.stringify({
                      id: cmnt._id,
                      user: token.Username,
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
                  
                  sessionStorage.setItem("chineseWhisperToken", JSON.stringify(token));
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

      {replies ? (
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
