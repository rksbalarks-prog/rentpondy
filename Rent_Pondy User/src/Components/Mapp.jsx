
// import React, { useEffect, useRef, useState } from 'react';
// import { FcSearch } from 'react-icons/fc';

// const Mapp = () => {
//   const inputRef = useRef(null);
//   const latRef = useRef(null);
//   const lngRef = useRef(null);
//   const mapRef = useRef(null);
//   const mapInstance = useRef(null);
//   const markerRef = useRef(null);
//   const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

//   useEffect(() => {
//     if (!window.google) return;

//     const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India

//     const map = new window.google.maps.Map(mapRef.current, {
//       center: defaultCenter,
//       zoom: 5,
//     });

//     mapInstance.current = map;

//     const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//       types: ['geocode'],
//     });

//     autocomplete.bindTo('bounds', map);

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       if (!place.geometry || !place.geometry.location) return;

//       const lat = place.geometry.location.lat();
//       const lng = place.geometry.location.lng();
//       setCoordinates({ lat, lng });

//       updateMap(lat, lng);
//     });
//   }, []);

//   const updateMap = (lat, lng) => {
//     const location = new window.google.maps.LatLng(lat, lng);
//     mapInstance.current.setCenter(location);
//     mapInstance.current.setZoom(15);

//     if (markerRef.current) {
//       markerRef.current.setMap(null);
//     }

//     markerRef.current = new window.google.maps.Marker({
//       map: mapInstance.current,
//       position: location,
//     });
//   };

//   const handleLatLngSearch = () => {
//     const lat = parseFloat(latRef.current.value);
//     const lng = parseFloat(lngRef.current.value);

//     if (!isNaN(lat) && !isNaN(lng)) {
//       setCoordinates({ lat, lng });
//       updateMap(lat, lng);
//     } else {
//       alert('Please enter valid latitude and longitude');
//     }
//   };

//   return (
//     <>
//       {/* Search by Location Name */}
//       <div
//         className="input-card p-0 rounded-1 mb-2"
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: '100%',
//           border: '1px solid #4F4B7E',
//           background: '#fff',
//         }}
//       >
//         <FcSearch className="input-icon" style={{ color: '#4F4B7E', marginLeft: '10px' }} />
//         <input
//           ref={inputRef}
//           id="pac-input"
//           className="form-input m-0"
//           placeholder="Search location"
//           style={{
//             flex: '1 0 80%',
//             padding: '8px',
//             fontSize: '14px',
//             border: 'none',
//             outline: 'none',
//           }}
//         />
//       </div>

//       {/* Manual Lat/Lng Input */}
//       <div className="d-flex mb-2" style={{ gap: '10px' }}>
//         <input
//           ref={latRef}
//           type="text"
//           placeholder="Latitude"
//           style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
//         />
//         <input
//           ref={lngRef}
//           type="text"
//           placeholder="Longitude"
//           style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
//         />
//         <button onClick={handleLatLngSearch} style={{ padding: '8px 12px' }}>
//           Go
//         </button>
//       </div>

//       {/* Google Map */}
//       <div ref={mapRef} id="map" style={{ height: '200px', width: '100%' }}></div>

//       {/* Display Selected Coordinates */}
//       {coordinates.lat && coordinates.lng && (
//         <div style={{ marginTop: '10px', fontSize: '14px' }}>
//           Selected Coordinates: <strong>{coordinates.lat}, {coordinates.lng}</strong>
//         </div>
//       )}
//     </>
//   );
// };

// export default Mapp;
import React, { useEffect, useRef, useState } from 'react';
import { FcSearch } from 'react-icons/fc';

const LocationSearchForm = () => {
  const inputRef = useRef(null);
  const latRef = useRef(null);
  const lngRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const [formData, setFormData] = useState({
    propertyMode: '',
    propertyType: '',
    price: '',
    propertyAge: '',
    bankLoan: '',
    negotiation: '',
    length: '',
    breadth: '',
    totalArea: '',
    ownership: '',
    bedrooms: '',
    kitchen: '',
    kitchenType: '',
    balconies: '',
    floorNo: '',
    areaUnit: '',
    propertyApproved: '',
    postedBy: '',
    facing: '',
    salesMode: '',
    salesType: '',
    description: '',
    furnished: '',
    lift: '',
    attachedBathrooms: '',
    western: '',
    numberOfFloors: '',
    carParking: '',
    rentalPropertyAddress: '',
    country: '',
    state: '',
    city: '',
    district: '',
    area: '',
    streetName: '',
    doorNumber: '',
    nagar: '',
    ownerName: '',
    email: '',
    countryCode: "+91",
    phoneNumber: '',
    phoneNumberCountryCode: '',
    alternatePhone: '',
    alternatePhoneCountryCode: '',
    bestTimeToCall: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (!window.google) return;

    const defaultCenter = { lat: 20.5937, lng: 78.9629 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 5,
    });

    mapInstance.current = map;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
    });

    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      updateMap(lat, lng);

      const getComponent = (type) => {
        const component = place.address_components?.find(c => c.types.includes(type));
        return component?.long_name || '';
      };

      setFormData(prev => ({
        ...prev,
        pinCode: getComponent("postal_code"),
        city: getComponent("locality") || getComponent("administrative_area_level_2"),
        area: getComponent("sublocality") || getComponent("sublocality_level_1"),
        streetName: getComponent("route") || getComponent("premise"),
        district: getComponent("administrative_area_level_2"),
        state: getComponent("administrative_area_level_1"),
        country: getComponent("country"),
        latitude: lat,
        longitude: lng,
        rentalPropertyAddress: place.formatted_address || '',
      }));
    });
  }, []);

  const updateMap = (lat, lng) => {
    const location = new window.google.maps.LatLng(lat, lng);
    mapInstance.current.setCenter(location);
    mapInstance.current.setZoom(15);

    if (markerRef.current) markerRef.current.setMap(null);

    markerRef.current = new window.google.maps.Marker({
      map: mapInstance.current,
      position: location,
    });
  };

  const handleLatLngSearch = () => {
    const lat = parseFloat(latRef.current.value);
    const lng = parseFloat(lngRef.current.value);
  
    if (!isNaN(lat) && !isNaN(lng)) {
      updateMap(lat, lng);
  
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };
  
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];
  
          const getComponent = (type) => {
            const comp = place.address_components.find(c => c.types.includes(type));
            return comp?.long_name || '';
          };
  
          setFormData(prev => ({
            ...prev,
            rentalPropertyAddress: place.formatted_address,
            latitude: lat,
            longitude: lng,
            pinCode: getComponent("postal_code"),
            city: getComponent("locality") || getComponent("administrative_area_level_2"),
            area: getComponent("sublocality") || getComponent("sublocality_level_1"),
            streetName: getComponent("route") || getComponent("premise"),
            district: getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
          }));
        } else {
          alert('Reverse geocoding failed: ' + status);
        }
      });
    } else {
      alert("Enter valid coordinates");
    }
  };
  

  return (
    <div>
      {/* 🔍 Autocomplete Input */}
      <div style={{ display: 'flex', border: '1px solid #4F4B7E', background: '#fff', marginBottom: 10 }}>
        <FcSearch style={{ margin: '10px' }} />
        <input
          ref={inputRef}
          placeholder="Search location"
          style={{ flex: 1, border: 'none', outline: 'none', padding: '10px' }}
        />
      </div>

      {/* 🌍 Manual Lat/Lng Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
        <input ref={latRef} placeholder="Latitude" style={{ flex: 1, padding: '8px' }} />
        <input ref={lngRef} placeholder="Longitude" style={{ flex: 1, padding: '8px' }} />
        <button onClick={handleLatLngSearch}>Go</button>
      </div>

      {/* 🗺️ Map */}
      <div ref={mapRef} style={{ height: 200, width: '100%', marginBottom: 20 }} />

      {/* 📝 Address Fields Preview */}
      <div style={{ display: 'grid', gap: 10 }}>
        <input value={formData.rentalPropertyAddress} placeholder="Rental Address" readOnly />
        <input value={formData.latitude} placeholder="Latitude" readOnly />
        <input value={formData.longitude} placeholder="Longitude" readOnly />
        <input value={formData.area} placeholder="Area" readOnly />
        <input value={formData.city} placeholder="City" readOnly />
        <input value={formData.district} placeholder="District" readOnly />
        <input value={formData.state} placeholder="State" readOnly />
        <input value={formData.country} placeholder="Country" readOnly />
        <input value={formData.streetName} placeholder="Street Name" readOnly />
        <input value={formData.pinCode} placeholder="Pin Code" readOnly />
      </div>
    </div>
  );
};

export default LocationSearchForm;
