import {
  Button,
  Container,
  makeStyles,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import InformationForm from '../components/InformationForm';
import Copyright from '../components/Copyright';
import Title from '../components/Title';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    flexDirection: 'column',
    display: 'flex',
  },
  container: {
    width: 'auto',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  containerCard: {
    padding: theme.spacing(4),
    backgroundColor: 'rgba(253, 253, 253)',
  },
}));

export default function Verification() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [user, setUser] = React.useState();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
        withCredentials: true,
      });

      if (res.data) {
     
        setUser(res.data);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.containerCard}>
            <Title>{t('Insert_your_Information')}</Title>
            <br />
            <InformationForm />
          </Paper>
        </Container>
        <Copyright />
      </main>
    </>
  );
}
