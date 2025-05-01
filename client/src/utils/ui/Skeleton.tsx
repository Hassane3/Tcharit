import { Skeleton, Stack, Box, CircularProgress } from "@mui/material";
import React from "react";

export function SplashScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export function SkeletonCheckPosts() {
  return (
    <Stack
      spacing={4}
      marginX={"10px"}
      sx={{
        paddingBottom: "100px",
        paddingTop: "30vh",
        textAlign: "center",
      }}
    >
      <Skeleton variant="text" width="60%" height={30} />
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
    </Stack>
  );
}
export function SkeletonMap() {
  return (
    <Stack
      marginX={"10px"}
      // sx={{
      //   paddingBottom: "100px",
      //   paddingTop: "30vh",
      //   textAlign: "center",
      // }}
    >
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Stack>
  );
}

export function lazyWithDelay<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  delay = 1500
): React.LazyExoticComponent<T> {
  return React.lazy(() =>
    Promise.all([
      importFunc(),
      new Promise((resolve) => setTimeout(resolve, delay)),
    ]).then(([module]) => module)
  );
}
