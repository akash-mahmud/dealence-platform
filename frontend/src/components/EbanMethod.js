import React, { useState } from 'react';
import { useElements, useStripe, IbanElement } from '@stripe/react-stripe-js';
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

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],

  placeholderCountry: 'DE',
};
function EbanMethod({ balance, setebanDialogue, setInvestBalance }) {
      const useStyles = makeStyles((theme) => ({
        imgibn: {
          width: '74%',
          margin: ' 0 auto',
        },
        loader: {
          width: '34%',
        },
        [theme.breakpoints.down('xs')]: {
          imgibn: {
            width: 'unset',
            margin: ' unset',
          },
        },
        [theme.breakpoints.down('sm')]: {
          loader: {
            width: '53%',
          },
        },
        [theme.breakpoints.down('md')]: {},
      }));
      const classes = useStyles()
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  let [openDialogAfter, setOpenDialogAfter] = useState(false);
  const [successFull, setsuccessFull] = useState(false);

  const [failed, setfailed] = useState(false);

  const [failedMessage, setfailedMessage] = useState('');
  const elements = useElements();
  const cloSeModelSucess = () => {
    setebanDialogue(false);
    setOpenDialogAfter(false);
    setsuccessFull(false);
        window.location.reload();
  };
  const handleCloseDialog = () => {
    setOpenDialogAfter(false);
        window.location.reload();
  };
  const [clintSecretData, setclintSecretData] = useState();

  const handleSubmit = async (event) => {
    setOpenDialogAfter(true);

    setLoading(true);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const getClientSecret = async () => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_DATA}/transaction/create-payment`,
        { amount: balance }
      );
      return data.clientSecret;
    };
    const clientSecret = await getClientSecret();
    setclintSecretData(clientSecret);
  
    const iban = elements.getElement(IbanElement);

    const result = await stripe.confirmSepaDebitPayment(clientSecret, {
      payment_method: {
        sepa_debit: iban,
        billing_details: {
          name: name,
          email: email,
        },
      },
    });

    if (result.paymentIntent.status === 'processing') {
      let dataStatus;
      const myFunc = async () => {
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret
        );
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_DATA}/transaction/deposit`,
            { paymentIntent, amount: balance },
            {
              withCredentials: true,
            }
          );
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
        } else {
      
          dataStatus = paymentIntent.status;

          if (dataStatus === 'processing') {
            const myDataLoadingLastTry = async () => {
              const { paymentIntent } = await stripe.retrievePaymentIntent(
                clientSecret
              );

              if (paymentIntent && paymentIntent.status === 'succeeded') {
                const { data } = await axios.post(
                  `${process.env.REACT_APP_API_DATA}/transaction/deposit`,
                  { paymentIntent, amount: balance },
                  {
                    withCredentials: true,
                  }
                );
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
              } else {
                setfailed(true);
                setfailedMessage(
                  'Payment failed, check your bank account, change'
                );
              }
            };
            setTimeout(myDataLoadingLastTry, 5000);
          } else {
            setfailed(true);
            setfailedMessage(
              'Payment failed, check your bank account, change '
            );
          }
        }
      };

      setTimeout(myFunc, 5000);
    } else if (result.paymentIntent.status === 'succeeded') {
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_DATA}/transaction/deposit`,
        { paymentIntent, amount: balance },
        {
          withCredentials: true,
        }
      );
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
    }

    if (result.error) {
      setLoading(false);
      setebanDialogue(false);
      // Show error to your customer.
      setfailed(true);
      setfailedMessage('Payment failed, check your bank account, change ');
    } else {
    }
  };

  //   })();
  // DE89 3704 0044 0532 0130 00

  const openSupportChat = () => {
    if (window.tidioChatApi) {
      setebanDialogue(false);
      setOpenDialogAfter(false);
      setsuccessFull(false);
      window.tidioChatApi.open();
    }
  };
  return (
    <>
      <div
        className="eban"
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          display: `${
            successFull === true
              ? 'none'
              : openDialogAfter === true
              ? 'none'
              : ''
          }`,
        }}
      >
        <div className={clsx(classes.imgibn, 'ibnImg')} style={{}}>
          <img alt="" src={'./image/SEPA.png'} />
        </div>
        <form onSubmit={handleSubmit}>
          <label>{t('iban_Your_Name')}</label>
          <input
            type="text"
            name="name"
            placeholder="Jhon Doe"
            onChange={(e) => setName(e.target.value)}
          />
          <label>{t('Your_Email')} </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>IBAN:</label>
          <div className="elements">
            <IbanElement options={IBAN_ELEMENT_OPTIONS} />
          </div>
          <button
            className="pay-button"
            type="submit"
            disabled={!stripe || loading === true}
          >
            {t('Deposit_btn')}
          </button>

          <div
            className="mandate-acceptance"
            style={{
              fontSize: '14px',
              marginBottom: '39px',
            }}
          >
            {t('mandate_text')}
          </div>
        </form>
      </div>

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
                  // width: '34%',
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
                    width: '34%',
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
                      {t('deposit_method_or_please_contact_our')}{' '}
                      <span
                        onClick={openSupportChat}
                        style={{
                          textDecoration: 'underline',
                          color: '#0041C1',
                          /* padding-left: 5px; */
                          cursor: 'pointer',
                        }}
                      >
                        {t('support_chat')}
                      </span>
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    marginBottom: '167px',
                    textAlign: 'center',
                    marginTop: '15px',
                    marginLeft: '20px',
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
    </>
  );
}

export default EbanMethod;
