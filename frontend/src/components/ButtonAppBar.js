import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LanguageSelect from './LanguageSelect';
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import DialogActions from '@material-ui/core/DialogActions';
import ClearIcon from '@material-ui/icons/Clear';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  List,
  TextField,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useAuth } from '../hooks/use-auth';
import { useHistory } from 'react-router-dom';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import logo from '../logo.png';
import Axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { NotificationManager } from 'react-notifications';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Person from '@material-ui/icons/Person';
import AppsIcon from '@material-ui/icons/Apps';
import PeopleIcon from '@material-ui/icons/People';
import ArrowDownwardOutlined from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlined from '@material-ui/icons/ArrowUpwardOutlined';
import Settings from '@material-ui/icons/Settings';
import Notifications from '@material-ui/icons/Notifications';
import PieChart from '@material-ui/icons/PieChart';
import RssFeed from '@material-ui/icons/RssFeed';
import LiveHelp from '@material-ui/icons/LiveHelp';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import LanguageIcon from '@material-ui/icons/Language';
import StripeCard from './StripeCard';
import EbanMethod from './EbanMethod';
import { useTranslation } from 'react-i18next';

// import {useTranslation} from "react-i18next";
const drawerWidth = 240;
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');


export default function ButtonAppBar(props) {
    const auth = useAuth();
  const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },

    logo: {
      maxWidth: 200,
      maxHeight: 57,
      marginTop: 10,
      flexGrow: 1,
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    drawerLogo: {
      maxWidth: 150,
      maxHeight: 42,
    },
    menuButton: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    mthmbl: {
      display: 'none',
    },
    moblmethod: {
      marginBottom: '10px',
    },
    appBarLeftButtons: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    depositAppBarButton: {
      marginRight: theme.spacing(1),
    },
    mobileDrawerItems: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    toolbar: {
      [theme.breakpoints.up('md')]: {
        paddingRight: 24, // keep right padding when drawer closed
      },
    },
    toolbarIcon: {
      marginTop: 12,
      marginBottom: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    appBarShift: {
      [theme.breakpoints.up('sm')]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
    drawerPaper: {
      backgroundColor: 'white',
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    menuButtonHidden: {
      display: 'none',
    },
    mobileMenuButton: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    closeDrawerChevron: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    drawerLogoContainer: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(3),
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    routeName: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      // display: 'none',
      color: '#556B7F',
    },
    drawerListItem: {
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(0.5),
      },
    },
    drawerListItemText: {
      fontWeight: 500,
    },
    drawerListItemIcon: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      padding: theme.spacing(1),
      minWidth: '0',
      marginRight: theme.spacing(2),
      borderRadius: '50%',
      color: 'rgba(0, 0, 0, 0.7)',
    },
    drawerListItemIconActive: {
      color: theme.palette.primary.main,
    },
    profileIcon: {
      // backgroundColor: "rgba(0, 0, 0, 0.2)"
      color: 'white',
    },
    userButton: {
      marginLeft: theme.spacing(1),
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    notificationsBellButton: {
      marginLeft: theme.spacing(1),
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    notificationsBellIcon: {
      color: 'rgba(0, 0, 0, 0.2)',
    },
    notificationsBellIconEnabled: {
      color: '#1274E7',
    },
    popupMenuList: {
      paddingBottom: 0,
    },
    popupMenu: {
      marginTop: theme.spacing(6.5),
    },
    userPopupName: {
      color: theme.palette.primary.main,
    },
    popupMenuHeader: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(6),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(3),
    },
    userPopupBalance: {
      fontWeight: 500,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 4,
      padding: theme.spacing(0.5),
    },
    balanceChip: {
      marginTop: theme.spacing(1),
    },
    popupMenuItem: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(6),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    hdlogo: {
      display: `${auth.user ? 'none' : 'unset'}`,
    },
    payMthods: {
      display: 'unset',
    },
    withdraw: {
      width: '71%',
      margin: ' 0 auto',
    },
    mywth: {
      width: '333px',
      height: '261px',
    },
    img: {
      margin: ' 0 auto',
    },
    wiCr: {
      width: '404px',
      height: '300px',
    },
    usr: {
      display: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      usr: {
        display: 'flex',
      },
      img: {
        margin: 'unset',
      },
      wiCr: {
        width: '302px',
        height: '205px',
      },
      strpdlg: {
        maxHeight: '80%',
      },
      strpdlgibn: {
        maxHeight: '90%',
      },
      payMthods: {
        display: 'none',
      },
      mthmbl: {
        display: 'unset',
      },
      withdraw: {
        width: 'unset',
        margin: 'unset',
      },
      mywth: {
        width: '300px',
        height: '230px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      hdlogo: {
        display: 'none',
      },
    },

    [theme.breakpoints.down('md')]: {

      hdlogo: {
        display: 'none',
      },
    },
  }));
  const { t } = useTranslation();


  const [withDrawByCryptoDialogue, setwithDrawByCryptoDialogue] =
    useState(false);
  const [withdrawByIbanDialogue, setwithdrawByIbanDialogue] = useState(false);
  let [balance, setBalance] = useState(0);
  const [credit, setcredit] = useState(0);


  const classes = useStyles();

  const history = useHistory();


  let [depositAmmount, setdepositAmmount] = useState(500);

  const ammountHandler = async (e) => {


    setdepositAmmount(e.target.value);
  

    if (e.target.value >= 500) {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_DATA}/transaction/crypto`,
        {
          amount: e.target.value,
        },
        {
          withCredentials: true,
        }
      );

      setCoinbaseCheckoutData(data);
    }

    // setOpenDialog(false);
    // setCryptoDialogue(true);
  };

  let [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  let [openDrawer, setOpenDrawer] = React.useState(window.innerWidth >= 960);
  useEffect(() => {
  console.log(process);
  }, [])
  

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleNotificationsChange = () => {
    const newNotificationsStatus = !notificationsEnabled;

    const updateNotificationsStatus = async () => {
      const payload = { notificationsEnabled: newNotificationsStatus };

      try {
        await Axios.put(
          `${process.env.REACT_APP_API_DATA}/user/updateNotificationStatus`,
          payload,
          {
            withCredentials: true,
          }
        );

        setNotificationsEnabled(newNotificationsStatus);

        if (newNotificationsStatus) {
        
        } else {

        }
      } catch (error) {
      
      }
    };

    updateNotificationsStatus();
  };
  const requestServerToCrypto = async () => {
    if (depositAmmount >= 500) {
      setbuttonSelected('crypto');
      const { data } = await Axios.post(
        `${process.env.REACT_APP_API_DATA}/transaction/crypto`,
        {
          amount: depositAmmount,
        },
        {
          withCredentials: true,
        }
      );

      setCoinbaseCheckoutData(data);

      // setOpenDialog(false);
      // setCryptoDialogue(true);
    }
  };

  let [openDialog, setOpenDialog] = useState(false);
  let [buttonSelected, setbuttonSelected] = useState('');
  let [stripeDialogue, setstripeDialogue] = useState(false);
  let [ebanDialogue, setebanDialogue] = useState(false);
  const [withdrawName, setwithdrawName] = useState('');
  const [withdrawEmail, setwithdrawEmail] = useState('');
  const [withdrawAmount, setwithdrawAmount] = useState();
  const handleClickOpenDialog = () => {
    if (!auth.user.isActive) {
      NotificationManager.error(
        t('Verify_your_account_before'),
        t('Unverified_account')
      );

      return;
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const getData = async () => {
      const res = await Axios.get(
        `${process.env.REACT_APP_API_DATA}/account/balance`,
        {
          withCredentials: true,
        }
      );

      setBalance(res.data.balance);
      setcredit(res.data.credit);
      // credit;
    };

    getData();
  });

  let [sdk, setSdk] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const res = await Axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
        withCredentials: true,
      });

      if (res.data) {
        setNotificationsEnabled(res.data.notificationsEnabled);
      }
    };

    getUser();
  }, []);
  const [creditData, setcreditData] = useState(0);
  useEffect(() => {
    const getData = async () => {
      const res = await Axios.get(
        `${process.env.REACT_APP_API_DATA}/account/balance`,
        {
          withCredentials: true,
        }
      );

      setcreditData(res.data.credit);
    };
    getData();
  }, []);
  const approveTrans = (data, actions) => {
    return actions.order.capture().then(function (details) {
      console.log(details);
      Axios
        .post(
          `${process.env.REACT_APP_API_DATA}/transaction/deposit`,
          details,
          {
            withCredentials: true,
          }
        )
        .then(function () {
          const balanceAdd = async () => {
            const res = await Axios.get(
              `${process.env.REACT_APP_API_DATA}/account/balance`,
              { withCredentials: true }
            );

            setBalance(res.data.balance);

            setOpenDialog(false);
          };
          balanceAdd();
        })
        .catch((e) => console.log(e));
    });
  };

  const [cryptoMessageByNetwork, setcryptoMessageByNetwork] = useState(
    'Minimum withdrawal is €25.00. Your withdrawal will have €8.00 subtracted from your remaining balance to cover the fee required to process the transaction.'
  );

  let [anchorEl, setAnchorEl] = React.useState(null);

  let [coinbaseCheckoutData, setCoinbaseCheckoutData] = useState({});
  const openMenu = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, []);

  let [withdrawModel, setWithdrawModel] = useState(false);

  const withdrawHandleOpen = () => {
    if (!auth.user.isActive) {
      NotificationManager.error(
        t('Verify_your_withdraw'),
        t('Unverified_account')
      );

      return;
    }

    setWithdrawModel(true);
  };

  const withdrawHandleClose = () => {
    setWithdrawModel(false);
  };

  // Handles drawer style for mobile and desktop
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const drawerProps = {
    variant: isSmallScreen ? 'temporary' : 'permanent',
  };

  // Map routes to titles
  const routeMap = {
    '/': 'Dashboard',
    '/verification': 'Verification',
    '/referral': 'Refer a Friend',
    '/account': t('SettingTab'),
    '/activities': t('Our_Investments'),
  };
  const stripeHandleCloseDialog = () => {
    setstripeDialogue(false);
  };
  const stripeEbanHandleCloseDialog = () => {
    setebanDialogue(false);
  };
  const currentRouteName = routeMap[useLocation().pathname];

  const getPayment = async () => {
    // const { data } = await Axios.post(
    //   'http://localhost:4000/transaction/create-payment-intent',
    //   {
    //     amount: depositAmmount,
    //   },
    //   {
    //     withCredentials: true,
    //   }
    // );
    // setClientSecret(data.clientSecret);
    setOpenDialog(false);
    setstripeDialogue(true);
  };
  const appearance = {
    theme: 'stripe',

    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
      width: 'auto',
      // See all possible variables below
    },
  };

  const options = {
    appearance,
  };

  const getPaymentEban = async () => {
    setOpenDialog(false);
    setebanDialogue(true);
  };

  const [crypto, setcrypto] = useState('Etherium');
  const [cryptoAddress, setcryptoAddress] = useState('');
  const [iban, setiban] = useState('');
  const [withdrawLoading, setwithdrawLoading] = useState(false);
  const sucessWindowHAndel = () => {
    setsuccessWindow(false);
    window.location.reload()
  };

  const requestServerToStripe = () => {
    setbuttonSelected('card');
    // getPayment();
    // setstripeDialogue(true);
  };

  const requestServerToStripeEban = async () => {
    setbuttonSelected('eban');
    // getPaymentEban();
  };
  const cloSeModel = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    requestServerToCrypto();
  }, []);

  const handelBackButton = () => {
    setOpenDialog(true);
    setebanDialogue(false);
    setstripeDialogue(false);
  };

  const handelBackButtonWithdraw = () => {
    setWithdrawModel(true);
    setwithdrawByIbanDialogue(false);
  };
  useEffect(() => {
    setbuttonSelected('');
  }, []);

  const withDrawCryptoModelHandelClode = () => {
    setwithDrawByCryptoDialogue(false);
    setcryptoWithdrawModelSuccesfulText(false);
  };
  const withDrawIbanModelHandelClode = () => {
    setwithdrawByIbanDialogue(false);
  };

  const [withdrawNameFull, setwithdrawNameFull] = useState('');
  const [bankName, setbankName] = useState('');
  const [swift, setswift] = useState();
  const [successWindow, setsuccessWindow] = useState(false);
  const [
    cryptoWithdrawModelSuccesfulText,
    setcryptoWithdrawModelSuccesfulText,
  ] = useState(false);
  const ibanwithdraw = () => {
    setbuttonSelected('ebanWithdraw');
  };

  const cryptowithdraw = () => {
    setbuttonSelected('cryptoWithdraw');
  };

  const withdrawWithMethod = () => {
    if (buttonSelected === 'ebanWithdraw') {
      setWithdrawModel(false);
      setwithdrawByIbanDialogue(true);
    } else if (buttonSelected === 'cryptoWithdraw') {
      setwithDrawByCryptoDialogue(true);
      setWithdrawModel(false);
    } else {
      return;
    }
  };

  const cryptoDataSendToServer = async (e) => {
    setwithdrawLoading(true);
    e.preventDefault();
    const { data } = await Axios.post(
      `${process.env.REACT_APP_API_DATA}/transaction/crypto/withdraw`,
      { withdrawAmount, cryptoAddress, crypto, withdrawName, withdrawEmail },
      { withCredentials: true }
    );
    if (data === 'success') {
      setcryptoWithdrawModelSuccesfulText(true);
      setwithDrawByCryptoDialogue(false);
      setwithdrawLoading(false);
      setsuccessWindow(true);
      const getData = async () => {
        const res = await Axios.get(
          `${process.env.REACT_APP_API_DATA}/account/balance`,
          {
            withCredentials: true,
          }
        );

        setBalance(() => res.data.balance);
      };

      getData();
    }
  };

  const ibanWithdrawSuccess = () => {};
  const ibanDataSendToServer = async (e) => {
    setwithdrawLoading(true);
    e.preventDefault();
    const { data } = await Axios.post(
      `${process.env.REACT_APP_API_DATA}/transaction/withdraw`,
      {
        withdrawAmount,
        withdrawNameFull,
        bankName,
        swift,
        withdrawEmail,
        iban,
      },
      { withCredentials: true }
    );

    if (data === 'success') {
      setwithdrawByIbanDialogue(false);
      setwithdrawLoading(false);
      setsuccessWindow(true);
      // NotificationManager.success(data);

      const getData = async () => {
        const res = await Axios.get(
          `${process.env.REACT_APP_API_DATA}/account/balance`,
          {
            withCredentials: true,
          }
        );

        setBalance(() => res.data.balance);
      };

      getData();
    }
  };

  const handeslDepost = async () => {
    if (buttonSelected === 'card') {
      getPayment();
    } else if (buttonSelected === 'eban') {
      //  setbuttonSelected('eban');
      getPaymentEban();
    } else {
      return;
    }

    // getPayment();
  };

  const liveMessage = () => {
    if (window.tidioChatApi) {
      window.tidioChatApi.open();
    }
  };

  const handelCryptoNetChange = (e) => {
    setcrypto(e.target.value);
  };
const [failedCryptoDeposit, setfailedCryptoDeposit] = useState(false)
  const depostByCrypto = async () => {
      const  data  = await Axios.post(
        `${process.env.REACT_APP_API_DATA}/transaction/cr`,
        {depositAmmount},
        {
          withCredentials: true,
        }
      );
   
  }

  const cloSeModelCryptoDeposit = () => {
    setOpenDialog(false);
setfailedCryptoDeposit(false);
  }
  return (
    <>
      <Dialog
        open={successWindow}
        onClose={sucessWindowHAndel}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          style={{
            margin: '12px',
          }}
          id="scroll-dialog-title"
        >
          <ClearIcon
            onClick={sucessWindowHAndel}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '17px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <div
                style={{
                  width: '34%',
                  margin: '0 auto',
                  marginTop: '152px',
                  height: ` 200px`,
                }}
              ></div>
              <div
                style={{
                  position: 'absolute',

                  top: '32%',
                  left: '6%',
                  right: '8%',
                }}
              >
                <i
                  style={{
                    color: '#1274E7',

                    fontSize: '85px',

                    marginLeft: '41%',
                  }}
                  className="fa-solid fa-circle-check"
                ></i>
                <div>
                  <span
                    style={{
                      display: 'block',
                      marginLeft: '20px',

                      marginTop: '15px',
                      textAlign: 'center',
                      fontSize: '17px',
                      fontWeight: '600',
                    }}
                  >
                    {t('Withdrawal_request_sent_successfully')}
                  </span>
                  <span
                    style={{
                      display: `${
                        cryptoWithdrawModelSuccesfulText === true
                          ? 'none'
                          : 'block'
                      }`,
                      marginLeft: '20px',
                      textAlign: 'center',
                      fontSize: '15px',
                      marginTop: '7px',
                    }}
                  >
                    {t('your_withdraw_email')}
                  </span>
                  <span
                    style={{
                      display: `${
                        cryptoWithdrawModelSuccesfulText === false
                          ? 'none'
                          : 'block'
                      }`,
                      marginLeft: '20px',
                      textAlign: 'center',
                      fontSize: '15px',
                      marginTop: '7px',
                    }}
                  >
                    {t('your_withdraw_email_crypto')}
                  </span>
                </div>
              </div>

              {/* </Button> */}
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '41px',
          }}
        ></DialogActions>
      </Dialog>

      <Dialog
        open={failedCryptoDeposit}
        onClose={cloSeModelCryptoDeposit}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <div
          style={{
            height: '663px',
          }}
        >
          <DialogTitle
            style={{
              margin: '12px',
            }}
            id="scroll-dialog-title"
          >
            <ClearIcon
              onClick={cloSeModelCryptoDeposit}
              className="closeIcon"
              style={{
                /* float: right; */ width: '40px',
                /* height: 18px; */
                position: 'absolute',
                top: '17px',
                right: '10px',
                height: '27px',
                color: '#0041C1',
              }}
            />
          </DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Container component="main" maxWidth="xs">
                <div
                  style={{
                    width: '34%',
                    margin: '0 auto',
                    marginTop: '207px',
                    height: `299px`,
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',

                    top: '36%',
                    left: '6%',
                    right: '8%',
                  }}
                >
                  <i
                    style={{
                      color: '#ccc',

                      fontSize: '85px',

                      marginLeft: '227px',
                    }}
                    className="fa-solid fa-circle-xmark"
                  ></i>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        marginLeft: '20px',

                        marginTop: '15px',
                        textAlign: 'center',
                        fontSize: '17px',
                        fontWeight: '600',
                      }}
                    >
                      {t('Deposit_failed')}
                    </span>
                  </div>
                </div>

                {/* </Button> */}
              </Container>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {t('Enter_the_amount')}
          {/* <h1>{t('welcome.title')}</h1> */}
          <ClearIcon
            onClick={cloSeModel}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '17px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <TextField
                type="number"
                id="outlined-basic"
                label={t('Enter_the')}
                variant="outlined"
                onChange={ammountHandler}
                value={depositAmmount}
                name="balance"
                style={{
                  marginTop: '30px',
                }}
              />
              <p
                style={{
                  fontSize: '13px',
                  marginTop: '8px',
                }}
              >
                <span
                  style={{
                    color: '#0041C1',
                  }}
                >
                  *
                </span>
                {t('Minimum_deposit')} €500
              </p>
              <p style={{ margin: '32px 0 9px 0' }}>
                {t('Select_your_payment')}
              </p>
              {/* variant=
              {` ${buttonSelected === 'card' ? 'contained' : 'outlined'}`} */}
              {/* color: #0041C1; */}
              <div
                className={classes.payMthods}
                style={{
                  marginTop: '15px',
                  marginBottom: '15px',
                }}
              >
                <Button
                  onClick={() => requestServerToStripe()}
                  className="paybtns"
                  color="primary"
                  variant={'outlined'}
                  style={{
                    margin: ' 0 15px 0 0',
                    color: buttonSelected === 'card' ? '#fff' : '',

                    backgroundColor: buttonSelected === 'card' ? '#1274E7' : '',
                  }}
                  disabled={depositAmmount < 500 ? true : false}
                >
                  <i class="fa-solid fa-credit-card"></i>
                  {t('card')}
                </Button>
                <Button
                  onClick={() => requestServerToStripeEban()}
                  className="paybtns"
                  color="primary"
                  variant={'outlined'}
                  style={{
                    margin: ' 0 15px 0 0',
                    color: buttonSelected === 'eban' ? '#fff' : '',
                    backgroundColor: buttonSelected === 'eban' ? '#1274E7' : '',
                  }}
                  disabled={depositAmmount < 500 ? true : false}
                >
                  <i class="fa-solid fa-building-columns"></i>
                  Iban
                </Button>
                {/* <Button
                onClick={requestServerToCrypto}
                color="primary"
                variant={'outlined'}
                style={{
                  margin: ' 0 15px 0 0',
                  color: buttonSelected === 'crypto' ? '#fff' : '',
                  backgroundColor: buttonSelected === 'crypto' ? '#0041C1' : '',
                }}
              > */}
                <div
                  onClick={() => requestServerToCrypto()}
                  style={{ display: 'inline-block' }}
                >
                  <fieldset
                    disabled={depositAmmount < 500 ? true : false}
                    style={{ display: 'contents' }}
                  >
                    <CoinbaseCommerceButton
                      // onChargeSuccess={}
                      styled
                      style={{
                        padding: '7px 30px',
                        margin: ' 0 15px 0 0',
                        color: buttonSelected === 'crypto' ? '#fff' : '',
                        backgroundColor:
                          buttonSelected === 'crypto' ? '#1274E7' : '',
                      }}
                      checkoutId={coinbaseCheckoutData.id}
                      onChargeSuccess={(data) => {}}
                      onChargeFailure={(data) => {
                        // setfailedCryptoDeposit(true);
                      }}
                      onPaymentDetected={(data) => {
                        depostByCrypto();
                        // setBalance;
                        const getData = async () => {
                          const res = await Axios.get(
                            `${process.env.REACT_APP_API_DATA}/account/balance`,
                            {
                              withCredentials: true,
                            }
                          );

                          props.setBalance(res.data.balance);
                          setcredit(res.data.credit);
                          // credit;
                        };

                        getData();
                        window.location.reload();
                      }}
                      onModalClosed={(data) => {
                        // setfailedCryptoDeposit(true);
                        // {event: 'charge_failed', code: 'CKAE3VJP', buttonId: '9dba92d2-35e7-4b56-96e6-650d76d0e48b'}
                        // is a user close the model  without deposit the money
                      }}
                    >
                      <i class="fa-solid fa-qrcode"></i>
                      Crypto
                    </CoinbaseCommerceButton>
                  </fieldset>
                </div>
              </div>
              <div className={classes.mthmbl}>
                <ul
                  style={{
                    listStyle: 'none',
                  }}
                >
                  <li className={classes.moblmethod}>
                    <Button
                      onClick={requestServerToStripe}
                      className="paybtns"
                      color="primary"
                      variant={'outlined'}
                      style={{
                        margin: ' 0 15px 0 0',
                        color: buttonSelected === 'card' ? '#fff' : '',

                        backgroundColor:
                          buttonSelected === 'card' ? '#1274E7' : '',
                      }}
                      disabled={depositAmmount < 500 ? true : false}
                    >
                      <i class="fa-solid fa-credit-card"></i>
                      {t('card')}
                    </Button>
                  </li>
                  <li className={classes.moblmethod}>
                    <Button
                      onClick={requestServerToStripeEban}
                      className="paybtns"
                      color="primary"
                      variant={'outlined'}
                      style={{
                        margin: ' 0 15px 0 0',
                        color: buttonSelected === 'eban' ? '#fff' : '',
                        backgroundColor:
                          buttonSelected === 'eban' ? '#1274E7' : '',
                      }}
                      disabled={depositAmmount < 500 ? true : false}
                    >
                      <i class="fa-solid fa-building-columns"></i>
                      Iban
                    </Button>
                  </li>
                  <li className={classes.moblmethod}>
                    <div
                      onClick={requestServerToCrypto}
                      style={{ display: 'inline-block' }}
                    >
                      <fieldset
                        disabled={depositAmmount < 500 ? true : false}
                        style={{ display: 'contents' }}
                      >
                        <CoinbaseCommerceButton
                          // onChargeSuccess={}
                          styled
                          style={{
                            padding: '7px 30px',
                            margin: ' 0 15px 0 0',
                            color: buttonSelected === 'crypto' ? '#fff' : '',
                            backgroundColor:
                              buttonSelected === 'crypto' ? '#1274E7' : '',
                          }}
                          checkoutId={coinbaseCheckoutData.id}
                          onChargeSuccess={(data) => {}}
                          onChargeFailure={(data) => {
                            // setfailedCryptoDeposit(true);
                          }}
                          onPaymentDetected={(data) => {
                            depostByCrypto();
                            // setBalance;
                            const getData = async () => {
                              const res = await Axios.get(
                                `${process.env.REACT_APP_API_DATA}/account/balance`,
                                {
                                  withCredentials: true,
                                }
                              );

                              props.setBalance(res.data.balance);
                              setcredit(res.data.credit);
                              // credit;
                            };

                            getData();
                          }}
                          onModalClosed={(data) => {
                            // setfailedCryptoDeposit(true);
                            // {event: 'charge_failed', code: 'CKAE3VJP', buttonId: '9dba92d2-35e7-4b56-96e6-650d76d0e48b'}
                            // is a user close the model  without deposit the money
                          }}
                        >
                          <i class="fa-solid fa-qrcode"></i>
                          Crypto
                        </CoinbaseCommerceButton>
                      </fieldset>
                    </div>
                  </li>
                </ul>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  marginBottom: '30px',
                  marginTop: '10px',
                }}
              >
                <i class="fa-solid fa-lock"></i>{' '}
                {t('Your_payment_info_is_secure_and_will_never_be_shared')}
              </p>
              {/* </Button> */}
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handeslDepost}
            color="primary"
            disabled={depositAmmount < 500 || !buttonSelected ? true : false}
          >
            {t('Deposit_Now')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        className={classes.strpdlgibn}
        open={ebanDialogue}
        onClose={stripeEbanHandleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          style={{
            marginBottom: '21px',
          }}
          id="scroll-dialog-title"
        >
          <ClearIcon
            onClick={stripeEbanHandleCloseDialog}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '15px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <div className="  gateway">
                <Elements balance={depositAmmount} stripe={stripePromise}>
                  <EbanMethod
                    setebanDialogue={setebanDialogue}
                    balance={depositAmmount}
                    setBalance={setBalance}
                    setInvestBalance={props.setBalance}
                  />
                </Elements>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '30px',
          }}
        >
          <Button
            onClick={handelBackButton}
            style={{ position: 'absolute', left: '0', top: '11px' }}
            color="primary"
          >
            <ArrowBackIcon />
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        className={classes.strpdlg}
        open={stripeDialogue}
        onClose={stripeHandleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          style={{
            marginBottom: '34px',
          }}
          id="scroll-dialog-title"
        >
          <ClearIcon
            onClick={stripeHandleCloseDialog}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '17px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main">
              <div className="  gateway">
                {/* <PayPalButton
                  amount={pay}
                  options={{ currency: 'EUR' }}
                  style={{ 'margin-top': '20px' }}
                  onApprove={approveTrans}
                /> */}

                <Elements styled options={options} stripe={stripePromise}>
                  <StripeCard
                    setBalance={setBalance}
                    setstripeDialogue={setstripeDialogue}
                    balance={depositAmmount}
                    setInvestBalance={props.setBalance}
                  />
                </Elements>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handelBackButton}
            style={{ position: 'absolute', left: '10px', top: '17px' }}
            color="primary"
          >
            <ArrowBackIcon />
          </Button>
          <Button
            style={{
              marginRight: '5px',
            }}
            onClick={stripeHandleCloseDialog}
            color="primary"
          >
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        className={classes.strpdlgibn}
        open={withdrawModel}
        onClose={withdrawHandleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {t('Withdraw')}
          <ClearIcon
            onClick={withdrawHandleClose}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '18px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <div
                className="eban"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <div
                  className={clsx(classes.withdraw, 'ibnImgwithdrawPopup')}
                  style={{}}
                >
                  <img
                    className={clsx(classes.mywth)}
                    alt=""
                    src={'./image/Withdraw.png'}
                  />
                </div>
                <form
                  style={
                    {
                      // marginTop: '100px',
                    }
                  }

                  // onSubmit={handleSubmit}
                >
                  <label>{t('Your_Email')} </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    name="email"
                    onChange={(e) => setwithdrawEmail(e.target.value)}
                  />
                  <label>{t('Ammount')}: </label>
                  <input
                    style={{
                      marginBottom: '0',
                    }}
                    type="number"
                    name="ammount"
                    onChange={(e) => setwithdrawAmount(e.target.value)}
                  />
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#aeacac',
                      marginTop: '2px',
                    }}
                  >
                    {t('Available_ammount')} €{props.credit}
                  </p>
                </form>
                <p style={{ margin: '30px 0 9px 0' }}>
                  {t('Select_your_payment')}
                </p>
                <div
                  style={{
                    marginBottom: '35px',
                  }}
                >
                  <Button
                    onClick={ibanwithdraw}
                    color="primary"
                    variant={'outlined'}
                    style={{
                      margin: ' 0 15px 0 0',
                      color: buttonSelected === 'ebanWithdraw' ? '#fff' : '',
                      backgroundColor:
                        buttonSelected === 'ebanWithdraw' ? '#1274E7' : '',
                    }}
                    disabled={
                      !withdrawEmail ||
                      !withdrawAmount ||
                      creditData === 0 ||
                      withdrawAmount < 0 ||
                      withdrawAmount === 0 ||
                      withdrawAmount > creditData
                        ? true
                        : false
                    }
                  >
                    Iban
                  </Button>

                  <div
                    onClick={cryptowithdraw}
                    style={{ display: 'inline-block' }}
                  >
                    <fieldset
                      disabled={depositAmmount < 500 ? true : false}
                      style={{ display: 'contents' }}
                    >
                      <Button
                        color="primary"
                        variant={'outlined'}
                        style={{
                          padding: '5px 30px',
                          margin: ' 0 15px 0 0',
                          color:
                            buttonSelected === 'cryptoWithdraw' ? '#fff' : '',
                          backgroundColor:
                            buttonSelected === 'cryptoWithdraw'
                              ? '#1274E7'
                              : '',
                        }}
                        disabled={
                          !withdrawEmail ||
                          !withdrawAmount ||
                          creditData === 0 ||
                          withdrawAmount < 0 ||
                          withdrawAmount === 0 ||
                          withdrawAmount > creditData
                            ? true
                            : false
                        }
                      >
                        Crypto
                      </Button>
                    </fieldset>
                  </div>
                </div>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              !withdrawEmail ||
              !withdrawAmount ||
              creditData === 0 ||
              withdrawAmount < 0 ||
              withdrawAmount > creditData
                ? true
                : false
            }
            onClick={withdrawWithMethod}
            color="primary"
          >
            {t('Withdraw')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        className={classes.strpdlgibn}
        open={withDrawByCryptoDialogue}
        onClose={withDrawCryptoModelHandelClode}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          style={{
            margin: '12px',
          }}
          id="scroll-dialog-title"
        >
          <ClearIcon
            onClick={withDrawCryptoModelHandelClode}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '18px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <div
                className="wiCr"
                style={{
                  width: '100%%',
                  margin: ' 0 auto',
                }}
              >
                <img
                  className={classes.wiCr}
                  alt=""
                  src={'./image/Crypto.png'}
                />
              </div>
              <p style={{ margin: '0px 0 9px 0' }}>
                {t('Select_your')} Crypto:
              </p>
              <Select value={crypto} onChange={handelCryptoNetChange}>
                <MenuItem value="Bitcoin">
                  <img
                    src="./bitcoin-btc-logo.svg"
                    alt=""
                    style={{
                      height: '16px',
                      width: '16px',
                      marginRight: '5px',
                    }}
                  />
                  Bitcoin
                </MenuItem>
                <MenuItem value="Etherium">
                  <img
                    src="./ethereum-eth-logo.svg"
                    alt=""
                    style={{
                      height: '16px',
                      width: '16px',
                      marginRight: '5px',
                    }}
                  />
                  Etherium
                </MenuItem>
                {/* <MenuItem value="Doge coin">Doge coin</MenuItem> */}
                <MenuItem value="Lite coin">
                  <img
                    src="./litecoin-ltc-logo.svg"
                    alt=""
                    style={{
                      height: '16px',
                      width: '16px',
                      marginRight: '5px',
                    }}
                  />{' '}
                  Lite coin
                </MenuItem>
              </Select>
              <div
                className="eban"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <form
                  style={{ paddingTop: '16px' }}
                  // onSubmit={handleSubmit}
                >
                  <label>{t('Your_wallet_Address')}</label>
                  <div className="elements_withdraw">
                    <input
                      style={{
                        marginBottom: '8px',
                      }}
                      type="text"
                      name="name"
                      onChange={(e) => setcryptoAddress(e.target.value)}
                      required
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      display: `${crypto !== 'Etherium' ? 'none' : ''}`,
                    }}
                  >
                    {t('eth_text')}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      display: `${crypto !== 'Bitcoin' ? 'none' : ''}`,
                    }}
                  >
                    {t('btc_text')}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      display: `${crypto !== 'Lite coin' ? 'none' : ''}`,
                    }}
                  >
                    {t('ltc_text')}
                  </p>
                  <button
                    className="pay-button"
                    style={{
                      fontWeight: '500',
                    }}
                    type="submit"
                    disabled={
                      !crypto || withdrawLoading === true || !cryptoAddress
                    }
                    onClick={cryptoDataSendToServer}
                  >
                    {t('Request_for_withdraw')}
                  </button>
                </form>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '32px',
          }}
        >
          {/* <Button onClick={withDrawCryptoModelHandelClode} color="primary">
            {t('Close')}
          </Button> */}
        </DialogActions>
      </Dialog>

      <Dialog
        className={classes.strpdlgibn}
        open={withdrawByIbanDialogue}
        onClose={withDrawIbanModelHandelClode}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          style={{
            margin: '12px',
          }}
          id="scroll-dialog-title"
        >
          <ClearIcon
            onClick={withDrawIbanModelHandelClode}
            className="closeIcon"
            style={{
              /* float: right; */ width: '40px',
              /* height: 18px; */
              position: 'absolute',
              top: '17px',
              right: '10px',
              height: '27px',
              color: '#0041C1',
            }}
          />
        </DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Container component="main" maxWidth="xs">
              <div
                className="eban"
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <div
                  className={clsx(classes.img, 'ibnImgWithdraw')}
                  style={{
                    width: '74%',
                  }}
                >
                  <img alt="" src={'./image/SEPA.png'} />
                </div>
                <form
                  style={
                    {
                      //  paddingTop: '16px'
                    }
                  }
                  // onSubmit={handleSubmit}
                >
                  <div>
                    <label>{t('Full_Name')}</label>
                    <div className="elements_withdraw">
                      <input
                        type="text"
                        name="name"
                        style={{
                          height: '50px',
                        }}
                        onChange={(e) => setwithdrawNameFull(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label>{t('Bank_Name')}</label>
                    <div className="elements_withdraw">
                      <input
                        type="text"
                        name="name"
                        style={{
                          height: '50px',
                        }}
                        onChange={(e) => setbankName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label>IBAN:</label>
                    <div className="elements_withdraw">
                      <input
                        type="text"
                        name="name"
                        style={{
                          height: '50px',
                        }}
                        onChange={(e) => setiban(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label>BIC/Swift:</label>
                    <div className="elements_withdraw">
                      <input
                        type="text"
                        name="name"
                        style={{
                          height: '50px',
                        }}
                        onChange={(e) => setswift(e.target.value)}
                      />
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    {t('our_bank')}
                  </p>
                  <button
                    style={{
                      fontWeight: '500',
                      // borderRadius: '7px',
                    }}
                    className="pay-button"
                    type="submit"
                    disabled={
                      !iban ||
                      withdrawLoading === true ||
                      !withdrawEmail ||
                      !bankName ||
                      !swift
                    }
                    onClick={ibanDataSendToServer}
                  >
                    {t('Request_for_withdraw')}
                  </button>
                </form>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            marginBottom: '41px',
          }}
        >
          <Button
            onClick={handelBackButtonWithdraw}
            style={{ position: 'absolute', left: '0', top: '11px' }}
            color="primary"
          >
            <ArrowBackIcon />
          </Button>
          {/* <Button onClick={withDrawIbanModelHandelClode} color="primary">
            Close
          </Button> */}
        </DialogActions>
      </Dialog>
      <AppBar
        elevation={0}
        position="absolute"
        color="white"
        className={clsx(
          classes.appBar,
          auth.user && (openDrawer || !isSmallScreen) && classes.appBarShift
        )}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.routeName}>
            <span
              style={{
                display: `${auth.user ? '' : 'none'}`,
              }}
            >
              {currentRouteName}
            </span>

            <div
              className={classes.hdlogo}
              style={{
                width: '0%',
                margin: ' 9px auto',
              }}
            >
              <div
                style={{
                  marginLeft: '79%',
                }}
              >
                <img
                  style={{
                    height: '55px',
                    verticalAlign: 'middle',
                    margin: ' 10px 0',
                  }}
                  alt=""
                  onClick={() =>
                    window.open('https://www.dealence.com', '_blank')
                  }
                  src={logo}
                  // className={classes.logo}
                />
              </div>
            </div>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <img
              onClick={() => history.push('/')}
              src={logo}
              className={classes.logo}
            />
          </Typography>
          {auth.user && (
            <div>
              <div className={classes.menuButton && classes.appBarLeftButtons}>
                <Button
                  variant="contained"
                  // color="primary"
                  style={{
                    backgroundColor: '#1274E7',
                    color: '#fff',
                    borderRadius: '4px',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  onClick={() => handleClickOpenDialog()}
                  className={classes.depositAppBarButton}
                >
                  {t('Deposit')}
                </Button>
                <Button
                  style={{
                    // rgba(102, 170, 255, 0.15)
                    backgroundColor: 'rgba(102, 170, 255, 0.15)',
                    color: '#1274E7',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                  variant="outlined"
                  // color="primary"
                  onClick={() => withdrawHandleOpen()}
                >
                  {t('Withdraw')}
                </Button>
                <IconButton
                  aria-label="email notifications bell"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleNotificationsChange}
                  className={classes.notificationsBellButton}
                >
                  <Notifications
                    className={clsx(
                      classes.notificationsBellIcon,
                      notificationsEnabled &&
                        classes.notificationsBellIconEnabled
                    )}
                  />
                </IconButton>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleMenu}
                  className={classes.userButton}
                >
                  <Person className={classes.profileIcon} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={openMenu}
                  onClose={handleClose}
                  classes={{
                    list: classes.popupMenuList,
                  }}
                  className={classes.popupMenu}
                >
                  {/* border-radius: 4px; 
                  background-color: #1274E7; */}
                  <Container className={classes.popupMenuHeader}>
                    <Typography
                      variant="h6"
                      align="left"
                      className={classes.userPopupName}
                    >
                      {auth.user.first_name} {auth.user.last_name}
                    </Typography>
                    <Typography>{auth.user.email}</Typography>
                    <div className={classes.userPopupBalanceContainer}>
                      <Chip
                        style={{
                          borderRadius: '4px',
                          backgroundColor: ' #1274E7',
                        }}
                        label={`${t('Available')}: €${balance} `}
                        color="primary"
                        className={classes.balanceChip}
                      />
                    </div>
                  </Container>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      // handleClose()
                      // setAnchorEl(null);
                      auth.signout(() => {
                        handleClose();
                        history.push('/');
                      });
                    }}
                    className={classes.popupMenuItem}
                  >
                    {t('Logout')}
                  </MenuItem>
                </Menu>
              </div>
              {auth.user && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  className={clsx(
                    classes.menuButton,
                    classes.mobileMenuButton,
                    'mymenumbl'
                  )}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </div>
          )}
        </Toolbar>
      </AppBar>
      {auth.user && (
        <Drawer
          {...drawerProps}
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !(openDrawer || !isSmallScreen) && classes.drawerPaperClose
            ),
          }}
          open={openDrawer || !isSmallScreen}
        >
          <div className={classes.drawerLogoContainer}>
            <img
              onClick={() => history.push('/')}
              src={logo}
              className={classes.drawerLogo}
            />
          </div>

          <div className={classes.toolbarIcon}>
            <IconButton
              onClick={handleDrawerClose}
              className={classes.closeDrawerChevron}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <List>
            <ListItem
              button
              // onClick={() => history.push('/')}
              // onClick={handleMenu}
              className={clsx(classes.drawerListItem, classes.usr)}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon
                  // currentRouteName == 'Dashboard' &&
                  //   classes.drawerListItemIconActive
                )}
              >
                <Person />
              </ListItemIcon>
              <ListItemText
                style={
                  {
                    // color: '#556B7F',
                  }
                }
                primary={`${auth.user.first_name} ${auth.user.last_name}`}
                className={classes.drawerListItemText}
                secondary={
                  <>
                    <p
                      style={{
                        color: '#0041C1',
                        fontSize: '12px',
                      }}
                    >
                      {`${t('Available')}: €${balance} `}
                    </p>
                  </>
                }
              />
            </ListItem>
            {!auth.user.isActive && !auth.user.isDocumentUploaded && (
              <ListItem
                button
                onClick={() => history.push('/verification')}
                className={classes.drawerListItem}
              >
                <ListItemIcon
                  className={clsx(
                    classes.drawerListItemIcon,
                    currentRouteName == 'Verification' &&
                      classes.drawerListItemIconActive
                  )}
                >
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('Verify_Account')}
                  secondary={
                    <>
                      <p
                        style={{
                          color: '#0041C1',
                        }}
                      >
                        {t('Start_here')}
                      </p>
                    </>
                  }
                />
              </ListItem>
            )}
            {/* <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
              className={classes.userButton}
            >
              <Person className={classes.profileIcon} />
            </IconButton> */}

            <ListItem
              button
              onClick={() => history.push('/')}
              className={classes.drawerListItem}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon,
                  currentRouteName == 'Dashboard' &&
                    classes.drawerListItemIconActive
                )}
              >
                <AppsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                className={classes.drawerListItemText}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => handleClickOpenDialog()}
              className={clsx(
                classes.mobileDrawerItems,
                classes.drawerListItem
              )}
            >
              <ListItemIcon className={classes.drawerListItemIcon}>
                <ArrowDownwardOutlined />
              </ListItemIcon>
              <ListItemText primary={t('Deposit')} />
            </ListItem>
            <ListItem
              button
              onClick={() => withdrawHandleOpen()}
              className={clsx(
                classes.mobileDrawerItems,
                classes.drawerListItem
              )}
            >
              <ListItemIcon className={classes.drawerListItemIcon}>
                <ArrowUpwardOutlined />
              </ListItemIcon>
              <ListItemText primary={t('Withdraw')} />
            </ListItem>

            <ListItem
              button
              onClick={() => history.push('/activities')}
              className={clsx(classes.drawerListItem)}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon,
                  currentRouteName == 'Our Activities' &&
                    classes.drawerListItemIconActive
                )}
              >
                <PieChart />
              </ListItemIcon>
              <ListItemText primary={t('Investments')} />
            </ListItem>

            <ListItem
              button
              onClick={() => history.push('/account')}
              className={clsx(classes.drawerListItem)}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon,
                  currentRouteName == 'Settings' &&
                    classes.drawerListItemIconActive
                )}
              >
                <Settings />
              </ListItemIcon>
              <ListItemText primary={t('Settings')} />
            </ListItem>

            <ListItem
              onClick={() =>
                window.open('https://www.dealence.com/blog', '_blank')
              }
              button
              className={clsx(classes.drawerListItem)}
            >
              <ListItemIcon className={clsx(classes.drawerListItemIcon)}>
                <RssFeed />
              </ListItemIcon>
              <ListItemText primary="Blog" />
            </ListItem>
            <ListItem
              button
              // onClick={() => history.push('/referral')}
              className={classes.drawerListItem}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon
                  // currentRouteName == 'Refer a Friend' &&
                  //   classes.drawerListItemIconActive
                )}
              >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('Refer_a_Friend')}
                secondary={
                  <>
                    <p
                      style={{
                        color: '#0041C1',
                      }}
                    >
                      {t('Coming_Soon')}
                    </p>
                  </>
                }
              />
            </ListItem>

            <ListItem button className={clsx(classes.drawerListItem)}>
              <ListItemIcon className={clsx(classes.drawerListItemIcon)}>
                <LiveHelp />
              </ListItemIcon>
              <ListItemText
                onClick={liveMessage}
                primary={t('Live_Chat_Support')}
              />
            </ListItem>
            <ListItem
              button
              // onClick={() => history.push('/')}
              // onClick={handleMenu}
              onClick={() => auth.signout(() => history.push('/'))}
              className={clsx(classes.drawerListItem, classes.usr)}
            >
              <ListItemIcon
                className={clsx(
                  classes.drawerListItemIcon
                  // currentRouteName == 'Dashboard' &&
                  //   classes.drawerListItemIconActive
                )}
              >
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: '#556B7F',
                }}
                primary={t('Logout')}
                className={classes.drawerListItemText}
              />
            </ListItem>
            <ListItem
              style={{ marginLeft: '12px' }}
              button
              className={clsx(classes.drawerListItem)}
            >
              <LanguageSelect />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
}
