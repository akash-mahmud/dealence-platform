import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Title from './Title';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';

import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import { Button, Popover, Tab, Tabs } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 1,
  },

  payoutPeriodSelect: {
    width: '100%',
  },
}));

export default function Interest(props) {
   const [anchorEl, setAnchorEl] = React.useState(null);
    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
      setAge(event.target.value);
    };
  const { t } = useTranslation();
  const classes = useStyles();
 const handleClick = (event) => {
   setAnchorEl(event.currentTarget);
 };

 const handleClose = () => {
   setAnchorEl(null);
 };
const open = Boolean(anchorEl);
const id = open ? 'simple-popover' : undefined;
  const [payoutPeriod, setPayoutPeriod] = useState('day');

  const [totalEarn, settotalEarn] = useState()
  const [BioMonthlyEarned, setBioMonthlyEarned] = useState()
  const [semiManualEarned, setsemiManualEarned] = useState()
  const handlePeriodChange = (event, value) => {
    setPayoutPeriod(value.props.value);
  };

  // const withDrawSubmit = async() => {
  //    await axios.post("http://localhost:4000/transaction/withdraw" , {amount,iban}, {withCredentials: true,});
  //    const balanceAdd = async () => {
  //     const res = await axios.get(
  //       "http://localhost:4000/account/balance",
  //       { withCredentials: true }
  //     );

  //     props.setBalance(res.data.balance);

  //     setWithdrawModel(false);
  //   };
  //   balanceAdd();
  // }
          const getEarnedInteres = async () => {
          const res = await axios.get(
            `${process.env.REACT_APP_API_DATA}/account/ie`,

            {
              withCredentials: true,
            }
          );
          settotalEarn(res.data.totalEarn);
          setBioMonthlyEarned(res.data.BioMonthlyEarn);
          setsemiManualEarned(res.data.SemiManualEarn);
          }
  useEffect(() => {
getEarnedInteres();
  }, [])
  
  return (
    <>
      <Title>{t('Interest_Earned')}</Title>

      <Typography component="p" variant="h4">
        &euro;{totalEarn}
        <div
          className="myBi"
          style={{
            padding: ' 0px 10px',
            display: 'inline-block',
          }}
        >
          <FormControl variant="standard">
            <ExpandMoreIcon onClick={handleClick} />

            <Popover
              className="mybySm"
              style={
                {
                  //             left: '53.5%',
                  // top: '44%'
                }
              }
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography
                style={{
                  padding: '13px 15px',
                  paddingBottom: '0',
                }}
              >
                {t('Bimonthly ')}: &euro;{BioMonthlyEarned}
              </Typography>
              <Typography
                style={{
                  padding: '10px 15px',
                  paddingBottom: '14px',
                }}
              >
                {' '}
                {t('Semiannual ')}: &euro;{semiManualEarned}
              </Typography>
            </Popover>
          </FormControl>
        </div>
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {t('data_on')} {new Date(Date.now()).toDateString()}
      </Typography>

      <Title>{t('How_much')}</Title>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h6">
            &euro;{props.payouts[payoutPeriod] || 0}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Select
            IconComponent={ExpandMoreIcon}
            labelId="earning-time-select"
            id="earning-time-select"
            value={payoutPeriod}
            label="Period"
            onChange={handlePeriodChange}
            className={classes.payoutPeriodSelect}
          >
            <MenuItem value={'day'}>{t('Day')}</MenuItem>
            <MenuItem value={'week'}>{t('Week')}</MenuItem>
            <MenuItem value={'month'}>{t('Month')}</MenuItem>
            <MenuItem value={'year'}>{t('Year')}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </>
  );
}
