import React from "react";
import Forum from "./components/forum";
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingForum from "./components/LoadingForum";
import { content } from "../utils/apiRoutes";

function MainWindow({ data, hasMore, setHasMore, setData, token }) {

  const deletePost = (item)=>{
    setData(data.filter((i)=>{
      return i._id != item._id; 
    }))
  }

  const getMoreData = ()=>{
    const retrieving = async ()=>{
      console.log('retrieiving')
      let body = { date: data[data.length-1].createdAt, type: 1 };
      await fetch(content, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res)=>res.json())
      .then((json)=>{
        setData([...data, ...json.data]);
        setHasMore(data.length < json.num);
      })
    }
    retrieving();
  }

  return (
    <>
      <title>Chinese Whisper</title>
      {data[0] &&
        <InfiniteScroll
          dataLength={data.length}
          next={getMoreData}
          hasMore={hasMore}
        >
          <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
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
            {data.map((item, index) => {
              return <Forum key={item._id} deleteFunc={deletePost} item={item} updateWindow={function(){}} setLoadCmnt={function(){}} token={token} />;
            })}
            
        {hasMore && <LoadingForum />}
          </div>
        </div>
        
        </InfiniteScroll>
      }
    </>
  );
}

export default MainWindow;
