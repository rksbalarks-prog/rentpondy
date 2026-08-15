

import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { FaRulerCombined, FaBed, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';

const ProductCarousel = () => {
  const products = [
    {
      id: 1,
      name: "Commerical",
      price: "₹144.30",
      mrp: "₹195.00",
      discount: "26% OFF",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSitcsMvc_zNNGXAzfhWnEDZnCibvisr063xQ&s",
      rating: 4.8,
      size:1500,
      bhk:2,
      owner:'single',
      time:'2 months ago',
      location:'pomndy'
    },
    {
      id: 2,
      name: "Commerical",
      price: "₹106.84",
      mrp: "₹115.00",
      discount: "7% OFF",
      image: "https://png.pngtree.com/png-vector/20240320/ourmid/pngtree-indian-poor-farmer-village-house-png-image_12019239.png",
      rating: 5.0,
      rating: 4.8,
      size:1500,
      bhk:2,
      owner:'single',
      time:'2 months ago',
      location:'pomndy'

    },
    {
      id: 3,
      name: "Commerical",
      price: "₹391.53",
      mrp: "₹435.00",
      discount: "7% OFF",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/290349310.jpg?k=ac95f1d98991623053e24c68a4e3257f3f1050f3d19fe68e43aabb5f4fe5b625&o=&hp=1",
      rating: 4.8,
      rating: 4.8,
      size:1500,
      bhk:2,
      owner:'single',
      time:'2 months ago',
      location:'pomndy'

    },
    {
      id: 4,
      name: "Commerical",
      price: "₹200.00",
      mrp: "₹250.00",
      discount: "20% OFF",
      image: "https://www.trade4asia.com/ProductImg/exterior3.jpg",
      rating: 4.6,
      rating: 4.8,
      size:1500,
      bhk:2,
      owner:'single',
      time:'2 months ago',
      location:'pomndy'

    },
    {
      id: 5,
      name: "Commerical",
      price: "₹300.00",
      mrp: "₹350.00",
      discount: "15% OFF",
      image: "https://imagecdn.99acres.com//microsite/wp-content/blogs.dir/6161/files/2024/08/architectural-styles_modern-minimalism-pic-2_pinterest_Anil-Sharma.jpg",
      rating: 4.7,
      rating: 4.8,
      size:1500,
      bhk:2,
      owner:'single',
      time:'2 months ago',
      location:'pomndy'

    },
  ];

  const [index, setIndex] = useState(0);

  // Function to group products dynamically
  const getChunkedProducts = (chunkSize) => {
    const chunked = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunked.push(products.slice(i, i + chunkSize));
    }
    return chunked;
  };

  // Adjust chunk size based on screen width
  const getChunkSize = () => {
    if (window.innerWidth >= 992) return 3; // Desktop: 3 cards per slide
    if (window.innerWidth >= 768) return 2; // Tablet: 2 cards per slide
    return 1; // Mobile: 1 card per slide
  };

  const chunkedProducts = getChunkedProducts(getChunkSize());

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % chunkedProducts.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? chunkedProducts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="container mt-4 position-relative" style={{fontFamily: 'Inter, sans-serif'}}>
      <h3 className="mb-4"  style={{color:'#105EEB '}}>FEATURE PROPERTY</h3>
      {/* Custom Buttons */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 10,
        }}
      >
        <button className="btn me-2 rounded-0" onClick={handlePrev}
        style={{color:'#ffc631 ', background:'#001F3F'}}>
          Previous
        </button>
        <button className="btn rounded-0" style={{color:'#001F3F', background:'#ffc631'}} onClick={handleNext}>
          Next
        </button>
      </div>

      <Carousel
        activeIndex={index}
        onSelect={(selectedIndex) => setIndex(selectedIndex)}
        indicators={false}
        controls={false}
      >
        {chunkedProducts.map((group, idx) => (
          <Carousel.Item key={idx}>
            <div className="row">
              {group.map((product) => (
                <div
                  className="col-lg-4 col-md-6 col-sm-12 mb-4"
                  key={product.id}
                >
                  <div className="card h-100">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '250px',
                        objectPosition: 'center',
                      }}
                    />
                    <div className="card-body">
                      <p className="card-title">{product.name}</p>
                       <p className="card-text text-muted">
                            <MdLocationOn /> {product.location}
                          </p>
                      <p className="card-text">
                        <span className="text-success">{product.price}</span>{" "}
                       
                      </p>

                      <div className="container p-0">
  <div className="row">
    <div className="col-md-6">
      <p>
        <FaRulerCombined className="icon" /> {product.size}
      </p>
    </div>
    <div className="col-md-6">
      <p>
      <FaBed className="icon ms-3" /> {product.bhk}
      </p>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <p>
        <FaUser className="icon" /> {product.owner}
      </p>
    </div>
    <div className="col-md-6">
      <p>
        <FaCalendarAlt className="icon ms-3" /> {product.time}
      </p>
    </div>
  </div>
</div>
                      <button className="btn btn-primary" style={{ width: '100%', background:'#001F3F', color:'#FFC631', border:'none', height:'50px' }}>VIEW DETAILS</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <p style={{float:'right', fontSize: '16px', color:'red', cursor:'pointer'}}> view more</p>
    </div>
  );
};

export default ProductCarousel;


