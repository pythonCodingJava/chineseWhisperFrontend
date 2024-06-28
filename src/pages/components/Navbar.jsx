import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled, { keyframes } from "styled-components";
import Add from "@mui/icons-material/Add";
import Login from "../Login";
import Register from "../Register";
import Account from "./Account";
import { Link, Navigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const Diiv = styled.div`
  transition: opacity 0.5s;
  opacity: ${(props) => (props.$a ? 1 : 0)};
`;

function Navbar({ tab, token, login, loading, setRetrieve, setLogin }) {
  const [appear, setAppear] = useState();
  // const [login, setLogin] = useState();
  const [register, setRegister] = useState();
  const [redirect, setRedirect] = useState(false);
  const matches = useMediaQuery("(min-width:850px)");
  const ref = useRef(null);

  useEffect(() => {
    if (loading) {
      ref.current.continuousStart();
    } else {
      ref.current.complete();
      setRedirect(true);
    }
  }, [loading]);

  useEffect(() => {
    setRedirect(false);
  }, [redirect]);

  useEffect(() => {
    setAppear(login);
  }, [login]);

  return (
    <div
      style={{ position: "fixed", width: "100vw", backgroundColor: "#0E1113" }}
    >
      <LoadingBar color="rgb(200,50,50)" ref={ref} />
      {redirect ? <Navigate to="/"></Navigate> : <></>}
      <Box
        sx={{
          height: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          color: "white",
        }}
      >
        <Box
          style={{ textDecoration: "none", marginRight: "auto" }}
          sx={{"&:hover":{cursor:'pointer'}}}
          onClick={function () {
            setRetrieve((v) => !v);
          }}
        >
          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                float: "left",
                color: "white",
                width: "42px",
                backgroundColor: "rgb(200,50,50)",
                padding: "10px 8px",
                textAlign: "center",
                fontWeight: "900",
                fontSize: "20px",
                marginLeft: "5px",
                borderRadius: "50%",
              }}
            >
              中文
            </div>
            <Typography
              variant="h4"
              style={{
                marginLeft: "10px",
                color: "rgb(215,218,220)",
                fontWeight: "800",
              }}
            >
              {matches ? "whisper" : ""}
            </Typography>
          </div>
        </Box>

        <TextField
          placeholder="Search"
          sx={{ maxWidth: "650px", width: "100%", px: "20px" }}
          InputProps={{
            style: {
              margin: "10px",
              height: "40px",
              borderRadius: "24px",
              border: "none",
              backgroundColor: "rgb(30,35,40)",
              color: "white",
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        />
        {!token.token ? (
          <Button
            onClick={function () {
              setLogin(true);
            }}
            sx={{
              marginLeft: "auto",
              marginRight: "10px",
              float: "right",
              width: "125px",
              bgcolor: "rgb(200,50,50)",
              px: "10px",
              color: "white",
              borderRadius: "20px",
            }}
          >
            Sign in
          </Button>
        ) : (
          <>
            <Link
              to="/add"
              style={{ textDecoration: "none", marginLeft: "auto" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "10px",
                  bgcolor: "rgb(20,25,30)",
                  borderRadius: "15px",
                  marginRight: "10px",
                  color: "rgb(220,225,230)",
                  height: "40px",
                  "&:hover": { bgcolor: "rgb(30,35,40)", cursor: "pointer" },
                }}
              >
                <Add sx={{ width: "30px", height: "30px" }} />
                <Typography sx={{ paddingRight: "10px" }}>Create</Typography>
              </Box>
            </Link>
            <div style={{ marginRight: "15px" }}>
              <Account onClick={tab} token={token.token} />
            </div>
          </>
        )}
      </Box>
      <div
        style={{
          width: "100vw",
          height: "2px",
          backgroundColor: "rgb(80,81,82)",
        }}
      />

      {login ? (
        <Diiv
          $a={appear}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        />
      ) : (
        <></>
      )}

      {register ? (
        <Register
          func={setRegister}
          login={() => {
            setRegister(false);
            setLogin(false);
          }}
        />
      ) : login ? (
        <Login
          func={token.setToken}
          log={function () {
            setLogin(false);
          }}
          register={setRegister}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Navbar;
