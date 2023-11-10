import React, { useEffect, useState } from "react";
import { postsProps } from "./MapPage";
import styled from "styled-components";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";
import { getDiffTime, handleTimeFormat } from "../utils/methods/methods";

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
    <MainContainer>
      <FirstSpan>
        <span> : حالة تدفق المياه حسب المستخدمين </span>
      </FirstSpan>
      <div>
        {
          //NEW:
          //We use reverse to display recent posts first.
          [...postsData].reverse().map((post, index) => {
            return (
              <div key={index}>
                {
                  // Display day separator if the actual day of post is different than the previus one
                  post.date !== date &&
                    ((date = post.date),
                    post.date === new Date().toLocaleDateString() ? (
                      <div>******* TODAY *******</div>
                    ) : (
                      <div>
                        ******* {post.date} {post.weekDay} *******
                      </div>
                    ))
                }

                <div key={index}>
                  <span>{post.userType} ****</span>
                  <span>{post.status} ****</span>
                  <span>{post.date} ****</span>
                  <span>{post.time} ****</span>
                  <span>{post.weekDay}</span>
                </div>

                {index === 0 && (
                  <span>
                    {lastCheckTime && handleTimeFormat(lastCheckTime)}
                  </span>
                )}
                <span></span>
              </div>
            );
          })
        }
      </div>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const FirstSpan = styled.div``;
export default CheckPosts;
