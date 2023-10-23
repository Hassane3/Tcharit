import React, { useEffect, useState } from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";
//COMPONENTS
import MapPage, { tankDataProps } from "./pages/MapPage";
import Tank from "./pages/Tank";
import NoPage from "./pages/NoPage";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { db } from "./firebase/firebase";

function App() {
  let tanks: Array<tankDataProps> = [];
  const [tanksData, setTanksData] = useState<Array<tankDataProps>>([]);

  useEffect(() => {
    // Retrieve tanks data from firebase :
    const dbRef = ref(db, "tanks");

    return onValue(dbRef, (snapshot: DataSnapshot) => {
      snapshot.forEach((tank: any) => {
        console.log("tank : ", tank.val());
        tanks.push({ id: parseInt(tank.key), ...tank.val() });
        setTanksData(tanks);
      });
      console.log("TANKS === ", tanksData);
    });
  }, []);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<MapPage />}> */}
        <Route path="/" element={<MapPage data={tanksData} />} />
        <Route path="/mapPage" element={<MapPage data={tanksData} />} />
        {/* <Route path="/tank:id" element={<Tank />} /> */}
        <Route path="/tank/:id" element={<Tank data={tanksData} />} />
        <Route path="*" element={<NoPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
