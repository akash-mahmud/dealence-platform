import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { useTranslation } from 'react-i18next';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);





const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    borderRadius: 4,
    boxShadow: 'none',
    // dropShadow: 'rgb(82 63 105 / 15%) 0px 0px 13px 0px',
  },
  img: {
    // height: 211,
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    borderRadius: 4,
    [theme.breakpoints.down('xs')]: {
      // height: 180,
    },
  },
}));

function SwipeableTextMobileStepper({ handleClickOpen }) {
  const { t } = useTranslation();
  const tutorialSteps = [
    {
      // label: 'San Francisco – Oakland Bay Bridge, United States',
      imgPath: t('img1'),
    },

    {
      // label: 'San Francisco – Oakland Bay Bridge, United States',
      imgPath: t('img2'),
    },
  ];
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <div
        className="myCarSoul"
        style={{
          boxShadow: 'rgb(82 63 105 / 15%) 0px 0px 13px 0px',
          borderRadius: '13px',
        }}
      >
        <AutoPlaySwipeableViews
          className="myCarasoulImg"
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {tutorialSteps.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <img
                  className={classes.img}
                  src={step.imgPath}
                  alt={step.label}
                  onClick={() => {
                    if (index === 0) {
                 handleClickOpen();
                    }
                  }}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </div>
    </div>
  );
}

export default SwipeableTextMobileStepper;