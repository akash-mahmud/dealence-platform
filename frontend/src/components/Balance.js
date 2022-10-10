import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_DATA}/account/balance`,
        {
          withCredentials: true,
        }
      );

      props.setcredit(res.data.credit);
    };
    getData();
  }, []);

  return (
    <>
      <Title>{t('Available_Credit')}</Title>
      <Typography component="p" variant="h4">
        &euro;{props.credit}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {t('data_on')} {new Date(Date.now()).toDateString()}
      </Typography>
    </>
  );
}
