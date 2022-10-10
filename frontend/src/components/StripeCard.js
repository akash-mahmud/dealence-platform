import React, { useState } from 'react'
import {  CardCvcElement, CardExpiryElement, CardNumberElement,   useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {


  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,

} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';



import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

function StripeCard({ balance, setstripeDialogue, setInvestBalance }) {
    const useStyles = makeStyles((theme) => ({
      strpfrm: {
        padding: '3rem',
        paddingTop: '0',
      },
      img: {
        margin: ' 0 auto',
      },
      loader: {
        width: '34%',
      },
      [theme.breakpoints.down('xs')]: {
        strpfrm: {
          padding: '0',
        },
        img: {
          margin: 'unset',
        },
      },
      [theme.breakpoints.down('sm')]: {
        loader: {
          width: '53%',
        },
      },
      [theme.breakpoints.down('md')]: {},
    }));
      const classes = useStyles();
  const { t } = useTranslation();
  const [loadingFOrAfter, setLoadingFOrAfter] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  let [openDialogAfter, setOpenDialogAfter] = useState(false);
  const [successFull, setsuccessFull] = useState(false);

  const [failed, setfailed] = useState(false);

  const [failedMessage, setfailedMessage] = useState('');

  const cloSeModelSucess = () => {
    setstripeDialogue(false);
    setOpenDialogAfter(false);
    setsuccessFull(false);
    window.location.reload()
  };
  const handleCloseDialog = () => {
        window.location.reload();
 setstripeDialogue(false);
 setOpenDialogAfter(false);
 setsuccessFull(false);
  };

  const handelSubmit = async (event) => {
    setsuccessFull(false);
    setLoadingFOrAfter(true);
    setOpenDialogAfter(true);
    // setstripeDialogue(false);
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
    });
    if (!error) {

      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_DATA}/transaction/create-payment-intent`,
          {
            id,
            amount: balance,
          },
          {
            withCredentials: true,
          }
        );

        if (data.message === 'success') {
      const getData = async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_DATA}/account/balance`,
          {
            withCredentials: true,
          }
        );

        setInvestBalance(res.data.balance);

        // credit;
      };

      getData();
        
          setsuccessFull(true);
          // NotificationManager.success(data.message);
        } else {
          setfailed(true);
          setfailedMessage(data.message);
        }
        setLoadingFOrAfter(false);
        // setstripeDialogue(false);
        // window.location.reload();
      } catch (error) {
        setstripeDialogue(false);
      }
    } else {
      // console.log(error);
    }
  };

  return (
    <>
      {/* <div style={{ maxWidth: '400px', margin: '0 auto' }}> */}
      <fieldset
        disabled={loadingFOrAfter}
        style={{
          border: 'none',
          display: `${openDialogAfter === true ? 'none' : 'block'}`,
        }}
      >
        <div className={classes.strpfrm} style={{}}>
          <div
            className={clsx(classes.img, 'crdtImg')}
            style={{
              width: '67%',
            }}
          >
            <img alt="" src={'./image/Credit.png'} />
          </div>
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <label style={{ marginBottom: '10px' }}>
              {t('Enter_your_card_details')}
            </label>
            <form
              onSubmit={handelSubmit}
              style={{
                display: 'block',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* <CardElement
                  className="cardData"
                  options={{
                    style: {
                      base: {
                        backgroundColor: 'white',
                        width: '500px',
                      },
                    },
                  }}
                /> */}

                <CardNumberElement
                  className="cardData"
                  options={{
                    style: {
                      base: {
                        backgroundColor: 'white',
                        width: '500px',
                        fontFamily: 'Poppins,sans-serif',
                        fontStyle: 'normal',
                      },
                    },
                  }}
                />

                <CardExpiryElement
                  className="cardData"
                  options={{
                    style: {
                      base: {
                        backgroundColor: 'white',
                        width: '500px',
                        fontFamily: 'Poppins,sans-serif',
                        fontStyle: 'normal',
                      },
                    },
                  }}
                />
                <CardCvcElement
                  className="cardData"
                  options={{
                    style: {
                      base: {
                        backgroundColor: 'white',
                        width: '500px',
                        fontFamily: 'Poppins,sans-serif',
                        fontStyle: 'normal',
                      },
                    },
                  }}
                />
                <button
                  className="pay-button"
                  type="submit"
                  disabled={!stripe || loadingFOrAfter === true}
                >
                  {t('Deposita')}
                </button>
                <div
                  style={{
                    width: '51%',
                    margin: '11px  auto',
                    marginRight: '28%',
                  }}
                >
                  <img
                    src="./paymethods.png"
                    alt="payment"
                    width={'    114%'}
                  />
                </div>
                <div className="bottomDiv">
                  <div className="sheildIcon">
                    <VerifiedUserIcon />
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: '600',
                      }}
                    >
                      {t('Secure_payment')}{' '}
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      {t('We_promise_you_secure_payment')}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </fieldset>

      <Dialog
        open={openDialogAfter}
        onClose={handleCloseDialog}
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
            onClick={cloSeModelSucess}
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
                className={classes.loader}
                style={{
                  margin: '0 auto',
                  marginTop: '152px',
                  height: `${successFull === true ? '200px' : ''}`,
                }}
              >
                {/* <ClipLoader
                  color="skyblue"
                  //  loadingFOrAfter={loadingFOrAfter}
                  loadingFOrAfter={true}
                  size={80}
                /> */}

                <div
                  className="loader"
                  style={{
                    display: `${successFull === true ? 'none' : ''}`,
                  }}
                ></div>
              </div>
              <div
                style={{
                  position: 'absolute',

                  top: '32%',
                  left: '6%',
                  right: '8%',
                  display: `${successFull === false ? 'none' : ''}`,
                }}
              >
                {/* // #1274E7 */}
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
                    {t('Deposit_Successful')}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginLeft: '20px',
                      textAlign: 'center',
                      fontSize: '15px',
                      marginTop: '7px',
                    }}
                  >
                    {t('deposit_congress')}
                  </span>
                </div>
              </div>

              <p
                style={{
                  marginBottom: '167px',
                  textAlign: 'center',
                  marginTop: '15px',
                  marginLeft: '20px',
                  display: `${successFull === true ? 'none' : ''}`,
                  fontSize: '22px',
                }}
              >
                {t('Please_wait')}
              </p>

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
        open={failed}
        onClose={handleCloseDialog}
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
              onClick={cloSeModelSucess}
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
                    width: '36%',
                    margin: '0 auto',
                    marginTop: '207px',
                    height: `${failed === true ? '299px' : ''}`,
                  }}
                >
                  <div
                    className="loader"
                    style={{
                      display: `${failed === true ? 'none' : ''}`,
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    position: 'absolute',

                    top: '36%',
                    left: '6%',
                    right: '8%',
                    display: `${failed === false ? 'none' : ''}`,
                  }}
                >
                  <i
                    style={{
                      color: '#ccc',

                      fontSize: '85px',

                      marginLeft: '41%',
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
                    <span
                      style={{
                        display: 'block',
                        marginLeft: '20px',
                        textAlign: 'center',
                        fontSize: '15px',
                        marginTop: '7px',
                      }}
                    >
                      {failedMessage}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        marginLeft: '20px',
                        textAlign: 'center',
                        fontSize: '15px',
                        marginTop: '7px',
                      }}
                    >
                      {t('try_again')}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    marginBottom: '167px',
                    textAlign: 'center',
                    marginTop: '15px',
                    marginLeft: '14px',
                    display: `${failed === true ? 'none' : ''}`,
                    fontSize: '22px',
                  }}
                >
                  {t('Please_wait')}
                </p>

                {/* </Button> */}
              </Container>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </div>
      </Dialog>
      {/* </div> */}
    </>
  );
}

export default StripeCard