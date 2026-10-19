import React, { useState, useEffect } from "react";
// import axios from "axios";
// import NavBar from "../components/NavBar";
import "./CataloguePage.css"
import ArtService from "../services/ArtService";
import { Link, useNavigate } from "react-router-dom";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import { useSelector } from "react-redux";
import AuctionPage from "../pages/AuctionPage"
import loadingGIF from '../assets/loading_gif.gif'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function CataloguePage() {

  const [paintings, setPaintings] = useState([]);
  const [originalPaintings, setOriginalPaintings] = useState([]);
  const [unauthorized, setUnauthorized] = useState([]);
  const [loading, setLoading] = useState(true);
  const userToken = useSelector((state) => state.token);
  const navigator = useNavigate();
  //const [fullAuctionPainting, setFullAuctionPainting] = useState('');
  const [auctionPainting, setAuctionPainting] = useState("");
  const [sortingOption, setSortingOption] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {

    setLoading(true);

    if (userToken) {
      setUnauthorized(false);
    } else {
      setUnauthorized(true);
    }

    ArtService.fetchPaintings()
      .then((response) => {
        let counter = 0;
        const paintingsWithBlobs = response.data.paintings.map((painting) => {
          if (painting.sold === 0) {
            if (painting.image != null) {
              counter++;
              const arrayBufferView = new Uint8Array([...painting.image]);
              const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
              const imageUrl = URL.createObjectURL(blob);
              painting.image = imageUrl;
              if (painting.auction == 1) {
                setAuctionPainting(painting);
              }
              return {
                ...painting,
                image: imageUrl,
              };
            }
          }
        });
        if (counter >= 1) {
          setPaintings(paintingsWithBlobs);
          setOriginalPaintings(paintingsWithBlobs);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setUnauthorized(true);
        }
        console.error("Error fetching paintings:", error);
      })
      .finally(() => {
        setLoading(false);
      })
  }, [userToken]);

  if (unauthorized) {
    return (<UnauthorizedPopUp></UnauthorizedPopUp>)
  }

  if (loading) {
    return (<img className="pos_absolute loading_gif_icon" src={loadingGIF} alt="Loading..."></img>)
  }

  // useEffect(() => {
  //   if (localStorage.getItem("auction_item_id"))
  //   {
  //     getAuctionPainting();
  //   }
  // })

  // function getAuctionPainting() {
  //   ArtService.getPaintingById(auctionPainting.id, userToken)
  //     .then((response) => {
  //       if (response) {
  //         console.log("auction painting received!")
  //         let receivedPainting = response.data.painting;
  //         if (receivedPainting.image != null) {
  //           const arrayBufferView = new Uint8Array([...receivedPainting.image]);
  //           const blob = new Blob([arrayBufferView], { type: "image/jpeg, image/png, image/jpg" });
  //           const imageUrl = URL.createObjectURL(blob);
  //           receivedPainting.image = imageUrl;
  //           setFullAuctionPainting(receivedPainting);
  //         }
  //       }
  //     })
  // }

  const handleSorting = (option) => {
    setSortingOption(option)
    switch (option) {
      case "ascending":
        setPaintings([...paintings].sort((a, b) => a.price - b.price));
        break;
      case "descending":
        setPaintings([...paintings].sort((a, b) => b.price - a.price));
        break;
      case "length":
        setPaintings([...paintings].sort((a, b) => a.length - b.length));
        break;
      case "width":
        setPaintings([...paintings].sort((a, b) => a.width - b.width));
        break;
      case "default":
        setPaintings([...originalPaintings]);
        break;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="main-content">
      <button onClick={scrollToTop} className="go_to_top_button_catalogue">
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
      <div className="catalogue-title-container">
        <h1 className="display-4 catalogue-banner fw-bold">Catalogue</h1>
      </div>
      {auctionPainting ? (
        <Link to={{
          pathname: '/auction',
          state: { auctionPainting: auctionPainting }
        }} className="auction_link">
          <div className="border border-5 p-3 col-12 col-sm-9 m-auto">
            <div className="auction_title bg-warning w-50 text-center d-block">
              <h2 className="text-lg-center text-decoration-underline text-black fw-bold">LIVE Auction!</h2>
            </div>
            {/* <div className="auction_div">
              <div className="col-12">
                <img style={{ transform: `scaleX(1.5)` }} src={auctionPainting.image} alt={auctionPainting.name}></img>
              </div>
            </div> */}
            <div className="card mb-3">
              <img src={auctionPainting.image} className="card-img-top card_image" alt={auctionPainting.name}></img>
              <div className="card-body">
                <h5 className="card-title">{auctionPainting.name} - €{auctionPainting.price}</h5>
                <p className="card-text">{auctionPainting.description}</p>
                <p className="card-text"><small className="text-muted">Sizes (Length x Width): {auctionPainting.length} x {auctionPainting.width} cm.</small></p>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        null
      )}
      {paintings && paintings.length > 0 ? (
        <div className="row">
          <div className="d-flex justify-content-end mt-5">
            <select className="bg-light form-select fw-bold w-50 me-2" value={sortingOption} onChange={(e) => { handleSorting(e.target.value); }}>
              <option value="default">Sort By</option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
              <option value="length">Length</option>
              <option value="width">Width</option>
            </select>
          </div>
          {paintings.filter(painting => painting && painting.sold === 0)
            .map((painting) => {
              if (role === "ADMIN" && painting.sold === 0) {
                return (
                  <div key={painting.id} className="p-4 col-12 col-md-6 col-lg-4">
                    <Link className="card-text" to={`/detail/${painting.id}`}>
                      <div className="card card_custom mb-3">
                        <img className="card-img-top custom-image" src={painting.image} alt={`Painting ${painting.name}`} />
                        <div className="card-body text-center">
                          <h5 className="card-title">{painting.name}</h5>
                          <p className="card-text">{painting.description}</p>
                          <p className="card-text">Price: €{painting.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }
              else if (role === "CUSTOMER" && painting.auction == 0 && painting.sold === 0) {
                return (
                  <div key={painting.id} className="p-4 col-12 col-md-6 col-lg-4">
                    <Link className="card-text" to={`/detail/${painting.id}`}>
                      <div className="card card_custom mb-3">
                        <img className="card-img-top custom-image" src={painting.image} alt={`Painting ${painting.name}`} />
                        <div className="card-body text-center">
                          <h5 className="card-title">{painting.name}</h5>
                          <p className="card-text">{painting.description}</p>
                          <p className="card-text">Price: €{painting.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }
            })}
        </div>
      ) : (
        <>
          <h2 className="text-center bg-secondary fw-bold text-light p-5">We apologise, we have no paintings at the moment.</h2>
        </>
      )}


    </div>
  )
}

export default CataloguePage;

