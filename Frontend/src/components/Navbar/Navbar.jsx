import React, { useState, useContext, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import "./Navbar.css";

const Navbars = ({ setShowLogin, setFormType, isLoggedIn, setIsLoggedIn }) => {
  const { getTotalItems, getTotalPrice, setCartItem } =
    useContext(StoreContext);
  const [nav, setNav] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const location = useLocation();
  const isNotHomePage = location.pathname !== "/";

  useEffect(() => {
    const changeValueOnScroll = () => {
      const scrollValue = document?.documentElement?.scrollTop || 0;
      setNav(scrollValue > 100);
    };

    window.addEventListener("scroll", changeValueOnScroll);
    return () => {
      window.removeEventListener("scroll", changeValueOnScroll);
    };
  }, []);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [isLoggedIn]);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    // Confirm the action before logging out
    const userConfirmed = window.confirm("Are you sure you want to log out?");
    if (!userConfirmed) return;

    // Clear user-related data
    localStorage.clear(); // Clears all localStorage data related to the user
    sessionStorage.clear(); // Optional: Clears sessionStorage if used

    localStorage.removeItem("userName");
    setCartItem([]); // Clear cart state
    console.log("User logged out and cart cleared");

    // Update the application state
    setUserName("");
    setIsLoggedIn(false);

    // Redirect to the home page
    toast.success("Logged out successfully!");
    navigate("/", { replace: true }); // Prevents navigating back to the protected page
  };

  return (
    <div>
      <header>
        <Navbar
          collapseOnSelect
          expand="lg"
          className={`${nav || isNotHomePage ? "sticky" : ""}`}
        >
          <Container>
            <Navbar.Brand>
              <Link to="/" className="logo" onClick={scrollTop}>
                <img src={assets.logo} alt="Logo" className="img-fluid" />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto">
                <Link to="/" onClick={scrollTop}>
                  Home
                </Link>
                <Link to="/#explore-menu">Menu</Link>
                <Link to="/#app-download">Mobile-app</Link>
                <Link to="/#contact-us">Contact-us</Link>
                <Link to="/cart" onClick={scrollTop}>
                  <div className="cart">
                    <i className="bi bi-bag"></i>
                    {totalItems > 0 && (
                      <span className="cart-count">{totalItems}</span>
                    )}
                    <span className="cart-price">
                      Rs.{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </Link>

                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setFormType("Login");
                      }}
                      className="sign-in-button"
                    >
                      SIGN-IN
                    </button>

                    <button
                      onClick={() => {
                        setShowLogin(true);
                        setFormType("Sign Up");
                      }}
                      className="sign-up-button"
                    >
                      SIGN-UP
                    </button>
                  </>
                ) : (
                  <div className="navbar-profile">
                    <ul className="profile-username-container">
                      <li>
                        <i class="bi bi-person"></i>
                        <span className="profile-username">{userName}</span>
                      </li>
                    </ul>
                    <ul className="nav-profile-dropdown">
                      <Link to={"/profile"}>
                        <li>
                          <i class="bi bi-person-vcard"></i>
                          <span>Profile</span>
                        </li>
                      </Link>
                      <li onClick={handleLogout}>
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Log Out</span>
                      </li>
                    </ul>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
};

export default Navbars;
