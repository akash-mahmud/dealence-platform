import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Title from './Title';
import axios from 'axios';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paginationContainer: {
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
  },
  spacer: {
    flex: 1,
  },
}));

export default function Transactions(props) {
  
  const classes = useStyles();
  const { t } = useTranslation();

  const test = async  () =>{
  if (props.increments?.length === undefined) {

  }
  }
useEffect(() => {
test();
}, [])

  return (
    <React.Fragment>
      <Title>{t('Your_Investments')}</Title>

      {props.increments?.length === undefined ? (
        <Typography color="textSecondary">{t('No_data')}</Typography>
      ) : (
        props.increments &&
        props.increments?.length &&
        props.increments?.length > 0 && (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Date')}</TableCell>
                  <TableCell>{t('Plan')}</TableCell>
                  <TableCell align="right">{t('Balance')}</TableCell>
                  <TableCell align="right">{t('Interest')}</TableCell>
                  <TableCell align="right">{t('Next_payout')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.increments &&
                  props.increments.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        {row.createdAt}
                      </TableCell>
                      <TableCell
                        style={{
                          textTransform: 'lowercase',
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        {row.plan}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        &euro;{row.principal}
                      </TableCell>
                      <TableCell
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                        align="right"
                      >
                        &euro;{row.interest}
                      </TableCell>
                      <TableCell
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                        align="right"
                      >
                        {row.daysUntilPayout} {t('Days')}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </>
        )
      )}
      {props.increments &&
        props.increments.length &&
        props.increments.length === 0 && (
          <Typography color="textSecondary">
            {t('No_data_available')}
          </Typography>
        )}
      <div className={classes.spacer}></div>
      <div className={classes.paginationContainer}>
        <Pagination
          count={props.pagesCount}
          onChange={props.handleInvestmentPageChanged}
          color="primary"
        />
      </div>
    </React.Fragment>
  );
}
