import React, { useState, useEffect } from 'react';
import Axios from "axios";
import PasswordStrengthBar from 'react-password-strength-bar';

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Grid from "@material-ui/core/Grid";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory, Redirect } from 'react-router-dom';
import { useAuth } from "../hooks/use-auth";
import Copyright from "../components/Copyright";
import { useLocation } from "react-router-dom";
import { OutlinedInput, Paper } from "@material-ui/core";
import logo from '../logo.png';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LanguageSelect from '../components/LanguageSelect'; 
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import StartPageSlide from "../components/StartPageSlide";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dataGrid: {
    height: '100%',
  },
  appBarSpacer: theme.mixins.toolbar,
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '63%', // Fix IE 11 issue.
    marginTop: '10px',
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

      paddingBottom: '27px',
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

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function SignUp() {
  const classes = useStyles();
  const query = useQuery();
  const { t } = useTranslation();
  const history = useHistory();
  const auth = useAuth();
   
useEffect(() => {
  // auth.user?
  if (auth.user) {
    <Redirect to="/" />;
    history.push('/');
  }
}, [auth.user, history]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [accept, setaccept] = useState(false)
  const register = () => {
    Axios({
      method: 'post',
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        referrer_code: query.get('referral'),
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_API_DATA}/user/register`,
    }).then((res) => {
      if (res.data === 'success') {
        auth.signin(email, password, () => history.replace('/'));
      }
    });
  };

  //removeable



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
           //  auth.signin(username, password, () => history.replace(from));
           register();
         }
       };
       document.addEventListener('keydown', listener);
       return () => {
         document.removeEventListener('keydown', listener);
       };
     }, [register]);
  return (
    <main className={classes.content}>
      <Container
        style={{
          marginTop: '134px',
        }}
        component="main"
        maxWidth="lg"
        className={classes.loginContainer}
      >
        <Paper>
          <Grid
            className={classes.dataGrid}
            // style={{
            //   height: '80vh',
            // }}
            container
          >
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
                <div
                  style={{
                    marginBottom: '20px',
                    width: '63%',
                  }}
                >
                  <img src={logo} width="153px" />
                </div>
                <Typography
                  style={{
                    width: '63%',
                    fontSize: '1.9rem',
                    fontWeight: '500',
                    color: '#556B7F',
                  }}
                  component="h1"
                  variant="h5"
                >
                  {t('Get_started')}
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
                  {t('Let_get_started_with_your_journey')}
                </Typography>
                <form className={`${classes.form} login_input`} noValidate>
                  <div>
                    <div>
                      <label className="npd"> {t('First_Name')}</label>
                      <label
                        className="np"
                        style={{
                          marginLeft: '32%',
                        }}
                      >
                        {t('Last_NameSighn')}
                      </label>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'inline-block',
                          width: '48%',
                          marginRight: '5px',
                        }}
                      >
                        <label className="npdp"> {t('First_Name')}</label>
                        <TextField
                          style={{
                            marginTop: '8px',
                            marginBottom: '8px',
                          }}
                          className="myfrn"
                          autoComplete="fname"
                          name="firstName"
                          variant="outlined"
                          required
                          id="firstName"
                          label=""
                          autoFocus
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div
                        className="mydbn"
                        style={{
                          display: 'inline-block',
                          width: '48%',
                        }}
                      >
                        <label className="npdp">{t('Last_NameSighn')}</label>
                        <TextField
                          style={{
                            marginTop: '8px',
                            marginBottom: '8px',
                          }}
                          className="myfrn"
                          variant="outlined"
                          required
                          id="lastName"
                          label=""
                          name="lastName"
                          autoComplete="lname"
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    style={{
                      display: 'block',
                    }}
                  >
                    {t('Password')}
                  </label>

                  <OutlinedInput
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px',
                      width: '100%',
                    }}
                    required
                    autoComplete="new-password"
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
                  <PasswordStrengthBar
                    shortScoreWord={''}
                    scoreWords={['']}
                    password={password}
                  />
                  <div>
                    <Checkbox
                      color="primary"
                      checked={accept}
                      onChange={(e) => setaccept(e.target.checked)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />{' '}
                    {t('I_agree_to_the')}{' '}
                    {/* <span className="mytrm">
                      <Link
                        href="https://www.dealence.com/termini-e-condizioni/"
                        target="_blank"
                      >
                        {t('tr')}
                      </Link>{' '}
                    </span>{' '}
                    {t('and')}{' '} */}
                    <span className="mytrm">
                      <Link
                        href="https://www.dealence.com/privacy-policy"
                        target="_blank"
                      >
                        {t('pr')}
                      </Link>
                    </span>
                  </div>
                  <div>
                    <Checkbox
                      color="primary"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />{' '}
                    {t('Remember_me')}
                  </div>
                  <Button
                  
                    style={{
                      marginTop: '5',
                    }}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={register}
                    disabled={accept === false ? true : false}
                  >
                    Sign{' '}
                    <span
                      style={{
                        textTransform: 'lowercase',
                        paddingLeft: '2px',
                      }}
                    >
                      {' '}
                      up
                    </span>
                  </Button>
                  <div className={classes.mfd}>
                    <Link
                      href="/login"
                      variant="body2"
                      style={{
                        marginRight: '66px',
                      }}
                    >
                      {t('Already_have_an_account')}
                    </Link>
                  </div>
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
        </Paper>

        {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
      </Container>
      <Copyright />
    </main>
  );
}
