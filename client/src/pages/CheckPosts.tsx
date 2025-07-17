import React, {
  HtmlHTMLAttributes,
  JSX,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { postsProps, tankDataProps } from "./MapPage";
import styled from "styled-components";
import { DataSnapshot, onValue, ref, remove } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  dateToArab,
  getDiffTime,
  handleTimeFormat,
} from "../utils/methods/methods";
import { GLOBAL_STYLE } from "../utils/constants/constants";
import TankStatus from "../models/utils/TankStatus";
import { getPostsStatusColor } from "./Tank";
import { customTheme } from "../App";
import FaceIcon from "@mui/icons-material/Face";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CommentsDisabledRoundedIcon from "@mui/icons-material/CommentsDisabledRounded";
import {
  Button,
  Chip,
  Divider,
  Snackbar,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import { UserType } from "../models/utils/UsersType";
import { useTranslation } from "react-i18next";
import { deletePost } from "../firebase/operations";
import UseSnackBar from "./components/UseSnackBar";
import { SkeletonCheckPosts } from "../utils/ui/Skeleton";

const CheckPosts = (props: {
  tankData: tankDataProps;
  postsData: postsProps[];
  user: {} | null;
}): JSX.Element => {
  const { tankData, user, postsData } = props;

  // const [postsData, setPostsData] = useState<Array<postsProps>>([]);
  let date = "";
  const [lastCheckTime, setLastCheckTime] = useState<number>();

  const [clickedPost, setClickedPost] = useState<number | null>(null);
  // MUI SnackBar
  const [isSnackOpen, setIsSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  let today = new Date().toLocaleDateString();
  const lang = localStorage.getItem("language");
  const { t } = useTranslation();

  // useEffect(() => {
  //   let posts: Array<postsProps> = [];
  //   const dbRef = ref(db, "tanks/" + tankData.id + "/posts");

  //   return onValue(dbRef, (snapshot: DataSnapshot) => {
  //     posts = [];
  //     snapshot.forEach((post: any) => {
  //       posts.push({ id: post.key, ...post.val() });
  //     });
  //     setPostsData(posts);
  //   });
  // }, [tankData]);

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

  const postEdit = (post: number) => {
    console.log(post);
    setClickedPost(post);
  };

  const divRef = useRef<HTMLDivElement>(null);

  const handleDeletePost = (postId?: number) => {
    try {
      deletePost(tankData.id, postId);
      setSnackMessage(t("common.post.confirm_deletion"));
      setIsSnackOpen(true);
      setClickedPost(null);
    } catch (error) {
      alert("Something went wrong while deleting post");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        // Undo action
        setClickedPost(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {postsData.length === 0 ? (
        <div
          style={{
            paddingBottom: "100px",
            paddingTop: "50vh",
            textAlign: "center",
          }}
        >
          <CommentsDisabledRoundedIcon
            style={{
              fontSize: "50px",
              color: customTheme.palette.background.blueDark,
            }}
          />
          <Typography
            variant="h3"
            style={{ color: customTheme.palette.background.blueDark }}
          >
            {t("common.tank.tank_status.tank_is_unset")}
          </Typography>
        </div>
      ) : (
        <Suspense fallback={<SkeletonCheckPosts />}>
          <Container>
            {
              //NEW:
              //We use reverse to display recent posts first.
              [...postsData].reverse().map((post, index) => {
                if (post.status !== TankStatus.UNKNOWN) {
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
                                borderWidth: "0.5px",
                              },
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                fontFamily: "Inter",
                                fontWeight: 200,
                                color: customTheme.palette.text.grey,
                              }}
                            >
                              {post.date === today
                                ? t("days.today")
                                : // : post.date + " " + post.weekDay}
                                  lang === "ar"
                                  ? t(`days.${post.weekDay}` as any) +
                                    " " +
                                    dateToArab(post.date)
                                  : post.date + " " + post.weekDay}
                            </span>
                          </Divider>
                        ))}
                      {
                        <Wrapper>
                          <PostBox
                            id={`post_${index}`}
                            className={`post ${clickedPost === index ? "shifted" : ""}`}
                            style={{ transition: "transform 0.3s ease" }}
                          >
                            <PostTopBox ref={divRef} key={index}>
                              <PostContainer
                                onClick={() => user && postEdit(index)}
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
                                    post.date !==
                                      new Date().toLocaleDateString()
                                      ? "light"
                                      : "basic"
                                  ),
                                  opacity:
                                    post.date !==
                                    new Date().toLocaleDateString()
                                      ? 0.8
                                      : 1,
                                }}
                              >
                                <div style={{ justifyContent: "flex-start" }}>
                                  {post.userType === UserType.TANKAGENT ? (
                                    <FaceIcon
                                      color="secondary"
                                      fontSize="large"
                                      style={{
                                        color:
                                          customTheme.palette.background
                                            .defaultBlue,
                                      }}
                                    />
                                  ) : (
                                    <AccountCircleIcon
                                      fontSize="large"
                                      style={{
                                        color:
                                          customTheme.palette.background
                                            .defaultWhite,
                                      }}
                                    />
                                  )}
                                </div>
                                <div style={{ justifyContent: "center" }}>
                                  <span
                                    style={{
                                      color:
                                        customTheme.palette.background.blueDark,
                                      fontSize: "1.4em",
                                      fontFamily: "inter",
                                    }}
                                  >
                                    {post.time}
                                  </span>
                                </div>
                                <div style={{ justifyContent: "flex-end" }}>
                                  <span
                                    id="postStatus"
                                    style={{
                                      color:
                                        customTheme.palette.background
                                          .defaultWhite,
                                      fontWeight: 800,
                                    }}
                                  >
                                    {t(
                                      `common.tank.tank_state.${post.status.toLocaleLowerCase()}` as any
                                    )}
                                  </span>
                                </div>
                                {/* <div>
                          <span>{post.date}</span> <span>{post.weekDay}</span>
                        </div> */}
                              </PostContainer>
                              <Button
                                onClick={() => handleDeletePost(post.id)}
                                size="large"
                                sx={{
                                  padding: "0 40px",
                                }}
                              >
                                <DeleteOutlineRoundedIcon
                                  sx={{
                                    color: customTheme.palette.background.red,
                                    fontSize: "30px",
                                  }}
                                />
                              </Button>
                            </PostTopBox>
                            {post.date === today &&
                              (index === 0 ||
                                post.userType === UserType.TANKAGENT) && (
                                <PostBottomBox
                                  textColor={
                                    customTheme.palette.background.blueDark
                                  }
                                >
                                  <span>
                                    {/* {lastCheckTime && handleTimeFormat(lastCheckTime)} */}
                                    {lang === "ar" ? (
                                      handleTimeFormat(
                                        getDiffTime(post.postTime)
                                      )
                                        .reverse()
                                        .map((time: string) => (
                                          <span>{time}&nbsp;</span>
                                        ))
                                    ) : (
                                      <span>
                                        {handleTimeFormat(
                                          getDiffTime(post.postTime)
                                        ).map((time: string) => (
                                          <span>{time}&nbsp;</span>
                                        ))}
                                      </span>
                                    )}
                                  </span>

                                  {/* A changer ! */}
                                  {post.userType === UserType.TANKAGENT && (
                                    <span>
                                      <span>{t("common.info.trusted")}</span>
                                      <CheckIcon style={{ fontSize: "16px" }} />
                                    </span>
                                  )}
                                </PostBottomBox>
                              )}
                          </PostBox>
                        </Wrapper>
                      }
                      <UseSnackBar
                        isSnackOpen={isSnackOpen}
                        setIsSnackOpen={setIsSnackOpen}
                        snackMessage={snackMessage}
                      />
                    </MainContent>
                  );
                }
              })
            }
          </Container>
        </Suspense>
      )}
    </>
  );
};

const Container = styled.div`
  padding-bottom: 100px;
  padding-top: 30vh;
  overflow: hidden;

  .shifted {
    transform: translateX(-90px);
  }
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
`;
const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: inline-flex;
`;

const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: inherit;
  min-height: 11vh;
`;
const PostTopBox = styled.div`
  display: inline-flex;
  width: inherit;
`;

const PostContainer = styled.div`
  width: inherit;
  min-width: 100%;
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
  align-items: center;
  width: inherit;
  > span {
    color: ${(props) => props.textColor};
    display: flex;
    align-items: center;
    text-transform: capitalize;
    line-height: 1;
    > span {
      font-size: 10px;
      font-weight: 400;
    }
  }
`;
export default React.memo(CheckPosts);
