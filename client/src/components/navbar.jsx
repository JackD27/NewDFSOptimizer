import React from "react";
// import { Navbar, Nav, Container } from 'react-bootstrap'
// import { Link } from 'react-router-dom'

// Here, we display our Navbar
export default function NavbarFunction() {


return(
  <nav class="navbar navbar-light navbar-expand-md py-3">
        <div class="container"><a class="navbar-brand d-flex align-items-center" href="/"><span>Jack's DK DFS Optimizer</span></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link active" href="/">Dashboard</a></li>
                </ul><button class="btn bg-white me-3" type="button">Log in</button><button class="btn btn-dark" type="button">Sign up</button>
            </div>
        </div>
    </nav>
)
  


  // return (
  //   <Navbar collapseOnSelectexpand="lg"bg="dark"variant="dark"className="mb-4">
  //     <Container>
  //     <Navbar.Brand as={Link} to="/" className="mx-3"> DFS Optimizer</Navbar.Brand>
  //     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  //     <Navbar.Collapse id="responsive-navbar-nav">
  //       <Nav className="me-auto">
  //         <Nav.Link as={Link} to="/">Home</Nav.Link>
  //         <Nav.Link as={Link} to="/stocks">Optimizer</Nav.Link>
  //       </Nav>
  //       <Nav>
  //       </Nav>
  //     </Navbar.Collapse>
  //     </Container>
  //   </Navbar>
  // );
}