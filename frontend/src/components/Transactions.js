import React, { useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import axios from "axios";
import { Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Transactions(props) {
     const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_DATA}/transaction`,
        {
          withCredentials: true,
        }
      );

      props.setTransactions(res.data);
  
    }
    getData()

  }, [])

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{t('Recent_Transactions')}</Title>
      {props.transactions.length === 0 ? (
        <Typography color="textSecondary">{t('No_data')}</Typography>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Transaction_type')}</TableCell>
                <TableCell align="right">{t('Amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.transactions &&
                props.transactions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )

                  .slice(0, 14)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        {row.date.split('T')[0]}
                      </TableCell>

                      <TableCell
                        style={{
                          textTransform: 'lowercase',
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        {row.type}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        &euro;{row.amount}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more Transactions
        </Link>
      </div> */}
    </React.Fragment>
  );
}
