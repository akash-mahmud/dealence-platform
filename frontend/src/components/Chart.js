import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import Grid from '@material-ui/core/Grid';
import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const _ = require('lodash');

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: 'white',
    border: '1px solid rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(1.5),
  },
  tooltipHeader: {
    marginBottom: theme.spacing(0.5),
    fontWeight: 500,
  },
  tooltipText: {
    color: theme.palette.primary.main,
  },
  btbs: {
    marginBottom: 'unset',
  },
  [theme.breakpoints.down('xs')]: {
    btbs: {
      marginBottom: '20px',
    },
  },
}));

function formattedDate(d = new Date()) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${day}/${month}/${year}`;
}

function createData(principal, semesters = 2) {
  // The semesters for the dashed line
  const extraSemesters = 3 + semesters * 0.25;

  const data = [{ euro: principal, date: formattedDate() }];
  const prevDate = new Date();
  let Data;
   const db = principal;
  for (let i = 0; i < semesters; i++) {
    prevDate.setMonth(prevDate.getMonth() + 6);
    let amount = data[i].euro + db * (1 * 0.3);
     Data = _.round(principal,2);

    if (i >= semesters - 1) {
      data.push({
        euro: _.round(amount, 2),
        data: _.round(principal, 2),
        futureEuro: _.round(amount, 2),
        date: formattedDate(prevDate),
      });
    } else {
      data.push({
        euro: _.round(amount, 2),
        data: _.round(principal, 2),
        date: formattedDate(prevDate),
      });
    }
  }

  //=========================Compund interest logic =====================//
  //   for (let j = 0; j < extraSemesters; j++) {
  //     prevDate.setMonth(prevDate.getMonth() + 6);
  //     const amount =
  //       data[data.length - 1].futureEuro +
  //       data[data.length - 1].futureEuro * (1 * 0.3);
 
  //     data.push({
  //       futureEuro: _.round(amount, 2),
  //       date: formattedDate(prevDate),
  //     });
  //   }

  //=========================Compund interest logic end =====================//

    for (let j = 0; j < extraSemesters; j++) {
      prevDate.setMonth(prevDate.getMonth() + 6);
     
      // console.log(db * (1 * 0.3));
      // console.log(data[data.length - 1].futureEuro);
      const amount =
        data[data.length - 1].futureEuro + db * (1 * 0.3);
  // console.log(amount);
  // console.log(_.round(amount, 2));
      data.push({
        futureEuro: _.round(amount, 2),
        date: formattedDate(prevDate),
      });
    }
  return data;
}

const CustomTooltip = ({ active, payload, label }) => {
  const classes = useStyles();

  if (active && payload && payload.length) {
    return (
      <div className={classes.tooltip}>
        <Typography variant="subtitle1" className={classes.tooltipHeader}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          className={classes.tooltipText}
        >{`€${payload[0].value}`}</Typography>
      </div>
    );
  }

  return null;
};

export default function Chart() {
  const { t } = useTranslation();

  const theme = useTheme();

  const [years, setYears] = useState(2);
  const [currentChartYear, setCurrentChartYear] = useState(2);

  const [principal, setPrincipal] = useState(1000);

  const [data, setData] = useState([]);

  const classes = useStyles();

  const updateChart = () => {
    let newData = createData(principal, years * 2);

    setData(newData);
    setCurrentChartYear(years);
  };

  const handlePrincipalChange = (event) => {
    const value = event.target.value.replace(/\+|-/gi, '');

    if (value.length) {
      const number = parseFloat(value);
      setPrincipal(number);

    }
  };

  useEffect(() => {
    let defaultData = createData(principal, years * 2);
    setData(defaultData);
  }, []);

  const profitLabel = () => {
    if (data.length > 0) {
      return data[currentChartYear * 2].euro;
    }

    return '0';
  };

  return (
    <React.Fragment>
      <Title>{t('Compute_Future_Profits')}</Title>
      {/* <Typography variant="body1">In {currentChartYear} years you will earn {profitLabel()} euros</Typography> */}
      <Typography component="p" variant="h4">
        &euro;{profitLabel()}
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            hide={true}
          />
          <YAxis stroke={theme.palette.text.secondary} hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="euro"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            name="euro"
            type="monotone"
            dataKey="futureEuro"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeDasharray="5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <Container>
        <Typography id="discrete-slider" gutterBottom>
          {t('Years')}
        </Typography>
        <Slider
          defaultValue={2}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
          onChange={(_, value) => {
            setYears(value);

            updateChart();
          }}
        />
        <Typography id="discrete-slider" gutterBottom>
          {t('Capital')}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              inputProps={{
                style: {
                  fontSize: 14,
                  height: 40,
                  padding: '0 14px',
                },
              }}
              defaultValue={principal}
              id="outlined-basic"
              variant="outlined"
              onChange={handlePrincipalChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.btbs}
              variant="contained"
              onClick={updateChart}
              color="primary"
              startIcon={<RefreshIcon />}
              fullWidth
            >
              {t('Compute')}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
