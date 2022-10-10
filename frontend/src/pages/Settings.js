import { Container, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Title from "../components/Title";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { NotificationManager } from 'react-notifications';
import Copyright from "../components/Copyright";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/use-auth';
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },
    container: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
        marginBottom: theme.spacing(4)
    },
    paper: {
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
        height: 768
    },
    settingsTab: {
        padding: theme.spacing(2)
    },
    settingsTabSection: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    },
    settingsSubsectionHeader: {
        marginBottom: 8
    },
    settingsSubsectionSeparator: {
        opacity: 0.3
    },
    tabsIndicator: {
        backgroundColor: theme.palette.primary.main
    }
}));

export default function Account() {
   const { t } = useTranslation();
    const classes = useStyles();
  const auth = useAuth();
    const [value, setValue] = React.useState(0);

    const [passwordInfo, setPasswordInfo] = React.useState({
        old: "",
        new: ""
    });

    const [contactInformation, setContactInformation] = React.useState({
        email: "",
        phone: ""
    })

    const [personalDetails, setPersonalDetails] = React.useState({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        email: "",
        phone: ""
    });

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
              withCredentials: true,
            });

            setContactInformation({
                email: res.data.email,
                phone: res.data.phone_number
            });

            setPersonalDetails({
                name: `${res.data.first_name} ${res.data.last_name}`,
                address: res.data.address,
                city: res.data.city,
                state: res.data.state,
                zip: res.data.zip,
                country: res.data.country,
                email: res.data.email,
                phone: res.data.phone_number
            });
        };

        getUser();
    }, [])

    const updatePassword = () => {
        const updatePasswordInner = async () => {
            const payload = {
                oldPassword: passwordInfo.old,
                newPassword: passwordInfo.new
            }

            try {
                await axios.put(
                  `${process.env.REACT_APP_API_DATA}/user/updatePassword`,
                  payload,
                  {
                    withCredentials: true,
                  }
                );

                NotificationManager.success(
                    "Password successfully updated",
                    "Success"
                );
            } catch (error) {
           
                NotificationManager.error(
                    "There was an error updating the password. Please check the old password and retry",
                    "Could not update password"
                );
            }
        };

        updatePasswordInner();
    }

    const updateContactInformation = () => {
        const updateContactInformationInner = async () => {
            const payload = {
                email: contactInformation.email,
                phone_number: contactInformation.phone
            }

            try {
                await axios.put(
                  `${process.env.REACT_APP_API_DATA}/user/updateContactInfo`,
                  payload,
                  {
                    withCredentials: true,
                  }
                );

                NotificationManager.success(
                    "Contact information successfully updated",
                    "Success"
                );
            } catch (error) {
               

                NotificationManager.error(
                    "There was an error updating your contact info. Please retry",
                    "Error"
                );
            }
        };

        updateContactInformationInner();
    }

    const updatePersonalDetails = () => {
        // updatePersonalDetails
        const updatePersonalDetailsInner = async () => {
            const payload = {
                address: personalDetails.address,
                city: personalDetails.city,
                state: personalDetails.state,
                zip: personalDetails.zip,
                email: personalDetails.email,
                phone: personalDetails.phone,
            }

            try {
                await axios.put(
                  `${process.env.REACT_APP_API_DATA}/user/updatePersonalDetails`,
                  payload,
                  {
                    withCredentials: true,
                  }
                );

                NotificationManager.success(
                    "Personal details updated",
                    "Success"
                );
            } catch (error) {
              

                NotificationManager.error(
                    "There was an error updating your personal details. Please retry",
                    "Error"
                );
            }
        };

        updatePersonalDetailsInner();
    }

    return (
      <>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper className={classes.paper}>
                  <Tabs
                    value={value}
                    onChange={handleTabChange}
                    aria-label="settings tabs"
                    classes={{
                      indicator: classes.tabsIndicator,
                    }}
                  >
                    <Tab
                      label={t('Personal_Information')}
                      aria-controls="simple-tabpanel-0"
                      id="simple-tab-0"
                      className={classes.settingsTab}
                    />
                    <Tab
                      label={t('Change_Password')}
                      aria-controls="simple-tabpanel-1"
                      id="simple-tab-1"
                      className={classes.settingsTab}
                    />
                  </Tabs>
                  <div hidden={value !== 0}>
                    <div className={classes.settingsTabSection}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.settingsSubsectionHeader}
                      >
                        {t('Personal_Information')}
                      </Typography>
                      <hr className={classes.settingsSubsectionSeparator} />
                      <br />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="legalName"
                            name="legalName"
                            label={t('Legal_Name')}
                            variant="outlined"
                            disabled
                            fullWidth
                            value={personalDetails.name}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={contactInformation.email}
                            fullWidth
                            onChange={(event) => {
                              setContactInformation({
                                ...contactInformation,
                                ...{ email: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            id="phone"
                            name="phone"
                            label={`${t('Phone')} (+XX)`}
                            variant="outlined"
                            fullWidth
                            value={contactInformation.phone}
                            onChange={(event) => {
                              setContactInformation({
                                ...contactInformation,
                                ...{ phone: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="address"
                            name="address"
                            label={t('Address')}
                            variant="outlined"
                            fullWidth
                            value={personalDetails.address}
                            onChange={(event) => {
                              setPersonalDetails({
                                ...personalDetails,
                                ...{ address: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            required
                            id="city"
                            name="city"
                            label={t('City')}
                            variant="outlined"
                            fullWidth
                            value={personalDetails.city}
                            onChange={(event) => {
                              setPersonalDetails({
                                ...personalDetails,
                                ...{ city: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            required
                            id="state"
                            name="state"
                            label={t('State')}
                            variant="outlined"
                            fullWidth
                            value={personalDetails.state}
                            onChange={(event) => {
                              setPersonalDetails({
                                ...personalDetails,
                                ...{ state: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            required
                            id="zip"
                            name="zip"
                            label={t('Zip')}
                            variant="outlined"
                            fullWidth
                            value={personalDetails.zip}
                            onChange={(event) => {
                              setPersonalDetails({
                                ...personalDetails,
                                ...{ zip: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            required
                            id="country"
                            name="country"
                            label={t('Country')}
                            variant="outlined"
                            fullWidth
                            disabled
                            value={personalDetails.country}
                          />
                        </Grid>
                        {!auth.user.isActive ? (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="body2">
                                {t('To_update')}{' '}
                                <a href="http://localhost:3000/verification">
                                  {t('verify')}
                                </a>{' '}
                                {t('send_us')}
                              </Typography>
                            </Grid>
                          </>
                        ) : (
                          ''
                        )}

                        <Grid item xs={12} sm={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={updatePersonalDetails}
                          >
                            {t('Save')}
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                  <div hidden={value !== 1}>
                    <div className={classes.settingsTabSection}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        className={classes.settingsSubsectionHeader}
                      >
                        {t('Change_Password')}
                      </Typography>
                      <hr className={classes.settingsSubsectionSeparator} />
                      <br />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="oldPassword"
                            name="oldPassword"
                            label={t('Old_Password')}
                            variant="outlined"
                            type="password"
                            value={passwordInfo.old}
                            onChange={(event) => {
                              setPasswordInfo({
                                ...passwordInfo,
                                ...{ old: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="newPassword"
                            name="newPassword"
                            label={t('New_Password')}
                            variant="outlined"
                            type="password"
                            value={passwordInfo.new}
                            onChange={(event) => {
                              setPasswordInfo({
                                ...passwordInfo,
                                ...{ new: event.target.value },
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={updatePassword}
                          >
                            {t('Update_Password')}
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
          <Copyright />
        </main>
      </>
    );
}