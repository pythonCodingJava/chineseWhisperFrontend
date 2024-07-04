import React from 'react';
import {Box} from '@mui/material';

function LoadingComment({tier}) {
  return (
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
            left: (tier) * 25 - 10,
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
            left: (tier) * 25 - 7,
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
  )
}

export default LoadingComment