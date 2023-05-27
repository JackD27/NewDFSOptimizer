import React from "react";

const PlayerReadRow = ({player, handleEditClick}) => {
  return (
    <tr>
      <td style={{width: "5%"}}>{player.playerDkId}</td>
      <td style={{width: "7%"}}><img src={player.playerImage160} alt="N/A" style={{ width: '80%', height: '100%' }}/></td>
      <td style={{width: "16%"}}>{player.displayName}</td>
      <td style={{width: "5%"}}>{player.teamAbbreviation}</td>
      <td style={{width: "8%"}}>{player.jackDKavgFPTs}</td>
      <td style={{width: "7%"}}>{player.PPM}</td>
      <td style={{width: "8%"}}><button type="button" onClick={(event) => handleEditClick(event, player)}>{player.newMins}</button></td>
      <td>{player.newAvgPoints}</td>
    </tr>
  );
};

export default PlayerReadRow;