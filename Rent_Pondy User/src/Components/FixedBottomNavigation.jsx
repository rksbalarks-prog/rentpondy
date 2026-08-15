import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddHomeIcon from '@mui/icons-material/AddHome';
// Example RentCard component
function RentCard({ title }) {
  return (
    <Box p={2} sx={{ border: '1px solid gray', borderRadius: 2, mb: 2 }}>
      {title}
    </Box>
  );
}

// Sections
function Home() {
  return (
    <Box p={2}>
      <RentCard title="Home Item 1" />
      <RentCard title="Home Item 2" />
    </Box>
  );
}

function Property() {
  return (
    <Box p={2}>
      <RentCard title="Property Item 1" />
      <RentCard title="Property Item 2" />
    </Box>
  );
}

function HomeProperty() {
  return (
    <Box p={2}>
      <RentCard title="Recent Item 1" />
      <RentCard title="Recent Item 2" />
    </Box>
  );
}

function Buyer() {
  return (
    <Box p={2}>
      <RentCard title="Favorite Item 1" />
      <RentCard title="Favorite Item 2" />
    </Box>
  );
}

function More() {
  return (
    <Box p={2}>
      <RentCard title="Archived Item 1" />
      <RentCard title="Archived Item 2" />
    </Box>
  );
}

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);

  const renderContent = () => {
    switch (value) {
      case 0:
        return <Home />;
      case 1:
        return <Property />;
      case 2:
        return <HomeProperty  />;
      case 3:
        return <Buyer  />;
      case 4:
        return <More  />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {renderContent()}
      <Paper sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Property" icon={<BusinessIcon />} />
          <BottomNavigationAction label="HomeProperty" icon={<AddHomeIcon />} />
          <BottomNavigationAction label="Buyer" icon={<PersonIcon />} />
          <BottomNavigationAction label="More" icon={<MoreHorizIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
