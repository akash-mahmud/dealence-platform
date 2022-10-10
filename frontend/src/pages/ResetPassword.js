import React, { useState, useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
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
import { useAuth } from "../hooks/use-auth";
import StartPageSlide from '../components/StartPageSlide';
import LanguageSelect from '../components/LanguageSelect';
import { Paper } from "@material-ui/core";
import logo from '../logo.png';
import { useTranslation } from 'react-i18next';
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
    marginTop: '16px',
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
    height: '100%',
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
    submit: {
marginBottom:'63px'
    },
  },
  [theme.breakpoints.down('sm')]: {
    sld: {
      display: 'none',
    },
  },
}));

export default function ResetPassword(props) {
    const {t} = useTranslation()
    const classes = useStyles();

    const search = useLocation().search;
    const token = new URLSearchParams(search).get("token");

    const [updated, setUpdated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
      const auth = useAuth();
      const history = useHistory();
useEffect(() => {
  // auth.user?
  if (auth.user) {
    <Redirect to="/" />;
    history.push('/');
  }
}, [auth.user, history]);
    useEffect(() => {
        const checkToken = async () => {

            
            const res = await axios.get(`${process.env.REACT_APP_API_DATA}/user/reset`, {
              params: {
                resetPasswordToken: token,
              },
            });

            if (res.data.message === "password reset link ok") {
                setIsLoading(false);
                setEmail(res.data.email);
            }

        };
        checkToken();
    }, [])

    const updatePassword = async () => {
        const res = await axios.put(
          `${process.env.REACT_APP_API_DATA}/user/updatePasswordViaEmail`,
          {
            email: email,
            password: password,
            resetPasswordToken: token,
          }
        );

        if (res.data.message === 'password updated') {
            setUpdated(true);
            NotificationManager.success(t('Password_correctly_updated'));
        } else {
            setUpdated(false);
            NotificationManager.error(t('Problem_resetting'));
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
                  {!isLoading && !updated && (
                    <>
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
                        {t('Reset_your_password')}
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
                        {t('Enter_different_password')}
                      </Typography>
                    </>
                  )}
                  {isLoading && (
                    <>
                      {/* <div
                        style={{
                          marginTop: '18px',
                        }}
                        className="loader"
                      ></div> */}
                    </>
                  )}

                  {!isLoading && !updated && (
                    <>
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
                          {t('Password')}
                        </label>
                        <TextField
                          style={{
                            marginTop: '8px',
                            marginBottom: '8px',
                            width: '100%',
                          }}
                          variant="outlined"
                          required
                          //   fullWidth

                          autoComplete="off"
                          ariaAutocomplete="off"
                          id="password"
                          type="password"
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                          style={{
                            marginTop: '10px',
                          }}
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={updatePassword}
                        >
                          {t('Reset_password')}
                        </Button>
                      </form>
                    </>
                  )}
                  {!isLoading && updated && (
                    <div
                      style={{
                        width: '62%',
                      }}
                    >
                      <Typography component="h1" variant="h5">
                        {t('Back_to')} <Link href="/login">Login</Link>
                      </Typography>
                    </div>
                  )}
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
