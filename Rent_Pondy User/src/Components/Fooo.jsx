import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AddHomeIcon from '@mui/icons-material/AddHome';
import './BottomNavigationComponent.css';

export default function Fooo() {
    const [value, setValue] = useState(0);

  return (
    <>
    <title>Animated Bottom Navigation Bar</title>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="styles.css" />
    <style
      dangerouslySetInnerHTML={{
        __html:
          '\n    @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");\n@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Outlined");\n\n:root {\n  --accent-color: #1fa8f5;\n  --accent-color-fg: #fefefe;\n  --backdrop-color: #89d4fe;\n  --app-content-background-color: #c0d8ec;\n  --inset-shadow: rgba(7, 43, 74, 0.3);\n  --outset-shadow: rgba(223, 240, 255, 0.25);\n  --clay-box-shadow: rgba(7, 43, 74, 0.3);\n  --clay-background-color: #c0d8ec;\n  --clay-fg-color: #444;\n}\n\nbody {\n  background-color: var(--backdrop-color);\n  font-size: 10px;\n  font-family: "Roboto", sans-serif;\n}\n\n.flex-center {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n}\n\n.container {\n  padding: 1rem 1rem 1.5rem;\n}\n\n.stage {\n  max-width: 400px;\n  width: 400px;\n  margin: 0 auto;\n}\n\n.home.active {\n  color: var(--accent-color);\n}\n.home-style {\n  --app-content-background-color: #c0d8ec;\n}\n\n.products.active {\n  --outset-shadow: rgba(247, 167, 103, 0.45);\n  --inset-shadow: rgba(149, 62, 8, 0.45);\n  --clay-box-shadow: rgba(211, 69, 20, 0.4);\n  --clay-background-color: #d34514;\n  --clay-fg-color: #f1f2f3;\n  color: #690c0c;\n}\n.products-style {\n  --app-content-background-color: #d36e5a;\n}\n\n.services.active {\n  --outset-shadow: rgba(255, 159, 40, 0.45);\n  --inset-shadow: rgba(88, 54, 13, 0.45);\n  --clay-box-shadow: rgba(88, 54, 13, 0.4);\n  --clay-background-color: #ed9426;\n  --clay-fg-color: #f1f2f3;\n  color: #cf5c0f;\n}\n.services-style {\n  --app-content-background-color: #ed9426;\n}\n\n.about.active {\n  --outset-shadow: rgba(93, 255, 85, 0.45);\n  --inset-shadow: rgba(28, 78, 26, 0.45);\n  --clay-box-shadow: rgba(28, 78, 26, 0.4);\n  --clay-background-color: #4dd146;\n  --clay-fg-color: #f1f2f3;\n  color: #4dd146;\n}\n.about-style {\n  --app-content-background-color: #4dd146;\n}\n\n.help.active {\n  --outset-shadow: rgba(230, 230, 230, 0.45);\n  --inset-shadow: rgba(81, 81, 81, 0.45);\n  --clay-box-shadow: rgba(81, 81, 81, 0.4);\n  --clay-background-color: #a3a3a3;\n  --clay-fg-color: #f1f2f3;\n  color: #783896;\n}\n.help-style {\n  --app-content-background-color: #a3a3a3;\n}\n\n.tabbar {\n  background-color: var(--app-content-background-color);\n  border-bottom-left-radius: 1rem;\n  border-bottom-right-radius: 1rem;\n  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);\n  height: 120px;\n  display: flex;\n  flex-direction: column;\n  box-sizing: content-box;\n  position: relative;\n  overflow: hidden;\n  transition: background-color 0.4s;\n}\n.tabbar ul,\n.tabbar li {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}\n.tabbar ul {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  background-color: #f9f8fa;\n  align-self: flex-end;\n  justify-content: center;\n  height: 50px;\n}\n.tabbar li {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 1rem;\n  margin-right: 5px;\n  transition: all 0.4s;\n  background-color: #f9f8fa;\n  width: 60px;\n  height: 60px;\n  position: relative;\n  color: #888;\n  cursor: pointer;\n}\n.tabbar li:last-child {\n  margin-right: 0;\n}\n\n.tab-style2 ul {\n  justify-content: center;\n}\n.tab-style2 li {\n  border-top-left-radius: 100%;\n  border-top-right-radius: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  top: 1px;\n  left: 0;\n  width: 60px;\n  height: 50px;\n}\n.tab-style2 .active {\n  width: 60px;\n  height: 60px;\n  top: -1rem;\n}\n.tab-style2 .active span {\n  font-size: 2rem;\n}\n.tab-style2 .active:before, .tab-style2 .active:after {\n  position: absolute;\n  content: " ";\n  width: 13px;\n  height: 13px;\n  border-bottom: 4px solid #f9f8fa;\n  top: 8px;\n}\n.tab-style2 .active:before {\n  border-bottom-right-radius: 100%;\n  left: -7px;\n}\n.tab-style2 .active:after {\n  border-bottom-left-radius: 100%;\n  right: -7px;\n}\n\n  '
      }}
    />
   
<div className="container stage">
      <div className="container">
        <div className="tabbar tab-style2">
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            showLabels
          >
            <BottomNavigationAction
              className="home"
              label="Home"
              icon={<HomeIcon />}
            />
            <BottomNavigationAction
              className="products"
              label="Property"
              icon={<BusinessIcon />}
            />
            <BottomNavigationAction
              className="home-property"
              label="HomeProperty"
              icon={<AddHomeIcon />}
            />
            <BottomNavigationAction
              className="buyer"
              label="Tenant"
              icon={<PersonIcon />}
            />
            <BottomNavigationAction
              className="more"
              label="More"
              icon={<MoreHorizIcon />}
            />
          </BottomNavigation>
        </div>
      </div>


   <form onSubmit={handleSubmit} className="m-0 p-3">
          {/* Price Range */}
         <div className="row mb-3 justify-content-around">
 
 
{/* <div className="form-group col-5 p-0 m-0" >
    <label style={{width:'100%'}}>
    <label>minPrice <span style={{ color: 'red' }}>* </span></label>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <select
            name="minPrice"
            value={formData.minPrice || ""}
            onChange={handleFieldChange}
            className="form-control"
            style={{ display: "none" }} // Hide the default <select> dropdown
          >
            <option value="">Select minPrice</option>
            {dataList.minPrice?.map((option, index) => (
              <option key={index} value={option}>
                 {formatPrice(option)}
              </option>
            ))}
          </select>

          <button
            className="m-0"
            type="button"
            onClick={() => toggleDropdown("minPrice")}
            style={{
              cursor: "pointer",
              border: "1px solid #4F4B7E",
              padding: "10px",
              background: "#fff",
              borderRadius: "5px",
              width: "100%",
              textAlign: "left",
              color: "#4F4B7E",
            }}
          >
            <span style={{ marginRight: "10px" }}>
              <img src={minprice} alt=""  width={20}/>
            </span>
            {formData.minPrice ? formatPrice(formData.minPrice) : "Select minPrice"}
          </button>

          {renderDropdown("minPrice")}
        </div>
      </div>
    </label>
  </div> */}
<div div className="form-group col-5 p-0 m-0" >
    <label style={{ width: '100%'}}>
    {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
<img src={minprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="minPrice"
      value={formData.minPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
      required
    >
      <option value="">Select minPrice</option>
      {dataList.minPrice?.map((option, index) => (
        <option key={index} value={option}>
         {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("minPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"
      }}
    >
{formData.minPrice ? formatPrice(formData.minPrice) : "Select Min Rental Amount"}
      {formData.minPrice && (
        <GoCheckCircleFill
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "green",
          }}
        />
      )}
    </button>

    {renderDropdown("minPrice")}
  </div>
</div>

    </label>
  </div>
    {/* <div className="form-group col-5 p-0 m-0" >
        <label style={{width:'100%'}}>
        <label>maxPrice <span style={{ color: 'red' }}>* </span></label>
    
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "1" }}>
              <select
                name="maxPrice"
                value={formData.maxPrice || ""}
                onChange={handleFieldChange}
                className="form-control"
                style={{ display: "none" }} // Hide the default <select> dropdown
              >
                <option value="">Select maxPrice</option>
                {dataList.maxPrice?.map((option, index) => (
                  <option key={index} value={option}>
                     {formatPrice(option)}
                  </option>
                ))}
              </select>
    
              <button
                className="m-0"
                type="button"
                onClick={() => toggleDropdown("maxPrice")}
                style={{
                  cursor: "pointer",
                  border: "1px solid #4F4B7E",
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "5px",
                  width: "100%",
                  textAlign: "left",
                  color: "#4F4B7E",
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  <img src={maxprice} alt="" width={20}/>
                </span>
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select maxPrice"}
              </button>
    
              {renderDropdown("maxPrice")}
            </div>
          </div>
        </label>
      </div> */}
 <div className="form-group col-5 p-0 m-0" >
    <label style={{ width: '100%'}}>
    {/* <label>Property Mode <span style={{ color: 'red' }}>* </span></label> */}

      <div
  style={{
    display: "flex",
    alignItems: "stretch", // <- Stretch children vertically
    width: "100%",
    boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
  }} className="rounded-2"
>
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      borderRight: "1px solid #4F4B7E",
      background: "#fff", // optional
    }}
  >
 <img src={maxprice} alt="" width={20}/>
 <sup style={{ color: 'red' }}>*</sup>  </span>

  <div style={{ flex: "1" }}>
    <select
      name="maxPrice"
      value={formData.maxPrice || ""}
      onChange={handleFieldChange}
      className="form-control"
      style={{ display: "none" }}
    >
      <option value="">Select maxPrice</option>
      {dataList.maxPrice?.map((option, index) => (
        <option key={index} value={option}>
          {formatPrice(option)}
        </option>
      ))}
    </select>

    <button
      className="m-0"
      type="button"
      onClick={() => toggleDropdown("maxPrice")}
      style={{
        border:"none",
        cursor: "pointer",
        padding: "12px",
        background: "#fff",
        borderRadius: "5px",
        width: "100%",
        textAlign: "left",
        color: "grey",
        position: "relative",
        boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)",
        fontSize:"13px"

      }}
    >
{formData.maxPrice ? formatPrice(formData.maxPrice) : "Select Max Rental Amount"}
      {formData.maxPrice && (
        <GoCheckCircleFill
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "green",
          }}
        />
      )}
    </button>

    {renderDropdown("maxPrice")}
  </div>
</div>

    </label>
  </div>

    </div>

          {/* Phone Number */}
         <div className="form-group">
         {/* <label>Phone Number:</label> */}
         
           <div className="input-card p-0 rounded-2" style={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'space-between', 
             width: '100%',  
             boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
             background: "#fff",
             paddingRight: "10px"
           }}>
             
           
           <img src={phone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
              {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E', marginLeft:"10px"}} /> */}
             
             <div style={{ flex: '0 0 10%' }}>
           <label className="m-0">
             <select
               name="countryCode"
               value={"+91"}
               readOnly
               onChange={handleFieldChange}
               className="form-control m-0 pt-2"
               style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
             >
               {countryCodes.map((item, index) => (
                 <option key={index} value={item.code}>
                   {item.code} {item.country}
                 </option>
               ))}
             </select>
           </label>
         </div>
         
         
             <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
           <input
               type="text"
               name="phoneNumber"
               value={formData.phoneNumber}
                     onChange={handleInputChange}

               className="form-input m-0"
               placeholder="Phone Number"
                 style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
             />
           </div>
               <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
             </div>
         </div>


{/* <div className="col-12 mb-3">
  <label  style={{fontWeight:600}}>AlternatePhone</label>
  <div className="input-card p-0 rounded-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '1px solid #4F4B7E', background: "#fff" }}>
    <FaPhoneAlt className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
    <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleInputChange}
      className="form-input m-0"
      placeholder="Enter Your alternatePhone"
      style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
      />
  </div>
</div> */}
<div className="form-group">
{/* <label>Alternate number:</label> */}

  <div className="input-card p-0 rounded-2" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',  
    boxShadow: '0 4px 10px rgba(38, 104, 190, 0.1)',
    background: "#fff",
    paddingRight: "10px"
  }}>
    
  <img src={altphone} alt="" style={{ width: 20, height: 20 ,marginLeft:"10px"}} />
     {/* <FaPhone className="input-icon" style={{ color: '#4F4B7E',marginLeft:"10px" }} /> */}
    
    <div style={{ flex: '0 1 10%' }}>
      <label className="m-0">
        <select
          name="countryCode"
          value={"+91"}
          onChange={handleInputChange}
          className="form-control m-0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
        >
          <option value="">Select Country Code</option>
          {countryCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} {item.country}
            </option>
          ))}
        </select>
      </label>
    </div>
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>


  <input
      type="number"
      name="alternatePhone"
      value={formData.alternatePhone}
      onChange={handleInputChange}
      className="form-input m-0"
      placeholder="Alternate Phone Number"
        style={{ flex: '1', padding: '12px', fontSize: '14px', border: 'none', outline: 'none' , color:"grey"}}
    />
  </div>
   {formData.alternatePhone && (
      <GoCheckCircleFill style={{ color: "green", margin: "5px" }} />
    )}
    </div>
</div>
          <div className="row justify-content-center">
            <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("propertyMode")}
                >
                  <span><FaBuilding className="me-2" color="#4F4B7E" /> {formData.propertyMode || "Select Property Mode"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>

              {dropdownState.activeDropdown === "propertyMode" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control m-0 mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState((prevState) => ({ ...prevState, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.propertyMode || [])
                      .filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase()))
                      .map((option, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action d-flex align-items-center"
                          onClick={() => handleDropdownSelect("propertyMode", option)}
                        >
                          {option}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div className="row">
            <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("propertyType")}
                >
                  <span><FaHome className="me-2" color="#4F4B7E" /> {formData.propertyType || "Select Property Type"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "propertyType" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.propertyType || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("propertyType", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bedrooms */}
            <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("bedrooms")}
                >
                  <span><FaBed className="me-2" color="#4F4B7E" /> {formData.bedrooms || "Select NoBHK"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "bedrooms" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.noOfBHK || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("bedrooms", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Facing */}
            <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("facing")}
                >
                  <span><FaCompass className="me-2" color="#4F4B7E" /> {formData.facing || "Select Facing"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "facing" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.facing || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("facing", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>



            
            
              <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>Rent Type</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="rentType"
                      value={formData.rentType || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select rent type</option>
                      {dataList.rentType?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("rentType")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.rentType || <FaHome />}
                      </span>
                      {formData.rentType || "Select rent type"}
                    </button>
            
                    {renderDropdown("rentType")}
                  </div>
                </div>
              </label>
            </div>
            
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>Number Of Floors</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="numberOfFloors"
                      value={formData.numberOfFloors || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select Number Of Floors </option>
                      {dataList.numberOfFloors?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("numberOfFloors")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.numberOfFloors || <FaHome />}
                      </span>
                      {formData.numberOfFloors || "Select Number Of Floors"}
                    </button>
            
                    {renderDropdown("numberOfFloors")}
                  </div>
                </div>
              </label>
            </div>
            
            
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>requirementType</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="requirementType"
                      value={formData.requirementType || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select requirementType </option>
                      {dataList.requirementType?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("requirementType")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.requirementType || <FaHome />}
                      </span>
                      {formData.requirementType || "Select requirementType"}
                    </button>
            
                    {renderDropdown("requirementType")}
                  </div>
                </div>
              </label>
            </div>
            
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>familyMembers</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="familyMembers"
                      value={formData.familyMembers || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select rent type</option>
                      {dataList.familyMembers?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("familyMembers")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.familyMembers || <FaHome />}
                      </span>
                      {formData.familyMembers || "Select familyMembers"}
                    </button>
            
                    {renderDropdown("familyMembers")}
                  </div>
                </div>
              </label>
            </div>
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>petAllowed</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="petAllowed"
                      value={formData.petAllowed || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select petAllowed</option>
                      {dataList.petAllowed?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("petAllowed")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.petAllowed || <FaHome />}
                      </span>
                      {formData.petAllowed || "Select petAllowed"}
                    </button>
            
                    {renderDropdown("petAllowed")}
                  </div>
                </div>
              </label>
            </div>
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>foodHabit</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="foodHabit"
                      value={formData.foodHabit || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select foodHabit</option>
                      {dataList.foodHabit?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("foodHabit")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.foodHabit || <FaHome />}
                      </span>
                      {formData.foodHabit || "Select foodHabit"}
                    </button>
            
                    {renderDropdown("foodHabit")}
                  </div>
                </div>
              </label>
            </div>
            
            <div className="form-group">
              <label style={{ width: '100%' }}>
                <label>jobType</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ flex: "1" }}>
                    <select
                      name="jobType"
                      value={formData.jobType || ""}
                      onChange={handleFieldChange}
                      className="form-control"
                      style={{ display: "none" }}
                    >
                      <option value="">Select jobType</option>
                      {dataList.jobType?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
            
                    <button
                      className="m-0"
                      type="button"
                      onClick={() => toggleDropdown("jobType")}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #4F4B7E",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "5px",
                        width: "100%",
                        textAlign: "left",
                        color: "#4F4B7E",
                      }}
                    >
                      <span style={{ marginRight: "10px" }}>
                        {fieldIcons.jobType || <FaHome />}
                      </span>
                      {formData.jobType || "Select jobType"}
                    </button>
            
                    {renderDropdown("jobType")}
                  </div>
                </div>
              </label>
            </div>
            

            {/* Property Approved */}
            {/* <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("propertyApproved")}
                >
                  <span><FaCheckCircle className="me-2" color="#4F4B7E" /> {formData.propertyApproved || "Select Property Approved"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "propertyApproved" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.propertyApproved || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("propertyApproved", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div> */}

            {/* Bank Loan */}
            {/* <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("bankLoan")}
                >
                  <span><FaUniversity className="me-2" color="#4F4B7E" /> {formData.bankLoan || "Select Bank Loan"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "bankLoan" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.bankLoan || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("bankLoan", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div> */}

            {/* Property Age */}
            {/* <div className="col-12 mb-3">
              <div className="input-group">
                <button
                  type="button"
                  style={{ border: "1px solid #4F4B7E" }}
                  className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                  onClick={() => toggleDropdown("propertyAge")}
                >
                  <span><FaClock className="me-2" color="#4F4B7E" /> {formData.propertyAge || "Select Property Age"}</span>
                  <FaChevronDown color="#4F4B7E" />
                </button>
              </div>
              {dropdownState.activeDropdown === "propertyAge" && (
                <div className="dropdown-popup w-100">
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Filter options..."
                    value={dropdownState.filterText}
                    onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                  />
                  <ul className="list-group mt-2 w-100">
                    {(dataList.propertyAge || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleDropdownSelect("propertyAge", option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div> */}
          
          
          
          </div>

          {/* City */}
          <div className="col-12 mb-3">
            <div
              className="input-card p-0 rounded-1"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                border: '1px solid #4F4B7E',
                background: "#fff"
              }}
            >
              <FaCity className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input m-0"
                placeholder="Enter City"
                style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
              />
            </div>
          </div>

          {/* State */}
           <div className="col-12 mb-3">
            <div className="input-group">
              <button
                type="button"
                style={{ border: "1px solid #4F4B7E" }}
                className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                onClick={() => toggleDropdown("state")}
              >
                <span><FaCity className="me-2" color="#4F4B7E" /> {formData.state || "Select state"}</span>
                <FaChevronDown color="#4F4B7E" />
              </button>
            </div>
            {dropdownState.activeDropdown === "state" && (
              <div className="dropdown-popup w-100">
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Filter options..."
                  value={dropdownState.filterText}
                  onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                />
                <ul className="list-group mt-2 w-100">
                  {(dataList.state || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleDropdownSelect("state", option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Area */}
          <div className="col-12 mb-3">
            <div
              className="input-card p-0 rounded-1"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                border: '1px solid #4F4B7E',
                background: "#fff"
              }}
            >
              <FaLandmark className="input-icon" style={{ color: '#4F4B7E', marginLeft: "10px" }} />
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="form-input m-0"
                placeholder="Enter Area"
                style={{ flex: '1 0 80%', padding: '8px', fontSize: '14px', border: 'none', outline: 'none' }}
              />
            </div>
          </div>

          {/* Area Unit */}
          {/* <div className="col-12 mb-3">
            <div className="input-group">
              <button
                type="button"
                style={{ border: "1px solid #4F4B7E" }}
                className="btn w-100 d-flex justify-content-between align-items-center m-0 text-muted"
                onClick={() => toggleDropdown("areaUnit")}
              >
                <span><FaRuler className="me-2" color="#4F4B7E" /> {formData.areaUnit || "Select Area Unit"}</span>
                <FaChevronDown color="#4F4B7E" />
              </button>
            </div>
            {dropdownState.activeDropdown === "areaUnit" && (
              <div className="dropdown-popup w-100">
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Filter options..."
                  value={dropdownState.filterText}
                  onChange={(e) => setDropdownState(prev => ({ ...prev, filterText: e.target.value }))}
                />
                <ul className="list-group mt-2 w-100">
                  {(dataList.areaUnit || []).filter(option => option.toLowerCase().includes(dropdownState.filterText.toLowerCase())).map((option, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => handleDropdownSelect("areaUnit", option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}

          {/* Payment Type */}
          {/* <div className="col-12 mb-3">
            <div
              className="input-card p-0 rounded-1"
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                border: '1px solid #4F4B7E',
                background: '#fff',
                position: 'relative',
              }}
            >
              <div
                className="d-flex align-items-center"
                onClick={() => toggleDropdown("paymentType")}
                style={{ cursor: 'pointer', padding: '8px 10px' }}
              >
                <FaCreditCard style={{ color: '#4F4B7E', marginRight: '10px' }} />
                <span style={{ flex: 1, color: formData.paymentType ? '#000' : '#6c757d' }}>
                  {formData.paymentType || "Select Payment Type"}
                </span>
                <FaChevronDown style={{ color: '#4F4B7E' }} />
              </div>

              {dropdownState.activeDropdown === "paymentType" && (
                <div
                  className="dropdown-popup w-100"
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#E9F7F2',
                    width: '100%',
                    maxWidth: '350px',
                    padding: '10px',
                    zIndex: 10,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    overflowY: 'auto',
                    maxHeight: '50vh',
                    animation: 'popupOpen 0.3s ease-in-out',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filter options..."
                      value={dropdownState.filterText}
                      onChange={(e) =>
                        setDropdownState((prev) => ({ ...prev, filterText: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => toggleDropdown('paymentType')}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                      }}
                    >
                      <FaTimes size={18} color="red" />
                    </button>
                  </div>
                  <ul className="list-group mt-2">
                    {(paymentTypes || [])
                      .filter((type) =>
                        type.paymentType.toLowerCase().includes(dropdownState.filterText.toLowerCase())
                      )
                      .map((type, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          style={{
                            padding: '5px',
                            cursor: 'pointer',
                            color: '#26794A',
                            marginBottom: '5px',
                          }}
                          onClick={() => {
                            handleDropdownSelect("paymentType", type.paymentType);
                            setDropdownState((prev) => ({ ...prev, filterText: "" }));
                          }}
                        >
                          {type.paymentType}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div> */}

          {/* Description */}
          <div className="col-12 mb-3">
            <div
              className="input-card p-0 rounded-1"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                border: '1px solid #4F4B7E',
                background: "#fff"
              }}
            >
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input m-0"
                placeholder="Enter Description"
                style={{
                  flex: '1 0 80%',
                  padding: '8px',
                  fontSize: '14px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '100px'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: "#6CBAAF",
              border: 'none',
              color: '#ffffff',
              width: '100%',
              borderRadius: '5px',
              marginTop: '10px'
            }}
          >
            {Ra_Id ? "UPDATE PROPERTY ASSISTANCE" : "ADD PROPERTY ASSISTANCE"}
          </button>
        </form>


    </div>
  </>  )
}
