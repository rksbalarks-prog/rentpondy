

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import './BottomNav.css';
import rentPropertyImg from '../Assets/Rent Property-01.png';

const RentPropertyIcon = () => (
  <Box
    component="img"
    src={rentPropertyImg}
    alt="Add Property"
    sx={{
      width: '24px',
      height: '24px',
      display: 'block',
      objectFit: 'contain'
    }}
  />
);

function BottomNav({ value, onChange }) {
  return (
    <>      
      <BottomNavigation value={value} onChange={onChange} className="nav">
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="MyProperty" icon={<BusinessIcon />} />
        <BottomNavigationAction label="AddProperty" icon={<RentPropertyIcon />} />
        <BottomNavigationAction label="BuyerList" icon={<PersonIcon />} />
        <BottomNavigationAction label="More" icon={<MoreHorizIcon />} />
        {/* <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="filter-svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>   */}
      </BottomNavigation>
    </>
  );
}

export default BottomNav;
