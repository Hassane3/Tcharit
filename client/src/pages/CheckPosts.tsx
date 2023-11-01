import React, { useEffect, useRef, useState } from "react";
import { postsProps, tanksDataProps } from "./MapPage";
import styled from "styled-components";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "../firebase/firebase";

// const CheckPosts = (posts: () => [postsProps]) => {
// const CheckPosts = (props: {tankId:number, posts: [postsProps] | undefined }):JSX.Element => {
const CheckPosts = (props: { tankId: number }): JSX.Element => {
  const { tankId } = props;
  const myDate = new Date();
  // let posts: Array<postsProps> = [];
  // let posts: Array<postsProps> = useRef([])
  const [postsData, setPostsData] = useState<Array<postsProps>>([]);

  console.log("myDate ", myDate);

  // const postRef = useRef(posts)
  useEffect(() => {
    let posts: Array<postsProps> = [];
    // if (postRef.current !== posts) {

    // }
    const dbRef = ref(db, "tanks/" + tankId + "/posts");
    console.log("dbRef : ", dbRef);
    return onValue(dbRef, (snapshot: DataSnapshot) => {
      posts = [];
      snapshot.forEach((post: any) => {
        console.log("post : ", post.val());
        posts.push({ ...post.val() });
      });
      setPostsData(posts);
    });
  }, []);
  console.log("POSTS === ", postsData);
  return (
    <MainContainer>
      <FirstSpan>
        <span> : حالة تدفق المياه حسب المستخدمين </span>
      </FirstSpan>
      <div>
        {
          //OLD:
          // props.posts &&
          //   props.posts.map((post, index) => (
          //     <div key={index}>
          //       <span>{post?.userType} ****</span>
          //       <span>{post?.status} ****</span>
          //       <span>{post?.date} ****</span>
          //       {/* <span>{myDate}</span> */}
          //     </div>
          //   ))

          //NEW:
          //We use reverse to display recent posts first.
          [...postsData].reverse().map((post, index) => (
            <div key={index}>
              <span>{post.userType} ****</span>
              <span>{post.status} ****</span>
              <span>{post.date} ****</span>
              <span>{post.time}</span>
            </div>
          ))
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
