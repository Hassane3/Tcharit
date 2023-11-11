import React, { useEffect, useState } from "react";
import { postsProps } from "./MapPage";
import styled from "styled-components";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import { getDiffTime, handleTimeFormat } from "../utils/methods/methods";
import { GLOBAL_STYLE } from "../utils/constants/constants";
import TankStatus from "../models/utils/TankStatus";

const CheckPosts = (props: { tankId: number }): JSX.Element => {
  const { tankId } = props;
  const [postsData, setPostsData] = useState<Array<postsProps>>([]);
  let date = "";
  const [lastCheckTime, setLastCheckTime] = useState<number>();

  useEffect(() => {
    let posts: Array<postsProps> = [];
    const dbRef = ref(db, "tanks/" + tankId + "/posts");

    return onValue(dbRef, (snapshot: DataSnapshot) => {
      posts = [];
      snapshot.forEach((post: any) => {
        posts.push({ ...post.val() });
      });
      setPostsData(posts);
    });
  }, [tankId]);

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

  return (
    <div>
      {
        //NEW:
        //We use reverse to display recent posts first.
        [...postsData].reverse().map((post, index) => {
          return (
            <MainContainer key={index}>
              {post.date !== date &&
                ((date = post.date),
                (
                  <DaySeparator>
                    {post.date === new Date().toLocaleDateString()
                      ? "TODAY"
                      : post.date + " " + post.weekDay}
                  </DaySeparator>
                ))}
              {
                <div>
                  <PostBox
                    key={index}
                    $backgroundColor={
                      post.status === TankStatus.EMPTY
                        ? GLOBAL_STYLE.colorRedLight
                        : post.status === TankStatus.HALFFUll
                        ? GLOBAL_STYLE.colorYellowLight
                        : GLOBAL_STYLE.colorBlueLight
                    }
                    $fontColor={
                      post.status === TankStatus.EMPTY
                        ? GLOBAL_STYLE.colorRed
                        : post.status === TankStatus.HALFFUll
                        ? GLOBAL_STYLE.colorYellow
                        : GLOBAL_STYLE.colorBlue
                    }
                  >
                    <span>{post.userType}</span>
                    <span>{post.time}</span>
                    <span id="postStatus">{post.status}</span>
                    {/* <div>
                      <span>{post.date}</span> <span>{post.weekDay}</span>
                    </div> */}
                  </PostBox>
                  {index === 0 && (
                    <PostBottomBox>
                      <span>
                        {lastCheckTime && handleTimeFormat(lastCheckTime)}
                      </span>
                    </PostBottomBox>
                  )}
                </div>
              }
            </MainContainer>

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
    </div>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  margin: 0 6px;

  > span {
    margin: 20px 0;
  }
  > div {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

const DaySeparator = styled.span`
  font-size: 18px;
  color: ${GLOBAL_STYLE.colorGreyLight};
`;

const PostBox = styled.div<{ $backgroundColor?: string; $fontColor?: string }>`
  width: inherit;
  padding: 16px;
  background-color: ${(props) => props.$backgroundColor};
  border-radius: 10px;

  display: flex;
  justify-content: space-between;

  #postStatus {
    color: ${(props) => props.$fontColor};
    font-weight: 600;
  }
  > span {
    color: ${GLOBAL_STYLE.colorBlackLight};
    width: 20%;
    display: flex;
    justify-content: center;
  }
`;

const PostBottomBox = styled.div`
  display: flex;
  justify-content: flex-end;
  width: inherit;
  span {
    font-size: 16px;
    color: ${GLOBAL_STYLE.colorGreyLight};
  }
`;
export default CheckPosts;
