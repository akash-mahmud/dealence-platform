import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Copyright from '../components/Copyright';
import { Button, makeStyles, Typography } from '@material-ui/core';
import Investment from '../components/Investment';
import clsx from 'clsx';
import Title from '../components/Title';
import Pie from '../components/Pie';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/use-auth';
const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  investmentsTable: {
    height: 320,
    [theme.breakpoints.down('sm')]: {
      height: 448,
    },
  },
  fixedHeight: {
    height: 240,
  },
  secondStepper: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  dashboardContainerCard: {
    padding: theme.spacing(4),
    backgroundColor: 'rgba(253, 253, 253)',
  },
}));

const Investments = () => {
  const classes = useStyles();
  const auth = useAuth()
  const { t } = useTranslation();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [date, setdate] = useState()

  function formattedDate(d = new Date()) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const previous_date = localStorage.getItem('date');
    if (!previous_date) {
      //  const date = formattedDate(new Date(auth.user.createdAt));
      const date = new Date(auth.user.createdAt);
      const newDate =    formattedDate(date);
      // console.log(newDate);
      localStorage.setItem('date', JSON.stringify(newDate));
          const previous_date = localStorage.getItem('date');
             setdate(JSON.parse(previous_date));
    }else{
      setdate(JSON.parse(previous_date));
    }
  }, [auth.user.createdAt]);
  
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.dashboardContainerCard}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Title>{t('Real_estate')}</Title>
                <Typography component="p" variant="h4">
                  &euro; 1.025.000
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.balanceContext}
                >
                  {t('updated')} {date}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Title>{t('Catering_Sector')}</Title>
                <Typography component="p" variant="h4">
                  &euro; 120.000
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.depositContext}
                >
                  {t('updated')} {date}
                </Typography>
              </Paper>
            </Grid>
            <Grid className="mygridtpy" item xs={12} md={8} lg={4}>
              <Paper
                className={`${fixedHeightPaper} pychartGrid`}
                style={{
                  minHeight: '210%',
                }}
              >
                <Pie />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Title>{t('Low_Risk')}</Title>
                <Typography component="p" variant="h4">
                  &euro; 571.496
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.balanceContext}
                >
                  {t('updated')} {date}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
              <Paper className={fixedHeightPaper}>
                <Title>{t('High_Risk')}</Title>
                <Typography component="p" variant="h4">
                  &euro; 11.000
                </Typography>
                <Typography
                  color="textSecondary"
                  className={classes.balanceContext}
                >
                  {t('updated')} {date}
                </Typography>
              </Paper>
            </Grid>
            <Grid className="mobileChart" item xs={12} md={8} lg={8}>
              <Paper className={`${fixedHeightPaper} `}>
                <Pie />
              </Paper>
            </Grid>
          </Grid>
          <Button
          onClick={()=> {
                const newDate = formattedDate(new Date());
                // console.log(newDate);
                localStorage.setItem('date', JSON.stringify(newDate));
                    const date = localStorage.getItem('date');
                      setdate(JSON.parse(date));

          }}
            variant="contained"
            color="primary"
            style={{ 'margin-top': '25px' }}
          >
            {t('update')}
          </Button>
        </Paper>
      </Container>
      <Copyright />
    </main>
  );
};

export default Investments;
