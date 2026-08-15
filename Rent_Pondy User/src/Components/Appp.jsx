import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import TopNavigation from './TopNavigation';  // Import Top Navigation
import BottomNav from './BottomNav';  // Import Bottom Navigation
import Details from './Details';
import Addproperties from './Addproperties';
import PropertyCards from './PropertyCards';
import MyProperty from './MyProperty';
import Building from './Building';


// Example content for different sections (AppBar content)
function SellProperty() {
  return <Box  sx={{
    height: 'calc(100vh - 212px)', // Adjust height relative to your layout
    overflowY: 'auto',
    scrollbarWidth: 'none', // For Firefox
    '&::-webkit-scrollbar': {
      display: 'none', // For Chrome, Safari, and Edge
    },}}><div><PropertyCards /></div></Box>;
}

function RentProperty() {
  return <Box  sx={{
    height: 'calc(100vh - 150px)', // Adjust height relative to your layout
    overflowY: 'auto',
    scrollbarWidth: 'none', // For Firefox
    '&::-webkit-scrollbar': {
      display: 'none', // For Chrome, Safari, and Edge
    },}}><div><Details /></div></Box>;
}

function UsedCars() {
  return <Box p={2}><div><Building />demo</div></Box>;
}

function PMGroom() {
  return <Box p={2}><div><Building />demo</div></Box>;
}

function PMBride() {
  return <Box p={2}><div><Building />demo</div></Box>;
}




// Example content for Bottom Navigation (BottomNav content)
function Home() {
  return <Box p={2}><div><Building />demo</div></Box>;
}

function Property() {
  return <Box p={2}><div><MyProperty /></div></Box>;
}

function AddProperty() {
  return <Box  sx={{
    height: 'calc(100vh - 212px)', // Adjust height relative to your layout
    overflowY: 'auto',
    scrollbarWidth: 'none', // For Firefox
    '&::-webkit-scrollbar': {
      display: 'none', // For Chrome, Safari, and Edge
    },}}><div><Addproperties /></div></Box>;
}

function Buyer() {
  return <Box p={2}><div><Building />demo</div></Box>;
}
function More() {
    return <Box p={2}><div><Building />demo</div></Box>;
  }
export default function App() {
  const [topNavValue, setTopNavValue] = React.useState(0);  // For AppBar state
  const [bottomNavValue, setBottomNavValue] = React.useState(0);  // For Bottom Navigation state
  const [isTopNavActive, setIsTopNavActive] = React.useState(true);  // To track which navigation is active

  // Function to render AppBar content
  const renderTopNavContent = () => {
    switch (topNavValue) {
      case 0:
        return <SellProperty />;
      case 1:
        return <RentProperty />;
      case 2:
        return <UsedCars />;
      case 3:
        return <PMGroom />;
      case 4:
        return <PMBride />;
      default:
        return null;
    }
  };

  // Function to render BottomNav content
  const renderBottomNavContent = () => {
    switch (bottomNavValue) {
      case 0:
        return <Home />;
        case 1:
          return <Property />;
        case 2:
          return <AddProperty  />;
        case 3:
          return <Buyer  />;
        case 4:
          return <More  />;
      default:
        return null;
    }
  };

  // Handle AppBar tab change
  const handleTopNavChange = (event, newValue) => {
    setTopNavValue(newValue);
    setIsTopNavActive(true);  // Switch to AppBar content
  };

  // Handle BottomNavigation tab change
  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    setIsTopNavActive(false);  // Switch to BottomNavigation content
  };

  return (
    <Box sx={{ pb: 7,    display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
     }}>
      <CssBaseline />
      {/* AppBar (Top Navigation) */}
      <TopNavigation value={topNavValue} onChange={handleTopNavChange} />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>

      {/* Body content - either AppBar or BottomNavigation content */}
      {isTopNavActive ? renderTopNavContent() : renderBottomNavContent()}
      </Box>

      {/* Bottom Navigation */}
      <Paper sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNav value={bottomNavValue} onChange={handleBottomNavChange} />
      </Paper>
    </Box>
  );
}
