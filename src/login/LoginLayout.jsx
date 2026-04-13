import { Paper, Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      top: '-150px',
      left: '-150px',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      bottom: '-100px',
      right: '-100px',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(5, 5, 4, 5),
    borderRadius: '20px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
    width: '100%',
    maxWidth: '420px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255,255,255,0.97)',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2),
      padding: theme.spacing(4, 3),
    },
  },
  logoWrapper: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    maxWidth: '200px',
    maxHeight: '100px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  form: {
    width: '100%',
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();

  return (
    <main className={classes.root}>
      <Paper className={classes.card} elevation={0}>
        {/* <Box className={classes.logoWrapper}>
          <img src="/tera_logo.png" alt="Tera Logo" className={classes.logo} />
        </Box> */}
        <form className={classes.form}>{children}</form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
