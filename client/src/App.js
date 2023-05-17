import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
//import ErrorPage from "./components/misc/errorPage";
import HomePage from "./components/home/homePage";
import GameStatsPage from "./components/gameStats/gameStatsPage";

document.body.style = 'background: rgb(234,237,242)';


const App = () => {  

  return (
    <>
      <Navbar/>
        <Routes>
          {/* <Route exact path="/login" element={<Login />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/gameInfo/:sportName/:gameId" element={<GameStatsPage />} />
        </Routes>
    </>
  );
};



export default App

