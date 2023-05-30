import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axios from 'axios'
import AlertFunction from "../misc/alertFunction";
import { CSVLink } from "react-csv";
import {Table, Form, Card, Button, Row, Col} from 'react-bootstrap'
import PlayerReadRow from "./playerReadRow";
import PlayerEditRow from "./playerEditRow";


// The FollowerList component.  This is the main component in this file.
export default function StatsList() {

  const csvLink = useRef()

  const [error, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  const [stats, setStats] = useState([]);

  const [nameSort, setNameSort] = useState(false);
  const [numberSort, setNumberSort] = useState(false);
  const [newPointsSort, setNewPointsSort] = useState(false);
  const [ppmSort, setPPMSort] = useState(false);

  const [seasonValue, setSeason] = useState('2022-23');
  const [seasonTypeValue, setSeasonType] = useState('Playoffs');
  const [sportValue, setSport] = useState('NBA');

  const params = useParams();

  function word(){
    try{
    if (stats[0].Team === null || stats[0].Team === undefined || stats[0].Team === ''){
      return 'No_Team'
  }else{
    return String(stats[0].Team).replace(/\s/g, '')
  }
}catch(error){
  return 'No_Team'
}
}

  const headers = [
    { label: "displayName", key: "displayName" },
    { label: "teamAbbreviation", key: "teamAbbreviation" },
    { label: "jackDKavgFPTs", key: "jackDKavgFPTs" },
    { label: "PPM", key: "PPM" },
    { label: "newMins", key: "newMins" },
    { label: "newAvgPoints", key: "newAvgPoints" },
    { label: "sportsLineMins", key: "sportsLineMins" },
    { label: "sportsLineAvgPoints", key: "sportsLineAvgPoints" }
];

  async function getStats() {
    const values = 
      {
        sportName: params.sportName,
        season: seasonValue,
        perMode: 'PerGame',
        seasonType: seasonTypeValue,
        draftGroup: Number(params.gameId),
        realSport: sportValue,
      };
    try{
    const response = await axios.post(`http://localhost:5000/getEdittableCSV`, values);
    setStats(response.data);
    }catch(error){
      setError(true);
      console.log(error)
    }
  }

  const footMessage = () => {
    if (visible) {
      if (error) {
        return (
          <AlertFunction variant="danger" show={true} message={"Error occurred"}/>);
      }
      if (isSuccess) {
        return (
          <AlertFunction variant="success" show={true} message={`Sucessfully gathered info from ${seasonValue} during the ${seasonTypeValue}.`}/>
        )}}
  };


  
console.log(stats)
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      
      getStats();
      setError(false);
      setVisible(true);
    } catch (error) {
      setSuccess(false);
      setError(true);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        
        
        console.log(error)
      }
    }

    setSuccess(true);
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line
  }, []);  


  // Name sorting
  function handleNameSortAsc(){
    const sortNamesAscending = [...stats].sort((a, b) =>
    a.displayName > b.displayName ? 1 : -1,
  );
  setStats(sortNamesAscending);}

  function handleNameSortDesc(){
    const sortNamesDescending = [...stats].sort((a, b) =>
    a.displayName > b.displayName ? -1 : 1,
  );
  setStats(sortNamesDescending);}

  function handleNameSort(){
    setNameSort(!nameSort);
    (nameSort ? handleNameSortAsc() : handleNameSortDesc())
  }

  // Average points sorting
function handleAvgPointsSortAsc(){
  const sortAvgPoints = [...stats].sort((a, b) => a.jackDKavgFPTs - b.jackDKavgFPTs);
  setStats(sortAvgPoints);
}

function handleAvgPointsSortDesc(){
  const sortAvgPoints = [...stats].sort((a, b) => b.jackDKavgFPTs - a.jackDKavgFPTs);
  setStats(sortAvgPoints);
}

function handleAvgPointsSort(){
  setNumberSort(!numberSort);
  (numberSort ? handleAvgPointsSortAsc() : handleAvgPointsSortDesc())
}

// New points sorting
function handleNewPointsSortAsc(){
  const sortNewPoints = [...stats].sort((a, b) => a.newAvgPoints - b.newAvgPoints);
  setStats(sortNewPoints);
}

function handleNewPointsSortDesc(){
  const sortNewPoints = [...stats].sort((a, b) => b.newAvgPoints - a.newAvgPoints);
  setStats(sortNewPoints);
}

function handleNewPointsSort(){
  setNewPointsSort(!newPointsSort);
  (newPointsSort ? handleNewPointsSortAsc() : handleNewPointsSortDesc())
}

// PPM sorting
function handlePPMSortDesc(){
  const sortPPMpoints = [...stats].sort((a, b) => b.PPM - a.PPM);
  setStats(sortPPMpoints);
}

function handlePPMSortAsc(){
  const sortPPMpoints = [...stats].sort((a, b) => a.PPM - b.PPM);
  setStats(sortPPMpoints);
}

function handlePPMSort(){
  setPPMSort(!ppmSort);
  (ppmSort ? handlePPMSortAsc() : handlePPMSortDesc())
}

  const handleCancelClick = () => {
    setEditPlayerId(null);
  };


  const handleEditClick = (event, player) => {
    event.preventDefault();
    setEditPlayerId(player.playerDkId);

    const formValues = {
      playerDkId: player.playerDkId,
      playerImage160: player.playerImage160,
      displayName: player.displayName,
      teamAbbreviation: player.teamAbbreviation,
      jackDKavgFPTs: player.jackDKavgFPTs,
      PPM: player.PPM,
      newMins: "",
      Team: player.Team,
      sportsLineMins: player.sportsLineMins,
      sportsLineAvgPoints: player.sportsLineAvgPoints,
      newAvgPoints: player.newAvgPoints,
    };

    setEditPlayerData(formValues);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedPlayer = {
      playerDkId: editPlayerId,
      playerImage160: editPlayerData.playerImage160,
      displayName: editPlayerData.displayName,
      teamAbbreviation: editPlayerData.teamAbbreviation,
      jackDKavgFPTs: editPlayerData.jackDKavgFPTs,
      PPM: editPlayerData.PPM,
      newMins: editPlayerData.newMins,
      Team: editPlayerData.Team,
      sportsLineMins: editPlayerData.sportsLineMins,
      sportsLineAvgPoints: editPlayerData.sportsLineAvgPoints,
      newAvgPoints: (editPlayerData.PPM * editPlayerData.newMins).toFixed(2),
    };

    const newStats = [...stats];

    const index = stats.findIndex((player) => player.playerDkId === editPlayerId);

    newStats[index] = editedPlayer;

    setStats(newStats);
    setEditPlayerId(null);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editPlayerData };
    newFormData[fieldName] = fieldValue;

    setEditPlayerData(newFormData);
  };

  const [editPlayerData, setEditPlayerData] = useState({
      playerDkId: "",
      playerImage160: "",
      displayName: "",
      teamAbbreviation: "",
      jackDKavgFPTs: "",
      PPM: "",
      newMins: "",
      Team: "",
      sportsLineMins: "",
      sportsLineAvgPoints: "",
      newAvgPoints: "",
  });

  const [editPlayerId, setEditPlayerId] = useState(null);
  

  function playerList() {
    return stats.map((player) => {
      return (
        <>
                {editPlayerId === player.playerDkId ? (
                  <PlayerEditRow
                    editFormData={editPlayerData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <PlayerReadRow
                    player={player}
                    handleEditClick={handleEditClick}
                  />
                )}
              </>
      );
    });
  }

  async function handleCSVDownload(){
    csvLink.current.link.click()
  }
  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  return (
    <>
    <Card style={{marginTop: '10px', marginBottom: '10px'}} bg="secondary">
      <Card.Header><h2 className="text-white">Game Stats</h2></Card.Header>
      <Card.Body>
      <Form>
      <Row>
      <Col>
      <Form.Group className="mb-3" controlId="formBasicSeason">
        <Form.Label style={{color: "white"}}>Season</Form.Label>
        <Form.Select onChange={(e)=> {setSeason(e.target.value); setVisible(false)}} value={seasonValue}>
        {sportValue === 'NBA' ? (
                  <>
                  <option>2022-23</option>
                  <option>2021-22</option>
                  <option>2023-24</option>
                  </>
                ) : (
                  <>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  </>
                )}
          
        </Form.Select>
      </Form.Group>
      </Col>
      <Col>
      <Form.Group className="mb-3" controlId="formBasicSeasonType">
        <Form.Label style={{color: "white"}}>Season Type</Form.Label>
        <Form.Select onChange={(e)=> {setSeasonType(e.target.value); setVisible(false)}} value={seasonTypeValue}>
                {sportValue === 'NBA' ? (
                  <>
                  <option>Playoffs</option>
                  <option>Regular%20Season</option>
                  </>
                ) : (
                  <>
                  <option></option>
                  <option>Regular+Season</option>
                  </>
                )}
      </Form.Select>
      </Form.Group>
      </Col>
      <Col>
      <Form.Group className="mb-3" controlId="formBasicSport">
        <Form.Label style={{color: "white"}}>Sport WIP</Form.Label>
        <Form.Select onChange={(e)=> {setSport(e.target.value); setVisible(false)}} value={sportValue}>
          <option>NBA</option>
          <option>WNBA</option>
        </Form.Select>
      </Form.Group>
      </Col>
      </Row>
      <Button variant="success" type="submit" onClick={handleSubmit}>Get Stats</Button>
      <Button variant="success" style={{marginLeft: '10px'}} onClick={handleCSVDownload}>{`Download CSV for ${word()}`}</Button>
      <CSVLink
        headers={headers}
        data={stats}
        filename={`${word()}editWasMade.csv`}
        className='hidden'
        ref={csvLink}
        target='_blank'
      />
        {footMessage()}
      </Form>
      <Row></Row>
      </Card.Body>
    </Card>
    <div>
      <h1 style={{ textAlign: "center" }}>Player Stats</h1>
      <form onSubmit={handleEditFormSubmit}>
      <Table className="table table-striped" responsive='sm' style={{ marginTop: 20 }}>
        <thead>
          <tr style={{fontSize: '15px'}}>
            <th>ID</th>
            <th></th>
            <th style={{cursor: "pointer"}} onClick={handleNameSort}>Name</th>
            <th>Team</th>
            <th style={{cursor: "pointer"}} onClick={handleAvgPointsSort}>Avg Points</th>
            <th style={{cursor: "pointer"}} onClick={handlePPMSort}>PPM</th>
            <th>Mins</th>
            <th style={{cursor: "pointer"}} onClick={handleNewPointsSort}>Expected Points</th>
          </tr>
        </thead>
        <tbody>{playerList()}</tbody>
      </Table>
      </form>
    </div>
    </>
  );
}