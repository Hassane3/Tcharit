import React, { JSX, useEffect, useState } from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";

//MODELS
import { useCookies } from "react-cookie";
//COMPONENTS
import MapPage, { tankDataProps } from "./pages/MapPage";
import Tank from "./pages/Tank";
import NoPage from "./pages/NoPage";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { auth, db, firestoreDb } from "./firebase/firebase";

import { AppProvider } from "@toolpad/core/react-router-dom";
import Login from "./pages/Login";
import { createTheme } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
export interface UserData {
  name: string | null;
  email: string | null;
}
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
          console.log("User is not logged in");
        } else {
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
        });
        setTanksData(tanks);
      },
      (error: Error) => {
        alert("Error while fetching datas from db : " + error.message);
      }
    );
  }, [cookies]);

  const customTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: "#F9F9FE",
            paper: "#EEEEF9",
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: "#2A4364",
            paper: "#112E4D",
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
