import React from "react";
// LIBS
import { BrowserRouter, Route, Routes } from "react-router-dom";
//COMPONENTS
import MapPage from "./pages/MapPage";
import Tank from "./pages/Tank";
import NoPage from "./pages/NoPage";

function App() {
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
        <Route path="/" element={<MapPage />} />
        <Route path="/mapPage" element={<MapPage />} />
        {/* <Route path="/tank:id" element={<Tank />} /> */}
        <Route path="/tank/:id" element={<Tank />} />
        <Route path="*" element={<NoPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
