import React from 'react'
import {Box, useMediaQuery} from '@mui/material';

function LoadingForum() {
    
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            position:'relative'
          }}
          className='container'
        >
          <div
            style={{
              padding: "10px",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            className='row'
          >
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
                    ? { width: "900px" }
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
            </div>
  )
}

export default LoadingForum