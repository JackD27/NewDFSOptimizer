import React from "react";

const PlayerEditRow = ({editFormData, handleEditFormChange, handleCancelClick,}) => {
  return (
    <tr>
      <td style={{width: "5%"}}>{editFormData.playerDkId}</td>
      <td style={{width: "7%"}}><img src={editFormData.playerImage160} alt="N/A" style={{ width: '80%', height: '100%' }}/></td>
      <td style={{width: "16%"}}>{editFormData.displayName}</td>
      <td style={{width: "5%"}}>{editFormData.teamAbbreviation}</td>
      <td style={{width: "8%"}}>{editFormData.jackDKavgFPTs}</td>
      <td style={{width: "7%"}}>{editFormData.PPM}</td>
      <td style={{width: "8%"}}><input type="number" placeholder="0" name="newMins" min={0} value={editFormData.newMins} onChange={handleEditFormChange}></input><button type="submit">Save</button><button type="button" onClick={handleCancelClick}>Cancel</button></td>
      <td>{editFormData.newAvgPoints}</td>
    </tr>
  );
};

export default PlayerEditRow;