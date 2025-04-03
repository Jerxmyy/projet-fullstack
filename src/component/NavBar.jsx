import { useState } from "react";
import { useGameData } from "../hook/useGameData";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaGamepad,
  FaSearch,
} from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import "./Navbar.css";

function GameLibNavbar() {
  const { platforms, loading, error } = useGameData();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const platformIcons = {
    PC: <FaWindows className="platform-icon" />,
    PlayStation: <FaPlaystation className="platform-icon" />,
    Xbox: <FaXbox className="platform-icon" />,
    Nintendo: <FaGamepad className="platform-icon" />,
  };

  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Navbar expand="lg" className="game-navbar">
      <Container fluid>
        <Nav className="me-auto navbar-nav">
          {error && (
            <Nav.Link className="text-danger">Erreur: {error}</Nav.Link>
          )}
          {loading ? (
            <Nav.Link disabled>Chargement...</Nav.Link>
          ) : (
            platforms.map((platform) => (
              <Nav.Link
                key={platform.id}
                as={Link}
                to={`/product/platform/${platform.id}`} // Lien mis à jour avec react-router-dom
              >
                {platformIcons[platform.name] || null} {platform.name}
              </Nav.Link>
            ))
          )}
        </Nav>
        <div className="search-container">
          <button className="search-button" onClick={handleSearchClick}>
            <FaSearch size={24} />
          </button>
          {searchVisible && (
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default GameLibNavbar;
