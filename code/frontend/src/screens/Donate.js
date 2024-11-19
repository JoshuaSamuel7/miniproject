import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { Button, Modal, Carousel } from "react-bootstrap";
import { BASE_API_URL } from "../api/api";
import moment from "moment";
import image7 from "../images/image7.png";
import image8 from "../images/image88.jpg";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const Donate = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const history = useHistory();

  // State for individual fields
  const [funcname, setFuncname] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState("5");
  const [foodtype, setFoodtype] = useState("Beverage");
  const [cookedtime, setCookedtime] = useState("");
  const [expirytime, setExpirytime] = useState("");
  const [image, setImage] = useState(null);
  const [map, setMap] = useState({ address: "", city: "", state: "" });  // Address state
  const [cloudinaryImage, setCloudinaryImage] = useState(null);
  const [showMessage, setShowMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const handleClose = () => setShowModal(false);

  // Cloudinary instance setup
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_IMG_CLOUD,
    },
  });

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleMapChange = (e) => {
    setMap({
      ...map,
      [e.target.name]: e.target.value,
    });
  };

  const validateDates = () => {
    const currentdate = moment();
    let message = "";

    if (!moment(cookedtime).isBefore(moment(expirytime))) {
      message += "Cooked Time must be earlier than Expiry Time. ";
    }
    if (!moment().isBefore(moment(expirytime))) {
      message += "Expiry Time must be in the future. ";
    }
    if (!currentdate.isAfter(moment(cookedtime))) {
      message += "Cooked Time must be in the past. ";
    }

    return message;
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_IMG_UPLOAD);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_IMG_CLOUD}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const resData = await res.json();
      setCloudinaryImage(resData.public_id); // Save the Cloudinary image ID
      return resData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateDates();
    if (validationMessage) {
      setShowMessage(validationMessage);
      setShowModal(true);
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      const response = await sendRequest(
        `${BASE_API_URL}/donate`,
        "POST",
        JSON.stringify({
          funcname,
          name,
          mobile,
          description,
          quantity,
          quality,
          foodtype,
          cookedtime,
          expirytime,
          address: map.address,
          city: map.city,
          state: map.state,
          Url: imageUrl,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );

      if (response && response.userId) {
        history.push("/reqforfood");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Carousel>
        <Carousel.Item interval={2000}>
          <img className="d-block w-100" src={image7} alt="First slide" />
          <Carousel.Caption>
            <h1 className="fs-1 fw-bold">OUR MISSION</h1>
            <h2 className="fs-1 fw-bold">Make India Hunger Free</h2>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <img className="d-block w-100" src={image8} alt="Second slide" />
          <Carousel.Caption>
            <h1 className="fs-1 fw-bold">YOUR SUPPORT MATTERS</h1>
            <h2 className="fs-1 fw-bold">
              Contribute to help us provide essential food support to those in need
            </h2>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6 card mx-auto">
            <h4 className="text-danger text-center mt-4 mb-4">Enter details to Donate Food</h4>
            <form className="form-group" onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" placeholder="Function Name" value={funcname} onChange={(e) => setFuncname(e.target.value)} required />
              <input type="text" className="form-control mb-3" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" className="form-control mb-3" placeholder="Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              <textarea className="form-control mb-3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <input type="text" className="form-control mb-3" placeholder="Quantity (Persons)" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              <div className="form-group mb-3">
                <label>Hygiene Level</label>
                <select className="form-control" value={quality} onChange={(e) => setQuality(e.target.value)}>
                  {[5, 4, 3, 2, 1].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Food Type</label>
                <select className="form-control" value={foodtype} onChange={(e) => setFoodtype(e.target.value)}>
                  {["Beverage", "Dinner", "Lunch", "Other"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <input type="datetime-local" className="form-control mb-3" value={cookedtime} onChange={(e) => setCookedtime(e.target.value)} required />
              <input type="datetime-local" className="form-control mb-3" value={expirytime} onChange={(e) => setExpirytime(e.target.value)} required />
              <input type="text" className="form-control mb-3" placeholder="Address" name="address" value={map.address} onChange={handleMapChange} required />
              <input type="text" className="form-control mb-3" placeholder="City" name="city" value={map.city} onChange={handleMapChange} required />
              <input type="text" className="form-control mb-3" placeholder="State" name="state" value={map.state} onChange={handleMapChange} required />
              <input type="file" className="form-control mb-3" onChange={handleFileChange} required />
              <button type="submit" className="btn btn-danger btn-block">Donate</button>
            </form>
          </div>
        </div>
      </div>

      {cloudinaryImage && (
        <div className="mt-3 text-center">
          <h5>Uploaded Image Preview:</h5>
          <AdvancedImage cldImg={cld.image(cloudinaryImage)} />
        </div>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Invalid Time Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>{showMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Donate;
