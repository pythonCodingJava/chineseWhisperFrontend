import { React, useRef, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { login } from "../utils/apiRoutes";
import { useTransition, animated } from "react-spring";
import "../styles/Register.css";
import { styled } from "styled-components";
import { Field, linkStyle, boxstyle } from "../styles/formComponents.jsx";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { socket } from "../socket.js";

const Diiv = styled.div`
  transition: opacity 0.5s;
  opacity: ${(props) => (props.$a ? "1" : "0")};
`;

function Login({ func, register, log }) {
  const [inputs, setInputs] = useState({
    Username: "",
    Password: "",
  });

  const refContainer = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [appear, setAppear] = useState(false);
  const [visible, setVisible] = useState();
  const [logging, setLogging] = useState(false);

  var transition;

  transition = useTransition(visible, {
    from: {
      height: 0,
      y: dimensions.height,
      x: dimensions.height,
      width: 0,
      opacity: 0,
    },
    enter: (item) => async (next) => {
      await next({
        height: dimensions.height,
        y: 0,
        x: dimensions.height,
        width: 0,
        opacity: 1,
      });
      await next({
        height: ref2.current.offsetHeight,
        x: dimensions.height - ref3.current.offsetHeight,
        width: ref3.current.offsetHeight,
        opacity: 1,
      });
      setAppear(!appear);
      await next({ opacity: 1 });
    },
    config: {
      mass: 1,
      tension: 700,
      friction: 50,
    },
  });

  useEffect(() => {
    if (refContainer.current && dimensions.width == 0) {
      setDimensions({
        width: refContainer.current.offsetWidth,
        height: refContainer.current.offsetHeight,
      });
    } else {
      setVisible(true);
    }
  }, [dimensions]);

  const [invalid, setInvalid] = useState(false);

  const handleChange = (value) => {
    const name = value.target.name;
    const val = value.target.value;

    if (invalid) {
      setInvalid(false);
    }

    setInputs((values) => ({ ...values, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLogging(true);
    fetch(login, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(inputs),
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      setLogging(false);
      if (res.status == 400) {
        setInvalid(true);
      }
      if (res.status == 201) {
        const dat = await res.json().then((d) => {
          console.log(d);
          sessionStorage.setItem("chineseWhisperToken", JSON.stringify(d));
          socket.emit("login", d.id);
          func(d);
          log();
        });
      }
    });
  };

  return (
    <form action="handleSubmit">
      {transition
        ? transition((style, item) =>
            item ? (
              <>
                <animated.div
                  className="box"
                  style={{
                    height: dimensions.height,
                    width: dimensions.width,
                  }}
                >
                  <animated.div
                    className="appear"
                    style={{
                      width: dimensions.width,
                      height: style.height,
                      top: style.y,
                      borderRadius: "20px 20px 8px 8px",
                    }}
                  />
                  <animated.div
                    className="appear"
                    style={{
                      width: dimensions.width,
                      height: style.width,
                      top: style.x,
                      borderRadius: "8px 8px 20px 20px",
                    }}
                  />
                </animated.div>
              </>
            ) : (
              <></>
            )
          )
        : "hi"}

      <Diiv className="box" $a={appear} ref={refContainer}>
        <HighlightOffRoundedIcon
          onClick={log}
          sx={{
            position: "absolute",
            top: "2%",
            right: "2%",
            color: "rgb(90,90,90)",
            "&:hover": { cursor: "pointer" },
          }}
          fontSize="large"
        />

        <Box sx={boxstyle} ref={ref2}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: "rgb(220,220,220)",
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            LOGIN
          </Typography>
          <Field
            type="textbox"
            name="Username"
            value={inputs["Username"]}
            onChange={handleChange}
            error={invalid}
            label="Username"
          />
          1
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Field
              type="password"
              name="Password"
              value={inputs["Password"]}
              onChange={handleChange}
              sx={{ width: "80%" }}
              error={invalid}
              helperText={invalid ? "Invalid Credentials" : ""}
              label="Password"
            />
            <Button
              variant="outlined"
              sx={{
                height: "50px",
                color: "rgb(200,200,200)",
                border: "solid rgba(255,255,255,0.1)",
                "&:hover": {
                  border: "solid rgb(150,150,150)",
                  backgroundColor: "rgb(150,150,150)",
                  color: "rgb(40,40,40)",
                  fontWeight: "900",
                },
              }}
            >
              Forgot
            </Button>
          </Box>
          1
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{ my: "10px", height: "45px", width: "100%" }}
          >
            {logging ? (
              <div className="loadAnim">
                <div className="load">...</div>
              </div>
            ) : (
              "SIGN IN"
            )}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgb(35,35,35)",
            p: 3,
            color: "rgba(255,255,255,0.4)",
            width: "inherit",
            marginTop: "30px",
            borderRadius: "8px 8px 20px 20px",
          }}
          ref={ref3}
        >
          <span id="text">
            New to the website?
            <Typography
              display="inline"
              onClick={function () {
                setVisible(!visible);
                register(true);
              }}
              sx={{ "&:hover": { cursor: "pointer" } }}
              style={linkStyle}
            >
              Sign up
            </Typography>
          </span>
        </Box>
      </Diiv>
      {/* {!visible?<div className='box' style={{height:dimensions.height, width:dimensions.width}}></div>:<></>} */}
    </form>
  );
}

export default Login;
