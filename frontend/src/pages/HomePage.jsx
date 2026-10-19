import React, { useEffect, useState } from "react";
import './HomePage.css';
import multicolorSplatter from "../assets/multicolor_splatter_painting_4.jpg"
import mindMouthPainting from "../assets/mind_mouth_connection.jpg"

function HomePage() {

    const initialText1 = `ColorSickness is more than just an online art store, it's a journey through the vibrant and imaginative world of Mara-Ilinca Celmare, our talented artist. Since 2018, Mara has been passionately crafting unique and captivating art pieces that are sure to evoke emotions and spark conversations. With a dedication to detail and a commitment to handcrafting each creation, Mara's art transcends the ordinary, inviting you to explore the depths of color and emotion.
    Explore a diverse range of projects that showcase Mara's evolution as an artist. From mesmerizing abstract compositions to thought-provoking thematic series, each project tells a unique story. Immerse yourself in the rich tapestry of Mara's creativity, and discover the perfect piece to enhance your space.`;

    const initialText2 = `At ColorSickness, we take pride in offering only the finest handcrafted art. Mara's meticulous attention to detail ensures that each creation is a masterpiece, making your acquisition a one-of-a-kind treasure. Our dedication to quality shines through in every stroke, creating art that transcends time.
    Discover the ease of acquiring exceptional art from the comfort of your home. Our online platform provides a user-friendly interface, allowing you to browse, select, and purchase your favorite pieces effortlessly. Whether you're a seasoned art collector or a first-time buyer, ColorSickness is your gateway to a world of artistic wonders.
    Become a part of our growing community that celebrates art, creativity, and individuality.`;

    const [showFullText1, setShowFullText1] = useState(false);
    const [showFullText2, setShowFullText2] = useState(false);
    const [smallScreen, setSmallScreen] = useState(false);
    const buttonText1 = showFullText1 ? "See less..." : "See more...";
    const buttonText2 = showFullText2 ? "See less..." : "See more...";

    const toggleText1 = () => {
        setShowFullText1(!showFullText1);
    };

    const toggleText2 = () => {
        setShowFullText2(!showFullText2);
    };

    useEffect(() => {
        var w = window.innerWidth;
        if (w <= 991) {
            setSmallScreen(true);
        }
    }, [])

    return (
        <div className="main-content">
            <div className="home-title-container">
                <h1 className="display-4 home-banner fw-bold">ColorSickness</h1>
            </div>
            <div className="row">
                <div className="col-12 col-lg-8 text-start home_text_container fw-bold d-flex align-self-center p-4">
                    <div className="row">
                        <p className="col-12 mb-5">
                            {smallScreen ? (
                                <>
                                    {showFullText1 ? (
                                        <>
                                            {initialText1}
                                            <button onClick={toggleText1} className="btn btn-link bg-black text-white p-2">{buttonText1}</button>
                                        </>
                                    ) : (
                                        <>
                                            {initialText1.split(" ").slice(0, 20).join(" ")}...
                                            <button onClick={toggleText1} className="mx-2 btn btn-link bg-black text-white p-2">{buttonText1}</button>
                                        </>
                                    )}

                                </>
                            ) : (
                                <>
                                    {initialText1}
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <div className="align-content-center col-12 col-lg-4 d-flex flex-wrap justify-content-center">
                    <img className="img-fluid home_image" src={mindMouthPainting} alt="Mind_To_Mouth_Blue_Painting"></img>
                </div>
            </div>
            <div className="row mt-5">
                <div className="align-content-center col-12 col-lg-4 d-flex flex-wrap justify-content-center">
                    <img className="img-fluid home_image" src={multicolorSplatter} alt="Multicolor_Splatter_Painting"></img>
                </div>
                <div className="col-12 col-lg-8 text-start home_text_container fw-bold d-flex align-self-center p-4">
                    <div className="row">
                        <p className="col-12 mb-5">
                            {smallScreen ? (
                                <>
                                    {showFullText2 ? (
                                        <>
                                            {initialText2}
                                            <button onClick={toggleText2} className="btn btn-link bg-black text-white p-2">{buttonText2}</button>
                                        </>
                                    ) : (
                                        <>
                                            {initialText2.split(" ").slice(0, 20).join(" ")}...
                                            <button onClick={toggleText2} className="mx-2 btn btn-link bg-black text-white p-2">{buttonText2}</button>
                                        </>
                                    )}

                                </>
                            ) : (
                                <>
                                    {initialText2}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;