


import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import {
  // other imports
  Work as OfficeIcon,
} from '@mui/icons-material';

import {
  // BarChart as BarChartIcon,
  // Description as DescriptionIcon,
  Login as LoginIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  // Office as OfficeIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  AccountTree as AccountTreeIcon,
  Payment as PaymentIcon,
  DirectionsCar as DirectionsCarIcon,
  Build as BuildIcon,
  DriveEta as DriveEtaIcon,
  Garage as GarageIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  SupportAgent as SupportAgentIcon,
  Report as ReportIcon,
  ContactPhone as ContactPhoneIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  PeopleAlt as PeopleAltIcon,
  Speed as SpeedIcon,
  Wallpaper as WallpaperIcon,
} from '@mui/icons-material';

// Import your components for Orders and Sales
import Orders from './Orders';
import Sales from './Sales';


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main Items',
  },
  {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
      },
  {
    segment: 'statistics',
    title: 'Statistics',
    icon: <BarChartIcon />,
  },
  {
    segment: 'report',
    title: 'Reports',
    icon: <DescriptionIcon />,
    children: [
      { segment: 'loginReport', title: 'Login Report', icon: <LoginIcon /> },
      { segment: 'adminReport', title: 'Admin Report', icon: <AdminPanelSettingsIcon /> },
    ],
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
    children: [
      { segment: 'adminNotification', title: 'Admin Notification', icon: <NotificationsActiveIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Setup',
  },
  {
    segment: 'officeSetup',
    title: 'Office Setup',
    icon: <OfficeIcon />,
    children: [
      { segment: 'office', title: 'Office', icon: <BusinessIcon /> },
      { segment: 'users', title: 'Users', icon: <GroupIcon /> },
      { segment: 'plan', title: 'Plan', icon: <AccountTreeIcon /> },
      { segment: 'buyerPlan', title: 'Tenant Plan', icon: <ShoppingCartIcon /> },
      { segment: 'paymentType', title: 'Payment Type', icon: <PaymentIcon /> },
    ],
  },
  {
    segment: 'carManagement',
    title: 'Car Management',
    icon: <DirectionsCarIcon />,
    children: [
      { segment: 'carMake', title: 'Car Make', icon: <BuildIcon /> },
      { segment: 'carModel', title: 'Car Model', icon: <DriveEtaIcon /> },
      { segment: 'allCar', title: 'All Cars', icon: <GarageIcon /> },
      { segment: 'approvedCar', title: 'Approved Cars', icon: <CheckCircleIcon /> },
      { segment: 'pendingCar', title: 'Pending Cars', icon: <PendingIcon /> },
    ],
  },
  {
    segment: 'accountManagement',
    title: 'Accounts',
    icon: <AccountBalanceIcon />,
    children: [
      { segment: 'subscriber', title: 'Subscriber', icon: <PersonIcon /> },
      { segment: 'freeBills', title: 'Free Bills', icon: <ReceiptIcon /> },
      { segment: 'paidBills', title: 'Paid Bills', icon: <AttachMoneyIcon /> },
    ],
  },
  {
    segment: 'customerCare',
    title: 'Customer Care',
    icon: <SupportAgentIcon />,
    children: [
      { segment: 'reportedCars', title: 'Reported Cars', icon: <ReportIcon /> },
      { segment: 'callBackForm', title: 'Call Back Form', icon: <ContactPhoneIcon /> },
      { segment: 'help', title: 'Help', icon: <HelpIcon /> },
    ],
  },
  {
    kind: 'header',
    title: 'Settings',
  },
  {
    segment: 'settings',
    title: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { segment: 'userRoles', title: 'User Roles', icon: <PeopleAltIcon /> },
      { segment: 'limits', title: 'Limits', icon: <SpeedIcon /> },
      { segment: 'banners', title: 'Banners', icon: <WallpaperIcon /> },
    ],
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const demoWindow = window ? window() : undefined;


  const renderContent = () => {
    switch (router.pathname) {
      case '/statistics':
        return <Statistics />;
      case '/report/loginReport':
        return <LoginReport />;
      case '/report/adminReport':
        return <AdminReport />;
      case '/notifications/adminNotification':
        return <AdminNotification />;
      case '/officeSetup/office':
        return <Office />;
      case '/officeSetup/users':
        return <Users />;
      case '/officeSetup/plan':
        return <Plan />;
      case '/officeSetup/buyerPlan':
        return <BuyerPlan />;
      case '/officeSetup/paymentType':
        return <PaymentType />;
      case '/carManagement/carMake':
        return <CarMake />;
      case '/carManagement/carModel':
        return <CarModel />;
      case '/carManagement/allCar':
        return <AllCar />;
      case '/carManagement/approvedCar':
        return <ApprovedCar />;
      case '/carManagement/pendingCar':
        return <PendingCar />;
      case '/accountManagement/subscriber':
        return <Subscriber />;
      case '/accountManagement/freeBills':
        return <FreeBills />;
      case '/accountManagement/paidBills':
        return <PaidBills />;
      case '/customerCare/reportedCars':
        return <ReportedCars />;
      case '/customerCare/callBackForm':
        return <CallBackForm />;
      case '/customerCare/help':
        return <Help />;
      case '/settings/userRoles':
        return <UserRoles />;
      case '/settings/limits':
        return <Limits />;
      case '/settings/banners':
        return <Banners />;
      default:
        return (
          <Grid container spacing={1}>
            <Grid size={5} />
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid size={4}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={8}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={150} />
            </Grid>
            <Grid size={12}>
              <Skeleton height={14} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
            <Grid size={3}>
              <Skeleton height={100} />
            </Grid>
          </Grid>
        );
    }
  };
  
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          {renderContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
