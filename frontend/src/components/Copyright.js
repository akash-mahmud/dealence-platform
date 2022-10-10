import clsx from "clsx";
import { Button, Typography } from "@material-ui/core";
import { Link } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import logoWhite from "../logo_white.png";
import InstagramIcon from '@material-ui/icons/Instagram';
import { useAuth } from '../hooks/use-auth';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import logo from '../logo.png';
const useStyles = makeStyles((theme) => ({
  footerContainer: {
    background: '#fff',
    width: '100%',
    height: 384,
    paddingTop: 64,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      height: 640,
    },
    marginTop: 'auto',
  },
  linksList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    color: '#ccc',
  },
  listHeader: {
    color: '#556B7F ',
    marginBottom: 12,
    fontWeight: 600,
  },
  listItem: {
    marginBottom: 10,
  },
  contactListItem: {
    // fontWeight: 600,
        color: '#adb5bd'
    // textDecoration: 'underline',
  },
  logo: {
    marginTop: 48,
    width: 320,
    height: 75,
    [theme.breakpoints.down('md')]: {
      width: 160,
      height: 37,
    },
  },
  link: {
    textDecoration: 'none',
    color: '#adb5bd ',
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  copyrightText: {
    color: '#ccc',
    width: '100%',
    position: 'absolute',
    // top: '59px'
  },
  mobileList: {
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 64,
      marginBottom: 16,
    },
  },
  newsteller: {
    display: 'unset',
    marginLeft: 'unset',
    marginBottom: 'unset',
  },
  mbd: {
    marginBottom: '26px',
  },
  [theme.breakpoints.down('sm')]: {
    newsteller: {
      display: 'none',
    },
    mbd: {
      marginBottom: '0',
    },
  },
  [theme.breakpoints.down('lg')]: {
    newsteller: {
      // marginLeft: '25px',
      // marginBottom: '42px',
    },
  },
  dbBox: {
    marginLeft: 'unset',
  },
  [theme.breakpoints.down('md')]: {
    dbBox: {
      marginLeft: '27px',
    },
  },
  defaultMargin: {
    marginLeft: 'unset',
  },
  txt: {
    marginRight: 'unset',
  },
  [theme.breakpoints.down('xs')]: {
    defaultMargin: {
      marginLeft: '27px',
    },
    txt: {
      marginRight: '10px',
    },
    // margin-right: 10px;
  },
  logoContainer: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  // margin-left: 27px;
}));

export default function Copyright() {
  const classes = useStyles();
   const { t } = useTranslation();
   const history = useHistory()
     const auth = useAuth();
  return (
    <footer className={classes.footerContainer}>
      <Grid
        container
        alignContent={'center'}
        // direction="column"
        alignItems="center"
        justify="center"
        minHeight="100vh"
        justifyContent="center"
        spacing={1}
      >
        {/* <Grid item xl={0} md={0} sm={1} xs={0}></Grid> */}
        <Grid
          item
          style={{
            marginBottom: '60px',
          }}
          xl={2}
          md={3}
          sm={3}
          xs={12}
          className={clsx(classes.mobileList, classes.mbd)}
        >
          <Typography
            style={{
              marginBottom: '0',
            }}
            variant="h6"
            className={clsx(classes.listHeader, classes.defaultMargin)}
          >
            {/* {t('Legal_Info')} */}
            <img
              style={{
                height: '35px',
              }}
              onClick={() => history.push('/')}
              src={logo}
              // className={classes.logo}
            />
          </Typography>

          <Typography
            className={clsx(classes.defaultMargin , classes.txt)}
            style={{
              color: '#adb5bd',
              fontSize: '0.875rem',
              fontFamily: ' Poppins,sans-serif',
              fontWeight: 400,
              lineHeight: ' 1.43',
            }}
          >
            {t('ft_txt')}
          </Typography>
        </Grid>
        <Grid
          style={
            {
              // marginLeft: '65px',
              
    marginBottom: '4%'

            }
          }
          item
          xl={2}
          md={2}
          sm={3}
          xs={12}
          className={clsx(classes.mobileList, classes.defaultMargin)}
        >
          <Typography variant="h6" className={classes.listHeader}>
            {t('Legal_Info')}
          </Typography>
          <ul className={classes.linksList}>
            {/* <li className={classes.listItem}>
              <a
                className={classes.link}
                href="https://www.dealence.com/disclaimer"
                target="_blank"
                rel="noopener"
              >
            Disclaimer 
              </a>
            </li> */}
            <li className={classes.listItem}>
              <a
                className={classes.link}
                href="
https://www.dealence.com/terminiecondizioni"
                target="_blank"
                rel="noopener"
              >
                {t('Terms_and_Conditions')}
              </a>
            </li>
            {/* <li className={classes.listItem}>
              <a
                className={classes.link}
                href="https://www.dealence.com/contattaci"
                target="_blank"
                rel="noopener"
              >
           Terms of Service 
              </a>
            </li> */}
            <li className={classes.listItem}>
              <a
                className={classes.link}
                href="https://www.dealence.com/privacy-policy"
                target="_blank"
                rel="noopener"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </Grid>

        <Grid
          item
          xl={2}
          md={2}
          sm={3}
          xs={12}
          className={clsx(
            classes.mobileList,
            classes.defaultMargin,
            classes.mbd
          )}
        >
          <Typography variant="h6" className={classes.listHeader}>
            {t('Contacts')}
          </Typography>
          <ul className={classes.linksList}>
            <li className={clsx(classes.listItem, classes.contactListItem)}>
              +41 798421775 ({t('Switzerland')})
            </li>
            <li className={clsx(classes.listItem, classes.contactListItem)}>
              +39 3791999130 ({t('Italy')})
            </li>
            <li className={clsx(classes.listItem, classes.contactListItem)}>
              Contact us by email
            </li>
          </ul>
          {/* <br />
          <Typography variant="h6" className={classes.listHeader}>
            Social
          </Typography>
          <div className={classes.iconContainer}>
            <a
              href="https://www.instagram.com/wearedealence/"
              target="_blank"
              rel="noopener"
            >
              <InstagramIcon color="primary" />
            </a>
          </div> */}
        </Grid>
        {/* <Grid
          item
          style={{
            marginLeft: '50px',
          }}
        ></Grid> */}
        <Grid
          style={{
            marginBottom: '26px',
          }}
          item
          xl={2}
          md={2}
          sm={1}
          xs={12}
          className={clsx(classes.mobileList, classes.newsteller)}
        >
          <Typography variant="h6" className={classes.listHeader}>
            {t('Newsletter')}
          </Typography>
          <ul className={classes.linksList}>
            <div className="newsteller">
              <li>
                <input placeholder="Your Email" className="myfrm" />
              </li>
              <li>
                <Button
                  style={{
                    backgroundColor: '#1274E7',
                    color: '#fff',
                    width: '100%',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Subscribe now
                </Button>
              </li>
            </div>
          </ul>
        </Grid>
      </Grid>
      <div
        style={{
          marginBottom: `${!auth.user ? '133px' : '46px'}`,

          position: 'relative',
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          className={classes.copyrightText}
          style={{
            top: `${auth.user ? '40px' : '92px'}`,
          }}
        >
          {'Copyright © '}
          <Link color="inherit" href="https://www.dealence.com/">
            Dealence
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'} Tutti i diritti riservati{'.'}
        </Typography>
      </div>
    </footer>
  );
}
