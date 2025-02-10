import React, { JSX, useEffect, useState } from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";

//MODELS
import { useCookies } from "react-cookie";
//COMPONENTS
import MapPage, { postsProps, tankDataProps } from "./pages/MapPage";
import Tank from "./pages/Tank";
import NoPage from "./pages/NoPage";
import { DataSnapshot, onValue, ref, remove } from "firebase/database";
import { auth, db, firestoreDb } from "./firebase/firebase";

import { AppProvider } from "@toolpad/core/react-router-dom";
import Login from "./pages/Login";
import { createTheme } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { calculateDateDifference } from "./utils/methods/methods";

export interface UserData {
  name: string | null;
  email: string | null;
}
declare module "@mui/material/styles" {
  interface TypeText {
    grey: string;
  }
  interface TypeBackground {
    defaultWhite: string;
    defaultBlue: string;
    defaultBrown: string;
    blueDark: string;
    blue: string;
    blueLight: string;
    blueExtraLight: string;
    yellowDark: string;
    yellow: string;
    yellowLight: string;
    yellowExtraLight: string;
    redDark: string;
    red: string;
    redLight: string;
    redExtraLight: string;
    greyLight: string;
  }
}
export const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 0,
          padding: "10px 50px",
        },
        containedSizeLarge: {
          textTransform: "none",
          fontSize: "1.4em",
          fontWeight: "600",
          borderRadius: "40px",
          toUpperCase: "none",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxSizing: "content-box",
          display: "inline-block",
          position: "relative",
          cursor: "pointer",
          touchAction: "none",
          // -webkit-tap-highlight-color: transparent;
          color: "#adadad",
          height: "4px",
          width: "100%",
          padding: "13px 0",
          marginBottom: "20px",
        },
        mark: {
          height: "10px",
          width: "10px",
          borderRadius: "50%",
          backgroundColor: "#adadad !important",
        },
        rail: {
          opacity: 1,
        },
        markLabel: {
          color: "#adadad",
          top: "-40px !important",
          left: "50% !important",
          display: "none",
        },
      },
    },
  },
  typography: {
    fontFamily: "Changa",
    h1: {
      fontFamily: "Lalezar",
      fontWeight: "400",
    },
    h2: {
      fontFamily: "Lalezar",
      fontSize: "2.6em",
      fontWeight: "500",
    },
    h3: {
      fontFamily: "Changa",
      fontSize: "1.4em",
      fontWeight: "700",
      lineHeight: "1.3em",
    },
    button: {
      fontSize: "1.4em",
      fontWeight: "600",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#3D5F61",
        },
        secondary: {
          main: "#567F8A",
        },
        text: {
          primary: "#61523D",
          secondary: "#567F8A",
          grey: " #c1c1c1",
        },
        background: {
          default: "#BEF1F7",
          defaultBlue: "#567F8A",
          defaultBrown: "#61523D",
          defaultWhite: "#EAFBFF",
          paper: "#3D5F61",
          blueDark: "#567F8A",
          blue: "#95DCE0",
          blueLight: "#BEF1F7",
          blueExtraLight: "#CFF6FF",
          yellowDark: "#8A7256",
          yellow: "#E1C095",
          yellowLight: "#E9CFAF",
          yellowExtraLight: "#F0DFCA",
          redDark: "#8A5656",
          red: "#E0A595",
          redLight: "#E8C2AF",
          redExtraLight: "#EFD2CA",
          greyLight: "#adadad",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#3D5F61",
        },
        secondary: {
          main: "#567F8A",
        },
        text: {
          primary: "#EAFBFF",
          secondary: "#3D5F61",
          grey: "#b8b8b8",
        },
        background: {
          default: "#EAFBFF",
          paper: "#3D5F61",
          blueDark: "#567F8A",
          yellowDark: "#8A7256",
          redDark: "#8A5656",
          greyLight: "#adadad",
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});
function App(): JSX.Element {
  // const [tanksData, setTanksData] = useState<Array<tankDataProps>>([]);
  const [tanksData, setTanksData] = useState<Array<tankDataProps>>([]);
  // HERE
  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  // const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [visitedTank, setVisitedTank] = useState<tankDataProps>();
  // const [lastCheckTime, setLastCheckTime] = useState<number>();

  // When tankAgent is logged

  const [user, setUser] = useState<{} | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: null,
    email: null,
  });
  const [tankAgentData, setTankAgentData] = useState<{} | null>(null);
  // We track user connection state; and get user datas from firestore
  const fetchTankAgentData = async () => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(firestoreDb, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData({
            name: docSnap.get("name"),
            email: docSnap.get("email"),
          });
          setTankAgentData(docSnap.data());

          console.log("User is logged in");
        } else {
          setUserData({
            name: null,
            email: null,
          });
          console.log("User is not logged in");
        }
      }
    });
  };

  useEffect(() => {
    fetchTankAgentData();
  }, []);

  useEffect(() => {
    // let tanks: tankDataProps[];
    let tanks: tankDataProps[] = [];
    // Retrieve tanks data from firebase :
    const dbRef = ref(db, "tanks");
    return onValue(
      dbRef,
      (snapshot: DataSnapshot) => {
        tanks = [];
        snapshot.forEach((tank: any) => {
          tanks.push({ id: parseInt(tank.key), ...tank.val() });

          // if(Math.floor((today - parseInt(post.date)) / _MS_PER_DAY ) > 7){

          // }

          const dbPostRef = ref(db, "tanks/" + tank.key + "/posts");
          // Look at this :
          // database.ref("users").once("value").then((snapshot)
          const posts = onValue(
            dbPostRef,
            (snapshot: DataSnapshot) => {
              snapshot.forEach((post: any) => {
                let date = "20/01/2025";
                // We delete posts that are elder than a week :
                console.log(
                  "calDateDiff >",
                  post.val().date,
                  " : ",
                  calculateDateDifference(post.val().date)
                );
                if (calculateDateDifference(post.val().date) > 7) {
                  remove(ref(db, "tanks/" + tank.key + "/posts/" + post.key))
                    .then(() => {
                      console.log("Data deleted successfully");
                    })
                    .catch((error) => {
                      console.log("Error deleting data:");
                    });
                }
                // We update home last time
              });
            },
            (error: Error) => {
              alert("Error while fetching datas from db : " + error.message);
            }
          );
          console.log("tanks > ", tanks);
          //We verify if there is not old posts that must be deleted in the bd, else we delete them

          setTanksData(tanks);
        });
      },
      (error: Error) => {
        alert("Error while fetching datas from db : " + error.message);
      }
    );
  }, [cookies]);

  const { palette } = createTheme();

  console.log("page state : ", document.readyState);
  return (
    <BrowserRouter>
      <AppProvider
        theme={customTheme}
        // navigation={[
        //   {
        //     segment: "home",
        //     title: "Home",
        //   },
        //   {
        //     segment: "login",
        //     title: "Login",
        //   },
        // ]}
        // session={useSession()}
      >
        <Routes>
          <Route
            path="/"
            element={
              <MapPage
                tanksData={tanksData}
                visitedTank={visitedTank}
                setVisitedTank={setVisitedTank}
                user={user}
                userData={userData}
                setUserData={setUserData}
              />
            }
          />
          <Route
            path="/mapPage"
            element={
              <MapPage
                tanksData={tanksData}
                visitedTank={visitedTank}
                setVisitedTank={setVisitedTank}
                user={user}
                userData={userData}
                setUserData={setUserData}
              />
            }
          />
          {/* <Route path="/tank:id" element={<Tank />} /> */}
          <Route
            path="/tank/:id"
            element={
              <Tank
                tanksData={tanksData}
                // HERE
                setCookie={setCookie}
                cookies={cookies}
                userData={userData}
              />
            }
          />
          <Route
            path="/login"
            element={<Login handleSetTankAgentData={setTankAgentData} />}
          />
          <Route path="*" element={<NoPage />} />
          {/* </Route> */}
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
