import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UnauthorizedPopUp from "../components/UnauthorizedPopUp";
import ErrorPopUp from "../components/ErrorPopUp";
import image from "../assets/black image.webp"
import ArtService from "../services/ArtService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddPaintingPage() {

    const userToken = useSelector((state) => state.token);
    const role = localStorage.getItem("role");

    const [messageValue, setMessageValue] = useState("");
    const [messageField, setMessageField] = useState(false);

    const [uploadedImageByteArray, setUploadedImageByteArray] = useState([null]);

    const [painting, setPainting] = useState({
        name: "",
        price: "",
        description: "",
        length: "",
        width: "",
        image: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPainting({ ...painting, [name]: value });
    };

    useEffect(() => {
        setMessageField("");
        setMessageValue("");
    }, [painting])

    function handleSubmit() {

        if (!painting.image) {
            toast.error("Painting does not have an image!")
        }
        else if (!painting.name || !painting.price || !painting.description || !painting.width || !painting.length) {
            toast.error("Fill in all fields shown.")
        }
        else {
            let body =
            {
                name: painting.name,
                price: painting.price,
                description: painting.description,
                length: painting.length,
                width: painting.width,
                image: [...uploadedImageByteArray]
            }
            
            // console.log("body = " + body.name)
            // console.log("body = " + body.price)
            // console.log("body = " + body.description)
            // console.log("body = " + body.length)
            // console.log("body = " + body.width)
            // console.log("body = " + body.image)

            ArtService.addPainting(userToken, body)
                .then((response) => {
                    if (response) {
                        setMessageField("Success!")
                        setMessageValue("Painting created!")
                        toast.success(`Painting ${painting.name} has been added.`)
                    }
                    else {
                        console.log("error on response: " + response.data)
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 400) {
                        console.log("400 error");
                        console.log(error.response)

                        if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                            const firstError = error.response.data.errors[0];
                            const { field: messageField, error: messageValue } = firstError;
                            setMessageField(messageField);
                            setMessageValue(messageValue);
                            console.log("error field: " + messageField);
                            toast.error("Painting already exists!")
                        } else {
                            console.log("No errors array or it is empty.");
                            // Handle the case where there are no errors or the errors array is empty
                        }
                    }
                    else if (error.response && error.response.status === 409) {
                        if (error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                            const firstError = error.response.data.errors[0];
                            const { field: messageField, error: messageValue } = firstError;
                            setMessageField(messageField);
                            setMessageValue(messageValue);
                            console.log("error field: " + messageField);
                            toast.error("Painting already exists!")
                        }
                    }
                    else { console.log("error is " + error) }
                })
        }
    }

    const openFileExplorer = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".jpg,.jpeg,.png";
        input.onchange = handleFileSelect;
        input.click();
    };

    const handleFileSelect = async (event) => {
        event.preventDefault();

        const file = event.target.files[0];
        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    const byteArray = new Uint8Array(arrayBuffer);
                    //const base64String = byteArrayToBase64String(byteArray);
                    setUploadedImageByteArray(byteArray);
                    setPainting(prevState => ({
                        ...prevState,
                        image: URL.createObjectURL(file)
                    }));
                    //THIS IS HOW YOU SAVE ON PAGE THE IMAGE, SO IT REFRESHES
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert("Please select a file of type JPG or JPEG.");
            }
        }
    };

    const removeImage = () => {
        setUploadedImageByteArray(null);
        setPainting(prevState => ({
            ...prevState,
            image: null
        }))
        console.log("Image removed.")
    }

    return (
        <>
            {userToken ? (
                <>
                    {role === "ADMIN" ? (
                        <>
                            <div className="detail-title-container">
                                <h1 className="display-4 detail-banner fw-bold">Add Painting</h1>
                            </div>
                            <div className="row d-flex text-center">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 h-auto mb-3">
                                    {painting.image ? (
                                        <img className="detail_card_img img-fluid w-auto border border-5 rounded-3" src={painting.image} alt="Painting_Image"></img>
                                    ) : (
                                        <img className="detail_card_img img-fluid w-auto border border-5 rounded-3" src={image} alt="Painting_Image"></img>
                                    )}

                                    <div className="col-sm mt-3 d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="btn btn-secondary btn-outline-light" onClick={openFileExplorer}>
                                            Upload Image
                                        </button>
                                    </div>
                                    <div className="col-sm mt-3 d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="btn btn-outline-light btn-warning text-black" onClick={removeImage}>
                                            Remove Image
                                        </button>
                                    </div>

                                </div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-6 d-flex flex-column justify-content-center
                    align-items-center">
                                    {/* <h2>Description: {painting.description}</h2> */}
                                    <div className="register-form mt-2">
                                        <div className="form-floating w-100 mb-4 mt-3">
                                            <input type="text" name="name" className="form-control w-100 border border-5 border-dark" id="name" onChange={handleChange} placeholder="Painting Name" required></input>
                                            <label htmlFor="name">Painting name</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4 col-lg-12">
                                            <input name="price" min={1} type="number" className="form-control w-100 border border-5 border-dark" id="price" onChange={handleChange} placeholder="Price" required></input>
                                            <label htmlFor="price">Price</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <textarea rows={4} cols={50} name="description" type="text" className="form-control w-100 border border-5 border-dark h-100" id="description" onChange={handleChange} placeholder="Description" required></textarea>
                                            <label className="h-auto" htmlFor="description">Description</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="number" min={1} name="length" className="form-control w-100 border border-5 border-dark" id="length" onChange={handleChange} placeholder="Length" required></input>
                                            <label color="white" htmlFor="Length">Length</label>
                                        </div>
                                        <div className="form-floating w-100 mb-4">
                                            <input type="number" name="width" min={1} className="form-control w-100 border border-5 border-dark" id="width" onChange={handleChange} placeholder="Width" required></input>
                                            <label htmlFor="Width">Width</label>
                                        </div>
                                    </div>
                                    {messageField || messageValue ?
                                        (<div className="d-flex justify-content-center">
                                            <h3 className="d-block text-center text-danger bg-light rounded mt-2 fw-bold">{messageField} {messageValue}</h3>
                                        </div>)
                                        : (null)}
                                    <div className="col-sm d-flex flex-column justify-content-center
                    align-items-center">
                                        <button className="profile-btn-hover color-7 border border-4" onClick={handleSubmit} role="button">Add painting</button>
                                    </div>
                                </div>

                            </div>
                        </>
                    ) : (
                        <ErrorPopUp />
                    )}
                </>
            ) : (
                <UnauthorizedPopUp />
            )}
        </>
    )
}

export default AddPaintingPage;