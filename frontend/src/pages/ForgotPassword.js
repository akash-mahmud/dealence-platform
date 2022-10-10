import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";


import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import Copyright from "../components/Copyright";
import { Paper } from "@material-ui/core";
import LanguageSelect from "../components/LanguageSelect";
import { useTranslation } from 'react-i18next';
import logo from '../logo.png';
import StartPageSlide from "../components/StartPageSlide";
import { useAuth } from "../hooks/use-auth";
import { useHistory, Redirect } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 96,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appBarSpacer: theme.mixins.toolbar,
  form: {
    width: '63%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  content: {
    flexGrow: 1,
    height: '100%',
    overflow: 'auto',
    flexDirection: 'column',
    display: 'flex',
  },
  loginContainer: {
    marginBottom: 64,
  },
  dataGrid: {
    height: '100',
  },
  sld: {
    display: 'unset',
  },
  mfd: {
    marginBottom: '20px',
  },
  [theme.breakpoints.down('md')]: {
    paper: {
      // marginTop: theme.spacing(8),
      marginTop: '-24px',

      paddingBottom: '27px',
    },
    dataGrid: {
      height: '100%',
    },
    sld: {
      display: 'none',
    },
    // mfd: {
    //   marginBottom: '50px',
    // },
  },
  [theme.breakpoints.down('xs')]: {

    mfd: {
      marginBottom: '63px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    sld: {
      display: 'none',
    },
  },
}));

export default function ForgotPassword() {
    const {t} = useTranslation()
    const classes = useStyles();
  const auth = useAuth();
    const history = useHistory();
useEffect(() => {
  // auth.user?
  if (auth.user) {
    <Redirect to="/" />;
    history.push('/');
  }
}, [auth.user, history]);
    const [email, setEmail] = useState("");

    const sendEmail = async () => {
        if (email === "") {
            NotificationManager.error('Enter a valid email', 'Error');
        } else {
            const res = await axios.post(
              `${process.env.REACT_APP_API_DATA}/user/forgot`,
              {
                email: email,
              }
            );
            if (res.data === "email does not exist") {
                NotificationManager.error('Email does not exist', 'Error');
            } else if (res.status === 200) {
              NotificationManager.success(
                t('Check_your_email_to_reset_your_password'),
                t('Email_sent_successfully')
              );
            }
        }
    }

    return (
      <main className={classes.content}>
        <Container
          maxWidth="lg"
          style={{
            marginTop: '134px',
          }}
          className={classes.loginContainer}
        >
          <Paper>
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
                      fontSize: '1.9rem',
                      fontWeight: '500',
                      color: '#556B7F',
                    }}
                    component="h1"
                    variant="h5"
                  >
                    {t('Forgot_Password')}
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
                    {t('password_link')}
                  </Typography>
                  <form
                    className={`${classes.form} login_input`}
                    autoComplete="off"
                    noValidate
                  >
                    <label
                      style={{
                        display: 'block',
                      }}
                    >
                      {' '}
                      {t('Email_Address')}
                    </label>
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

                    {/* <Link href="/">
                      <p
                        className="forget"
                        style={{
                          textAlign: 'right',
                          color: '#0041C1',
                          // marginBottom: '10px',
                          cursor: 'pointer',
                          display: 'inline-block',
                        //   width: ' 60%',
                        }}
                      >
                        {t('Forget_Password')}
                      </p>
                    </Link> */}

                    <Button
                      style={{
                        marginTop: '10px',
                      }}
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={sendEmail}
                    >
                      {t('Send_reset')}
                    </Button>
                    <Grid container>
                      <Grid
                        className={classes.mfd}
                        style={{
                          marginTop: '20px',

                          // marginBottom: '20px',
                        }}
                        item
                      >
                        <Link href="/login" variant="body2">
                          {t('Back_to_login')}
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
          </Paper>
        </Container>

        <Copyright />
      </main>
    );
}
