import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contract from "./pages/Contract";
import ButtonAppBar from './components/ButtonAppBar';
import PrivateRoute from './PrivateRoute';
import { ProvideAuth } from './hooks/use-auth';
import dotenv from 'dotenv'
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './App.css'
import { createTheme, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import Settings from './pages/Settings';
import ReferFriend from './pages/ReferFriend';
import Verification from './pages/Verification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Investments from './pages/Investments';
import axios from 'axios';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#0041C1',
      dark: '#072968',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif'
    ].join(',')
  }
});

function App() {

  dotenv.config()
  const classes = useStyles();

  const [balance, setBalance] = useState(0);
  const [credit, setcredit] = useState(0);
  const [interest, setInterest] = useState(0.0);
  const [payouts, setPayouts] = useState({
    day: '',
    month: '',
    week: '',
    year: '',
  });

  const getPayouts = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_DATA}/account/balance`,
      {
        withCredentials: true,
      }
    );

    setBalance(res.data.balance);
    setcredit(res.data.credit);
    setPayouts(res.data.payouts);
    setInterest(res.data.interestEarned);
  };
  return (
    <ThemeProvider theme={theme}>
      <ProvideAuth>
        <Router>
          <div className={classes.root}>
            <CssBaseline />
            <ButtonAppBar
              getPayouts={getPayouts}
              setBalance={setBalance}
              setcredit={setcredit}
              setPayouts={setPayouts}
              setInterest={setInterest}
              balance={balance}
              credit={credit}
              interest={interest}
              payouts={payouts}
            />
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/forgot_password">
                <ForgotPassword />
              </Route>

              <Route path="/reset">
                <ResetPassword />
              </Route>

              <PrivateRoute path="/verification">
                <Verification />
              </PrivateRoute>

              <PrivateRoute path="/activities">
                <Investments />
              </PrivateRoute>

              <PrivateRoute path="/account">
                <Settings />
              </PrivateRoute>

              <PrivateRoute path="/referral">
                <ReferFriend />
              </PrivateRoute>

              <PrivateRoute path="/">
                <Dashboard
                  getPayouts={getPayouts}
                  setBalance={setBalance}
                  setcredit={setcredit}
                  setPayouts={setPayouts}
                  setInterest={setInterest}
                  balance={balance}
                  credit={credit}
                  interest={interest}
                  payouts={payouts}
                />
              </PrivateRoute>
            </Switch>
          </div>
        </Router>
        <NotificationContainer />
      </ProvideAuth>
    </ThemeProvider>
  );
}

export default App;
