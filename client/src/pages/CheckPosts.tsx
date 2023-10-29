import React from "react";
import { postsProps, tanksDataProps } from "./MapPage";
import styled from "styled-components";

// const CheckPosts = (posts: () => [postsProps]) => {
const CheckPosts = (props: { posts: [postsProps] | undefined }) => {
  const myDate = new Date();
  console.log("myDate ", myDate);

  return (
    <MainContainer>
      <FirstSpan>
        <span> : حالة تدفق المياه حسب المستخدمين </span>
      </FirstSpan>
      <div>
        {props.posts &&
          props.posts.map((post) => (
            <div>
              <span>{post?.userType} ****</span>
              <span>{post?.status} ****</span>
              <span>{post?.date} ****</span>
              {/* <span>{myDate}</span> */}
            </div>
          ))}
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
