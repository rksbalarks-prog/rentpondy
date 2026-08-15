import React from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { MdOutlineAddHomeWork } from 'react-icons/md';
import { RxHome } from "react-icons/rx";
import { BiBuildingHouse } from 'react-icons/bi';
import { RiAccountCircleLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import AnimatedHomeLogo from './AnimatedHomeLogo';
import Main from './Main';

const BottomNavigation = ({ activeItem, setActive }) => {
  const navigate = useNavigate();

  const allNavItems = [
    { name: 'bottomHome', label: 'Home', icon: <RxHome />, },
    { name: 'bottomProperty', label: 'Properties', icon: <BiBuildingHouse />, path: '/my-property' },
    { name: 'add', label: '', icon: <MdOutlineAddHomeWork />, path: '/add-property' },
    { name: 'bottomBuyer', label: 'Assistant', icon: <RiAccountCircleLine />, path: '/buyer-assistance' },
    { name: 'bottomMore', label: 'More', icon: <FaEllipsisH />, path: '/more' },
  ];

  const backgroundStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'auto',
    width: '100%',
    height: '100%',
  };

  const itemStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: isActive ? '#4F4B7E' : '#888',
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: '12px',
    cursor: 'pointer',
    flex: 1,
  });

  const iconStyle = {
    fontSize: '22px',
    marginBottom: '4px',
  };

  const floatingButtonStyle = {
    position: 'absolute',
    bottom: "10px",
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70px',
    height: '70px',
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: '28px',
    zIndex: 20,
    pointerEvents: 'auto',
    cursor: 'pointer',
    border: '4px solid white',
  };

  const handleClick = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return (
    <div style={backgroundStyle}>
      <style>{`
        /* Inner-only FAB animation: creates illusion of up/down motion
           without moving the outer container. Uses transform on inner element only.
           5s cycle: motion occurs early, then rests.
        */
        .fab-inner { will-change: transform, box-shadow; display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 100%; pointer-events: none; }

        @keyframes fabInnerPulse {
          0% {
            transform: translateY(0);
            box-shadow: none;
          }
          8% {
            transform: translateY(-20px);
            box-shadow: 0 10px 28px rgba(79,75,126,0.12);
          }
          20% {
            transform: translateY(-20px);
            box-shadow: 0 14px 36px rgba(79,75,126,0.16);
          }
          36% {
            transform: translateY(0);
            box-shadow: none;
          }
          100% {
            transform: translateY(0);
            box-shadow: none;
          }
        }

        /* Apply only to inner element; outer container remains static. */
        .fab-inner.animate { animation: fabInnerPulse 5s ease-in-out infinite; }
      `}</style>
      {allNavItems.map((item) => {
        const isAddButton = item.name === 'add';
          const isHome = item.name === 'bottomHome';

        return (
          <div
            key={item.name}
                style={{
        ...itemStyle(activeItem === item.name),
        ...(isAddButton && {
          marginTop: '-30px',
          zIndex: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }),
        ...(isHome && {
          color: '#4F4B7E',          // fixed color for Home
          pointerEvents: 'none',    // disable click
          cursor: 'default',        // prevent hand cursor
        }),
      }}
      onClick={!isHome ? () => handleClick(item) : undefined}
          >
            {isAddButton ? (
              <div style={floatingButtonStyle} onClick={() => handleClick(item)}>
                <AnimatedHomeLogo />
              </div>
            ) : (
              <div style={iconStyle}>
                {item.icon}
              </div>
            )}
            {!isAddButton && <div>{item.label}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavigation;












// import React from 'react';
// import navBg from '../Assets/bottomimg.png'
// import { FaBuilding, FaEllipsisH, FaHome, FaUser } from 'react-icons/fa';
// import { MdOutlineAddHomeWork } from 'react-icons/md';
// import { RxHome } from "react-icons/rx";
// import { BiBuildingHouse } from 'react-icons/bi';
// import { RiAccountCircleLine } from 'react-icons/ri';

// const BottomNavigation = ({ activeItem, setActive }) => {
//   const bottomNavItems = [
//     { name: 'bottomHome', label: 'Home', icon: <RxHome /> },
//     { name: 'bottomProperty', label: 'Properties', icon: <BiBuildingHouse  /> },
//     { name: 'bottomBuyer', label: 'Assistant', icon:<RiAccountCircleLine /> },
//     { name: 'bottomMore', label: 'More', icon: <FaEllipsisH /> },
//   ];

//   const navbarContainerStyle = {
// width: "100%",
//   };

// const backgroundStyle = { 
//   // backgroundImage: `url(${navBg})`,
//   backgroundRepeat: 'no-repeat',
//   backgroundPosition: 'center',
//   backgroundSize: 'cover',
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   pointerEvents: 'auto',
//   width: '100%',
//   height: '100%',
// };


//   const itemStyle = (isActive) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     color: isActive ? '#4F4B7E' : '#888',
//     fontWeight: isActive ? 'bold' : 'normal',
//     fontSize: '12px',
//     cursor: 'pointer',
//     flex: 1,
//   });

//   const iconStyle = {
//     fontSize: '22px',
//     marginBottom: '4px',
//   };

//   const floatingButtonStyle = {
//     position: 'absolute',
//     // top: '-25px',
//     bottom:"10px",
//     left: '50%',
//     transform: 'translateX(-50%)',
//     width: '70px',
//     height: '70px',
//     backgroundColor: '#4F4B7E',
//     borderRadius: '50%',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#fff',
//     fontSize: '28px',
//     zIndex: 20,
//     pointerEvents: 'auto',
//     cursor: 'pointer',
//     border: '4px solid white',
//   };

//   return (
//    <div style={backgroundStyle}>
//   {[...bottomNavItems.slice(0, 2), { name: 'add', label: '', icon: <MdOutlineAddHomeWork /> }, ...bottomNavItems.slice(2)].map((item, index) => {
//     const isAddButton = item.name === 'add';
//     return (
//       <div
//         key={item.name}
//         style={{
//           ...itemStyle(activeItem === item.name),
//           ...(isAddButton && {
//             marginTop: '-30px',
//             zIndex: 20,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }),
//         }}
//         onClick={() => !isAddButton ? setActive(item.name) : setActive('bottomAdd')}
//       >
//         <div style={isAddButton ? floatingButtonStyle : iconStyle}>{item.icon}</div>
//         {!isAddButton && <div>{item.label}</div>}
//       </div>
//     );
//   })}
// </div>

//   );
// };

// export default BottomNavigation;
