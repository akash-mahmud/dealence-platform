import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useTranslation } from 'react-i18next';

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright";
import { useAuth } from "../hooks/use-auth";
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import logo from '../logo.png';
import { Checkbox, IconButton, InputAdornment, OutlinedInput } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LanguageSelect from '../components/LanguageSelect' 
import StartPageSlide from "../components/StartPageSlide";
const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '70px',
  },
  dataGrid: {
    height: '100%',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    // Fix IE 11 issue.
    width: '63%',
    marginTop: theme.spacing(1),
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    flexDirection: 'column',
    display: 'flex',
  },
  loginContainer: {
    marginBottom: 64,
  },
  forgetpass: {
    width: ' 60%',
  },
  [theme.breakpoints.between('xs', 'sm')]: {
    paper: {
      // marginTop: theme.spacing(8),
      marginTop: '-24px',
    },
    dataGrid: {
      height: '100%',
    },
  },
  sld: {
    display: 'unset',
  },
  mfd: {
    marginBottom: '20px',
  },
  [theme.breakpoints.down('md')]: {
    mfd: {
      marginBottom: '50px',
    },
    forgetpass: {
      width: ' 56%',
    },
    paper: {
      // marginTop: theme.spacing(8),
      marginTop: '-24px',
    },
    dataGrid: {
      height: '100%',
    },
    // sld: {
    //   display: 'none',
    // },
  },
  [theme.breakpoints.down('sm')]: {
  
    sld: {
      display: 'none',
    },
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const { t } = useTranslation();
  const auth = useAuth();

  const history = useHistory();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let { from } = location.state || { from: { pathname: "/" } };

useEffect(() => {
  // auth.user?
  if (auth.user) {
    <Redirect to="/" />;
    history.push('/');
  }
}, [auth.user, history]);


     const [values, setValues] = React.useState({
       showPassword: false,
     });

     //  const handleChange = (prop) => (event) => {
     //    setValues({ ...values, [prop]: event.target.value });
     //  };

     const handleClickShowPassword = () => {
       setValues({ ...values, showPassword: !values.showPassword });
     };

     const handleMouseDownPassword = (event) => {
       event.preventDefault();
     };
   

  useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        console.log('Enter key was pressed. Run your function.');
        event.preventDefault();
        auth.signin(username, password, () => history.replace(from));
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [auth, history, username, password, from]);

  return (
    <main className={classes.content}>
      <Container
        maxWidth="lg"
        style={{
          marginTop: '134px',
        }}
        className={classes.loginContainer}
      >
        <Paper className="responsive">
          <Grid className={classes.dataGrid} container>
            <Grid item xs={12} md={6} lg={6}>
              <div
                className="logp"
                style={{
                  display: 'inline-block',

                  marginLeft: '77%',
                  marginTop: '17px',

                  boxShadow: '0px 0px 13px 0px rgb(82 63 105 / 15%)',
                  padding: ' 7px 7px',
                  borderRadius: '7px',
                  cursor: 'pointer',
                }}
              >
                <LanguageSelect />
              </div>
              <div className={classes.appBarSpacer} />

              <CssBaseline />
              <div className={classes.paper}>
                {/* <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar> */}
                <div
                  style={{
                    marginBottom: '20px',
                    width: '65%',
                  }}
                >
                  <img src={logo} width="153px" />
                </div>
                <Typography
                  style={{
                    width: '63%',
                    color: '#556B7F',
                    fontSize: '1.9rem',
                    fontWeight: '500',
                  }}
                  component="h1"
                  variant="h5"
                >
                  {t('Login')}
                </Typography>
                <Typography
                  style={{
                    width: '63%',
                    marginTop: '7px',
                    color: '#a7a3a3',
                    marginBottom: '15px',
                  }}
                  component="p"
                >
                  {t('Welcome_back')}
                </Typography>
                <form
                  className={`${classes.form} login_input`}
                  autoComplete="off"
                  noValidate
                >
                  <label> {t('Email_Address')}</label>
                  <TextField
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px',
                    }}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label=""
                    name="email"
                    autoComplete="off"
                    ariaAutocomplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label>{t('Password')}</label>

                  <OutlinedInput
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px',
                      width: '100%',
                    }}
                    required
                    // autoComplete="new-password"
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <div
                    className="remebermeBtnData"
                    style={{
                      display: 'inline-block',
                    }}
                  >
                    <Checkbox
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />{' '}
                    {t('Remember_me')}
                  </div>
                  <Link href="/forgot_password">
                    <p
                      className={`${classes.forgetpass} forget`}
                      style={{
                        textAlign: 'right',
                        color: '#0041C1',
                        // marginBottom: '10px',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                    >
                      {t('Forget_Password')}
                    </p>
                  </Link>

                  <Button
                    style={{
                      marginTop: '10px',
                    }}
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      auth.signin(username, password, () =>
                        history.replace(from)
                      )
                    }
                
                  >
                    {t('Login')}
                  </Button>
                  <Grid container>
                    <Grid
                      className={classes.mfd}
                      style={{
                        marginTop: '20px',
                      }}
                      item
                    >
                      <Link href="/register" variant="body2">
                        {t('Don_have_an_account')}
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Grid>
            <Grid
              className={classes.sld}
              style={{
                backgroundColor: '#f4f6fa',
                // position: 'relative',
                // height: '100%',
              }}
              item
              xs={12}
              md={6}
              lg={6}
            >
              <StartPageSlide />
              {/* <div
                style={{
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  src="./image/side/background.png"
                  alt=""
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '0',
                }}
              >
                <StartPageSlide />
              </div> */}
            </Grid>
          </Grid>
          {/* <Button
            variant="contained"
            color="primary"
          >
           {t('update')} 
            style={{ 'margin-top': '25px' }}
          </Button> */}
        </Paper>
      </Container>
      <Copyright />
    </main>
  );
}
