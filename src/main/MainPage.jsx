import { useState, useCallback, useEffect } from 'react';
import { Paper, Box, AppBar, Toolbar, IconButton, Typography, Tooltip, useMediaQuery } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeviceList from './DeviceList';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store';
import usePersistedState from '../common/util/usePersistedState';
import EventsDrawer from './EventsDrawer';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';
import MainMap from './MainMap';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';

const TOPBAR_HEIGHT = 48;
const DEVICE_PANEL_WIDTH = 320;

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  appBar: {
    background: '#fff',
    color: '#2d3436',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    zIndex: theme.zIndex.drawer + 1,
    height: TOPBAR_HEIGHT,
    justifyContent: 'center',
  },
  appBarToolbar: {
    minHeight: TOPBAR_HEIGHT,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  logo: {
    height: 28,
    marginRight: theme.spacing(2),
  },
  pageTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#2d3436',
    flex: 1,
  },
  contentWrap: {
    display: 'flex',
    flex: 1,
    marginTop: TOPBAR_HEIGHT,
    overflow: 'hidden',
  },
  bodyGrid: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  devicePanel: {
    width: DEVICE_PANEL_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRight: '1px solid #e1e5e9',
    zIndex: 2,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 5,
    },
  },
  devicePanelHeader: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #e1e5e9',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  devicePanelTitle: {
    fontWeight: 700,
    fontSize: '1rem',
    color: '#2d3436',
  },
  deviceCount: {
    fontSize: '0.75rem',
    color: '#fff',
    background: theme.palette.primary.main,
    padding: theme.spacing(0.3, 1.2),
    borderRadius: 12,
    fontWeight: 600,
  },
  deviceToolbar: {
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
  },
  deviceList: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    background: '#fff',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingToolbar: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  mobileMapFull: {
    flex: 1,
    display: 'grid',
    minHeight: 0,
    position: 'relative',
  },
  mobileContentMap: {
    gridArea: '1 / 1',
  },
  mobileContentList: {
    gridArea: '1 / 1',
    zIndex: 4,
    display: 'flex',
    minHeight: 0,
    background: '#fff',
  },
}));

const MainPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const mapOnSelect = useAttributePreference('mapOnSelect', true);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);

  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId,
  );

  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', { statuses: [], groups: [] });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);
  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  return (
    <Box className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.appBarToolbar}>
          {/* <img src="/tera_logo.png" alt="Tera" className={classes.logo} /> */}
          <Typography className={classes.pageTitle}>{t('mapTitle')}</Typography>
          <Tooltip title="Events">
            <IconButton size="small" onClick={onEventsClick} sx={{ color: '#555' }}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box className={classes.contentWrap}>
        {desktop ? (
          <Box className={classes.bodyGrid}>
            {devicesOpen && (
              <Box className={classes.devicePanel}>
                <Box className={classes.devicePanelHeader}>
                  <Typography className={classes.devicePanelTitle}>Devices</Typography>
                  <Typography className={classes.deviceCount}>{filteredDevices.length}</Typography>
                </Box>
                <Box className={classes.deviceToolbar}>
                  <MainToolbar filteredDevices={filteredDevices} devicesOpen={devicesOpen} setDevicesOpen={setDevicesOpen} keyword={keyword} setKeyword={setKeyword} filter={filter} setFilter={setFilter} filterSort={filterSort} setFilterSort={setFilterSort} filterMap={filterMap} setFilterMap={setFilterMap} />
                </Box>
                <Box className={classes.deviceList}>
                  <DeviceList devices={filteredDevices} />
                </Box>
              </Box>
            )}
            <Box className={classes.mapArea}>
              {!devicesOpen && (
                <Paper className={classes.floatingToolbar}>
                  <MainToolbar filteredDevices={filteredDevices} devicesOpen={devicesOpen} setDevicesOpen={setDevicesOpen} keyword={keyword} setKeyword={setKeyword} filter={filter} setFilter={setFilter} filterSort={filterSort} setFilterSort={setFilterSort} filterMap={filterMap} setFilterMap={setFilterMap} />
                </Paper>
              )}
              <MainMap filteredPositions={filteredPositions} selectedPosition={selectedPosition} onEventsClick={onEventsClick} />
            </Box>
          </Box>
        ) : (
          <Box className={classes.mobileMapFull}>
            <Box className={classes.mobileContentMap}>
              <MainMap filteredPositions={filteredPositions} selectedPosition={selectedPosition} onEventsClick={onEventsClick} />
            </Box>
            <Paper square className={classes.mobileContentList} style={devicesOpen ? {} : { visibility: 'hidden' }}>
              <Box display="flex" flexDirection="column" width="100%">
                <MainToolbar filteredDevices={filteredDevices} devicesOpen={devicesOpen} setDevicesOpen={setDevicesOpen} keyword={keyword} setKeyword={setKeyword} filter={filter} setFilter={setFilter} filterSort={filterSort} setFilterSort={setFilterSort} filterMap={filterMap} setFilterMap={setFilterMap} />
                <DeviceList devices={filteredDevices} />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (
        <StatusCard deviceId={selectedDeviceId} position={selectedPosition} onClose={() => dispatch(devicesActions.selectId(null))} desktopPadding={DEVICE_PANEL_WIDTH + 'px'} />
      )}
    </Box>
  );
};

export default MainPage;
