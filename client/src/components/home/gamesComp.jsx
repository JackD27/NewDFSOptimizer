import React, { useEffect, useState } from "react";
import GameCard from "./gameCard";
import axios from "axios";
import {Table, Form, Card, Button, Row, Col} from 'react-bootstrap'

const GamesComp = () => {
  const baseUrl = 'http://localhost:5000/getDraftGroup';

  const [draftGroups, setDraftGroups] = useState([]);

  const [sportValue, setSportValue] = useState('NBA');


  const fetchData = async () => {
    const data = await axios.get(`${baseUrl}/${sportValue}`);
    const groups = data.data;
    setDraftGroups(groups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      fetchData();
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500
      ) {
        console.log(error)
      }
    }
  };



  useEffect(() =>{
    fetchData();
  }, [])

  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicSport">
          <Form.Label style={{color: "black"}}>Sport</Form.Label>
          <Form.Select onChange={(e)=> {setSportValue(e.target.value)}} value={sportValue}>
            <option>NBA</option>
            <option>WNBA</option>
          </Form.Select>
        </Form.Group>
        <Button variant="success" type="submit" onClick={handleSubmit}>Get {sportValue} Stats</Button>
      </Form>
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
