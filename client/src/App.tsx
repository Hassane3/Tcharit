import React, { useEffect, useState } from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";

//MODELS
import { useCookies } from "react-cookie";
//COMPONENTS
import MapPage, { tankDataProps } from "./pages/MapPage";
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
  // const [lastCheckTime, setLastCheckTime] = useState<number>();

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

  // const [isPageLoaded, setIsPageLoaded]  = useState(false);
  // useEffect(() => {
  //   if(document.readyState === "complete")
  //   {
  //     setIsPageLoaded(true);
  //   }

  //   // return () => {
  //   //   second
  //   // }
  // }, [])

  // useEffect(() => {
  //   const checkPointInterval = setInterval(() => {
  //     let now = new Date().getTime();
  //     console.log("****SET INTERVAL*******");
  //     console.log("tankData : ", tanksData);
  //     tanksData.forEach((tank: tankDataProps) => {
  //       console.log("tank ", tank.id, " lastCheckTime : ", tank.lastCheckTime);
  //       // diffrenceTime in seconds
  //       let diffTime = Math.floor((now - tank.lastPostTime) / 1000);
  //       // console.log("differenceTime --> ", diffTime);
  //       updateLastCheck(tank.id, diffTime);
  //       // onValue(
  //       //   ref(db, "/tanks/" + tank.id + "/lastCheckTime"),
  //       //   (snapshot: DataSnapshot) => {
  //       //     console.log("db ref : ", snapshot.val());
  //       //   }
  //       // );
  //     });
  //   }, 10000);

  //   return () => {
  //     clearInterval(checkPointInterval);
  //   };
  // }, [tanksData]);

  // alert("User cookie : " + cookies.userId);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);
  console.log("page state : ", document.readyState);

  return (
    <BrowserRouter>
      {/* <button onClick={onChange}>HERE</button> */}
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
