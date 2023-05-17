// import React, { useEffect, useState } from "react";
// import getUserInfo from '../../utilities/decodeJwt';
// import { Button} from 'react-bootstrap'
// import { useNavigate } from 'react-router-dom'

// // Here, we display our Navbar
// export default function NavbarFunction() {
//   const navigate = useNavigate()
//   const [user, setUser] = useState({})

//   const handleLogin = async () => {
//     navigate("/login");
//   };

//   const handleRegister = async () => {
//     navigate("/register");
//   };

//   useEffect(() => {
//     setUser(getUserInfo())
//   }, [])

//   if(!user){
//   return (<div style={{textAlign: "center", position:"flex", marginTop:"300px", fontSize: "60px"}}>
//     <h3>You are not authorized to view this page, or an error has occurred. Please try to Login or Register with the buttons below.</h3>
//     <Button variant="success" size="lg" style={{marginRight:"10px"}} onClick={handleLogin}>Login</Button>
//     <Button variant="success" size="lg" style={{marginLeft:"10px"}}onClick={handleRegister}>Register</Button>
    
//     </div>
//   );
// }}