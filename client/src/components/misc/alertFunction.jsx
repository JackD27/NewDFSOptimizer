import { Alert } from 'react-bootstrap'
import React from "react";

// Here, we display our Navbar
export default function AlertFunction(props) {

  return (
    <Alert style={{marginTop: 20}}variant={props.variant}>{props.message}</Alert>
  );
}