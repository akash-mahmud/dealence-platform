import React, { useEffect, useState } from "react";
import axios from "axios";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Checkbox, makeStyles } from "@material-ui/core";
import UploadFile from "../components/UploadFile";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
function Contract() {
  function getSteps() {
    return [
      "Accept contract policy",
      "Add Documents",
      "Submited the Application",
    ];
  }
  const [response, setResponse] = useState("12");
  let [loading, setLoading] = useState();
  let [fileData, setFileData] = useState();

  const history = useHistory();

  const [user, setUser] = useState(false);
  const [signed, setSigned] = useState();
  const [docs, setDocs] = useState();

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
        withCredentials: true,
      });

      if (user.isActive) {
        history.push("/");
      }

      if (!user && res.data) {
        setUser(res.data);
      }
      if (res.data.isContractSigned === true && user.isContractSigned) {
        setSigned(res.data.isContractSigned);
      }
      if (res.data.isDocumentUploaded === true && user.isDocumentUploaded) {
        setDocs(res.data.isDocumentUploaded);
      }
    };
    getUser();
  }, [user]);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);

  };
  const checkData = async () => {
    await axios.put(
      `${process.env.REACT_APP_API_DATA}/user/signContract`,
      {},
      { withCredentials: true }
    );
  };

  const uploadFileHandler = async (e) => {
    setFileData(e.target.files[0]);
  };
  const uploadImage = async () => {
    setLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append("image", fileData);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_DATA}/user/uploadDocument`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setResponse(res.data);
      if (res.data === "success") {
        setLoading(false);
      }
    } catch (error) {

    }

    setChecked(true);
  };
  function getStepContent(step) {
    switch (step) {
      case 0:
        return [
          <div>
            <Checkbox
              checked={checked}
              color="primary"
              inputProps={{ "aria-label": "secondary checkbox" }}
              onChange={handleChange}
              onClick={checkData}
            />
            <span style={{ fontSize: " 16px" }}>
              Yes, I accept all the terms and policies of the contract
            </span>
          </div>,
        ];
      case 1:
        return [
          <UploadFile
            uploadFileHandler={uploadFileHandler}
            uploadImage={uploadImage}
            response={response}
            loading={loading}
          />,
        ];
      case 2:
        return [
          <p style={{ marginBottom: " -999999999999999999999999px" }}>
            <Alert severity="info">
              <AlertTitle>Note</AlertTitle>
              Wait until the admin approves your application —{" "}
              <strong>Thank you!</strong>
            </Alert>
          </p>,
        ];

      default:
        return "Unknown step";
    }
  }
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const steps = getSteps();

  useEffect(() => {
    if (signed === true) {
      setActiveStep(1);
    }

    if (docs === true) {
      setActiveStep(2);
    }
  }, [signed, docs]);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}></Typography>
          </div>
        ) : (
          <div style={{ margin: "auto", width: "50%" }}>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={checked === !true}
              >
                {activeStep === steps.length - 1 ? (
                  <div style={{ backgroundColor: "none" }}>
                    <p>Submit</p>{" "}
                    {/* this button is workable until the last step comes */}
                  </div>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contract;
