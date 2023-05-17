import React, { useEffect, useState } from "react";
import GameCard from "./gameCard";
import axios from "axios";

const GamesComp = () => {
  const baseUrl = 'http://localhost:5000/getDraftGroup';

  const [draftGroups, setDraftGroups] = useState([]);

  let sport = "NBA";

  const fetchData = async () => {
    const data = await axios.get(`${baseUrl}/${sport}`);
    const groups = data.data;
    setDraftGroups(groups);
  };


  useEffect(() =>{
    fetchData();
  }, [])

  return (
    <>
      {draftGroups.map((games) => {
        return (
          <GameCard
            sport={games.Sport}
            type={games.Type}
            time={games.Time}
            team={games.Team}
            draftgroup={games.DraftGroup}
          />
        );
      })}
    </>
  );
};

export default GamesComp;
