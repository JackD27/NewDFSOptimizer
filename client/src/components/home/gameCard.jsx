import React from "react";
import './Navbar-With-Button-icons.css'
import { useNavigate } from "react-router-dom";

const GameCard = (props) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/gameInfo/${props.sport}/${props.draftgroup}`);
  }
  return (
    <div class="card px-0 py-0 my-4">
      <div class="card-body mx-5 px-5" style={{textAlign: "center"}}>
        <h4 class="card-title">{props.sport}</h4>
        <h6 class="text-muted card-subtitle mb-2">{props.type}</h6>
        <h6 class="text-muted card-subtitle mb-2">{props.team}</h6>
        <button class="btn btn-primary" type="button" onClick={handleClick}>
          Get Game Info: {props.draftgroup}
        </button>
        <p class="card-text">{props.time}</p>
      </div>
    </div>
  );
};

export default GameCard;
