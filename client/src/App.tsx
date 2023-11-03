import React, { useEffect, useState } from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";

//MODELS
import { CookiesProvider, useCookies } from "react-cookie";
//COMPONENTS
import MapPage, { tankDataProps, tanksDataProps } from "./pages/MapPage";
import Tank from "./pages/Tank";
import NoPage from "./pages/NoPage";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "./firebase/firebase";

function App(): JSX.Element {
  // const [tanksData, setTanksData] = useState<Array<tankDataProps>>([]);
  const [tanksData, setTanksData] = useState<Array<tankDataProps>>([]);
  // HERE
  // Cookie
  const [cookies, setCookie] = useCookies(["userId"]);
  // const [cookies, setCookie] = useCookies(["access_token", "refresh_token"]);
  const [visitedTank, setVisitedTank] = useState<tankDataProps>();

  useEffect(() => {
    // let tanks: tankDataProps[];
    let tanks: tankDataProps[] = [];
    console.log("cookies : ", cookies);
    // Retrieve tanks data from firebase :
    const dbRef = ref(db, "tanks");

    return onValue(dbRef, (snapshot: DataSnapshot) => {
      tanks = [];
      snapshot.forEach((tank: any) => {
        console.log("tank : ", tank.val());
        console.log("tank Key : ", tank.key);
        tanks.push({ id: parseInt(tank.key), ...tank.val() });
      });
      setTanksData(tanks);
    });
  }, [cookies]);
  console.log("TANKS === ", tanksData);
  // alert("User cookie : " + cookies.userId);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  function onChange() {
    // setCookie("userId", "Ho", { path: "/kk" });
  }
  return (
    <BrowserRouter>
      <button onClick={onChange}>HERE</button>
      <Routes>
        {/* <Route path="/" element={<MapPage />}> */}
        <Route
          path="/"
          element={
            <MapPage
              tanksData={tanksData}
              visitedTank={visitedTank}
              setVisitedTank={setVisitedTank}
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
        <Route path="*" element={<NoPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
