import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axios from 'axios'
import AlertFunction from "../misc/alertFunction";
import { CSVLink, CSVDownload } from "react-csv";
import {Table, Form, Card, Button, Row, Col} from 'react-bootstrap'


// The FollowerList component.  This is the main component in this file.
export default function StatsList() {

  const csvLink = useRef()

  const [error, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  const [stats, setStats] = useState([]);

  const [nameSort, setNameSort] = useState(false);
  const [numberSort, setNumberSort] = useState(false);
  const [ppmSort, setPPMSort] = useState(false);

  const [seasonValue, setSeason] = useState('2022-23');
  const [seasonTypeValue, setSeasonType] = useState('Playoffs');

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
    { label: "Name", key: "displayName" },
    { label: "Team", key: "teamAbbreviation" },
    { label: "AvgPoints", key: "jackDKavgFPTs" },
    { label: "PPM", key: "PPM" },
    { label: "Mins", key: "newMins" },
    { label: "NewPoints", key: "newAvgPoints" }
];

  async function getStats() {
    const values = 
      {
        sportName: params.sportName,
        season: seasonValue,
        perMode: 'PerGame',
        seasonType: seasonTypeValue,
        draftGroup: Number(params.gameId),
      };
    try{
    const response = await axios.post(`http://localhost:5000/getEdittableCSV`, values);
    setStats(response.data);
    console.log(response.data)
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


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      
      getStats();
      console.log(seasonValue, seasonTypeValue)
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

function handleAVGPointsSortAsc(){
  const sortAvgPoints = [...stats].sort((a, b) => a.jackDKavgFPTs - b.jackDKavgFPTs);
  setStats(sortAvgPoints);
}

function handleAVGPointsSortDesc(){
  const sortAvgPoints = [...stats].sort((a, b) => b.jackDKavgFPTs - a.jackDKavgFPTs);
  setStats(sortAvgPoints);
}

function handleAvgPointsSort(){
  setNumberSort(!numberSort);
  (numberSort ? handleAVGPointsSortAsc() : handleAVGPointsSortDesc())
}

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
  


  const Player = ({image, name, team, AvgPoints, PPM, newMins, newAvgPoints}) => (
    <tr>
      <td style={{width: "7%"}}><img src={image} alt="N/A" style={{ width: '80%', height: '100%' }}/></td>
      <td style={{width: "16%"}}>{name}</td>
      <td style={{width: "5%"}}>{team}</td>
      <td style={{width: "8%"}}>{AvgPoints}</td>
      <td style={{width: "7%"}}>{PPM}</td>
      <td style={{width: "5%"}}>{newMins}</td>
      <td>{newAvgPoints}</td>
    </tr>
  );
  

  function playerList() {
    return stats.map((player) => {
      return (
        <Player
          image={player.playerImage160}
          name={player.displayName}
          team={player.teamAbbreviation}
          AvgPoints={player.jackDKavgFPTs}
          PPM={player.PPM}
          newMins={player.newMins}
          newAvgPoints={player.newAvgPoints}
        />
      );
    });
  }

  async function handleCSVDownload(){
    csvLink.current.link.click()
  }
  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  // This following section will display the table with the records of individuals and all their followers.
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
          <option></option>
          <option>2022-23</option>
          <option>2021-22</option>
          <option>2023-24</option>
        </Form.Select>
      </Form.Group>
      </Col>
      <Col>
      <Form.Group className="mb-3" controlId="formBasicSeasonType">
        <Form.Label style={{color: "white"}}>Season Type</Form.Label>
        <Form.Select onChange={(e)=> {setSeasonType(e.target.value); setVisible(false)}} value={seasonTypeValue}>
          <option></option>
          <option>Playoffs</option>
          <option>Regular%20Season</option>
        </Form.Select>
      </Form.Group>
      </Col>
      </Row>
      <Button variant="success" type="submit" onClick={handleSubmit}>Submit</Button>
      <Button variant="success" style={{marginLeft: '10px'}} onClick={handleCSVDownload}>{`Download CSV for ${word()}`}</Button>
      <CSVLink
        headers={headers}
        data={stats}
        filename={`${word()}transactions.csv`}
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
      <Table className="table table-striped" responsive='sm' style={{ marginTop: 20 }}>
        <thead>
          <tr style={{fontSize: '15px'}}>
            <th></th>
            <th style={{cursor: "pointer"}} onClick={handleNameSort}>Name</th>
            <th>Team</th>
            <th style={{cursor: "pointer"}} onClick={handleAvgPointsSort}>Avg Points</th>
            <th style={{cursor: "pointer"}} onClick={handlePPMSort}>PPM</th>
            <th>Mins</th>
            <th>newPoints</th>
          </tr>
        </thead>
        <tbody>{playerList()}</tbody>
      </Table>
    </div>
    </>
  );
}