import React, { JSX, useEffect, useState } from "react";
import { postsProps, tankDataProps } from "./MapPage";
import styled from "styled-components";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import { getDiffTime, handleTimeFormat } from "../utils/methods/methods";
import { GLOBAL_STYLE } from "../utils/constants/constants";
import TankStatus from "../models/utils/TankStatus";
import { getPostsStatusColor } from "./Tank";
import { customTheme } from "../App";
import FaceIcon from "@mui/icons-material/Face";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
import { Button, Chip, Divider } from "@mui/material";
import { UserType } from "../models/utils/UsersType";

const CheckPosts = (props: { tankData: tankDataProps }): JSX.Element => {
  const { tankData } = props;
  const [postsData, setPostsData] = useState<Array<postsProps>>([]);
  let date = "";
  const [lastCheckTime, setLastCheckTime] = useState<number>();

  useEffect(() => {
    let posts: Array<postsProps> = [];
    const dbRef = ref(db, "tanks/" + tankData.id + "/posts");

    return onValue(dbRef, (snapshot: DataSnapshot) => {
      posts = [];
      snapshot.forEach((post: any) => {
        posts.push({ ...post.val() });
      });
      setPostsData(posts);
    });
  }, [tankData]);

  useEffect(() => {
    // Get the last post
    let post: postsProps | undefined = postsData.find(
      (post: postsProps, index: number) => {
        return index === postsData.length - 1;
      }
    );
    let lastPostTime = post?.postTime;

    if (lastPostTime) {
      setLastCheckTime(getDiffTime(lastPostTime));
    }

    const checkPointInterval = setInterval(() => {
      lastPostTime && setLastCheckTime(getDiffTime(lastPostTime));
      // timer : 2min in ms
    }, 120000);

    return () => {
      clearInterval(checkPointInterval);
    };
  }, [postsData]);

  let today = new Date().toLocaleDateString();
  return (
    <Container>
      {
        //NEW:
        //We use reverse to display recent posts first.
        [...postsData].reverse().map((post, index) => {
          return (
            <MainContent key={index}>
              {post.date !== date &&
                ((date = post.date),
                (
                  <Divider
                    variant="middle"
                    sx={{
                      flexDirection: "row !important",
                      "&::before, &::after": {
                        borderColor: customTheme.palette.text.grey,
                        borderWidth: "1px",
                      },
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1em",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        color: customTheme.palette.text.grey,
                      }}
                    >
                      {post.date === today
                        ? "TODAY"
                        : post.date + " " + post.weekDay}
                    </span>
                  </Divider>
                ))}
              {
                <div>
                  <PostBox
                    key={index}
                    style={{
                      // backgroundColor:{getPostsStatusColor(
                      //   post,
                      //   post.date !== new Date().toLocaleDateString()
                      //     ? "light"
                      //     : "basic"
                      // )},
                      backgroundColor: getPostsStatusColor(
                        post,
                        post.date !== new Date().toLocaleDateString()
                          ? "light"
                          : "basic"
                      ),
                      opacity:
                        post.date !== new Date().toLocaleDateString() ? 0.8 : 1,
                    }}
                  >
                    <div style={{ justifyContent: "flex-start" }}>
                      {post.userType === UserType.TANKAGENT ? (
                        <FaceIcon
                          color="secondary"
                          fontSize="large"
                          style={{
                            color: customTheme.palette.background.defaultBlue,
                          }}
                        />
                      ) : (
                        <AccountCircleIcon
                          fontSize="large"
                          style={{
                            color: customTheme.palette.background.defaultWhite,
                          }}
                        />
                      )}
                    </div>
                    <div style={{ justifyContent: "center" }}>
                      <span
                        style={{
                          color: customTheme.palette.background.blueDark,
                          fontSize: "1.4em",
                          fontFamily: "inter",
                        }}
                      >
                        {post.time}
                      </span>
                    </div>
                    <div style={{ justifyContent: "flex-end" }}>
                      {/* <Button
                        variant="contained"
                        disableElevation
                        disableRipple
                        sx={{
                          background: getPostsStatusColor(post, "basic"),
                          position: "initial",
                        }}
                      > */}
                      <span
                        id="postStatus"
                        style={{
                          color: customTheme.palette.background.defaultWhite,
                          fontWeight: 800,
                        }}
                      >
                        {post.status}
                      </span>
                      {/* </Button> */}
                    </div>
                    {/* <div>
                      <span>{post.date}</span> <span>{post.weekDay}</span>
                    </div> */}
                  </PostBox>
                  {post.date === today &&
                    (index === 0 || post.userType === UserType.TANKAGENT) && (
                      <PostBottomBox
                        textColor={customTheme.palette.background.blueDark}
                      >
                        <span>
                          {/* {lastCheckTime && handleTimeFormat(lastCheckTime)} */}
                          {handleTimeFormat(getDiffTime(post.postTime))}
                        </span>
                        {/* A changer ! */}
                        {post.userType === UserType.TANKAGENT && (
                          <span>
                            trusted
                            <CheckIcon />
                          </span>
                        )}
                      </PostBottomBox>
                    )}
                </div>
              }
            </MainContent>

            // // Display day separator if the actual day of post is different than the previus one
            // post.date !== date &&
            //   ((date = post.date),
            //   post.date === new Date().toLocaleDateString() ? (
            //     <DaySeparator>TODAY</DaySeparator>
            //   ) : (
            //       console.log("post date :"),
            //     <DaySeparator>
            //       {post.date} {post.weekDay}
            //     </DaySeparator>
            //   )),
            // (
            //   <div key={index}>
            //     {
            //       // Display day separator if the actual day of post is different than the previus one
            //       // post.date !== date &&
            //       //   ((date = post.date),
            //       //   post.date === new Date().toLocaleDateString() ? (
            //       //     <DaySeparator>TODAY</DaySeparator>
            //       //   ) : (
            //       //     <DaySeparator>
            //       //       {post.date} {post.weekDay}
            //       //     </DaySeparator>
            //       //   ))
            //     }
            //     <div key={index}>
            //       <span>{post.userType} ****</span>
            //       <span>{post.status} ****</span>
            //       <span>{post.date} ****</span>
            //       <span>{post.time} ****</span>
            //       <span>{post.weekDay}</span>
            //     </div>
            //     {index === 0 && (
            //       <PostBottomBox>
            //         <span>
            //           {lastCheckTime && handleTimeFormat(lastCheckTime)}
            //         </span>
            //       </PostBottomBox>
            //     )}
            //   </div>
            // )
          );
        })
      }
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 100px;
  padding-top: 25vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  margin: 0 10px;

  > span {
    margin: 20px 0;
  }
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 11vh;
  }
`;

const PostBox = styled.div`
  width: inherit;
  padding: 8px;
  border-radius: 10px;

  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    /* justify-content: center; */
    /* flex: 0.5; */
  }
  span {
    color: ${GLOBAL_STYLE.colorBlackLight};
    /* width: 20%; */
    display: flex;
    justify-content: center;
  }
`;

export const PostBottomBox = styled.div<{ textColor: string }>`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: inherit;
  span {
    font-size: 16px;
    color: ${(props) => props.textColor};
    display: flex;
  }
`;
export default CheckPosts;
