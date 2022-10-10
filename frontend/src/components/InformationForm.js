import React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import { NotificationManager } from 'react-notifications';
import { withTranslation, WithTranslation } from 'react-i18next';
import Title from '../components/Title';

/**
 * I assume we need a function to bundle all the information
 * together and send it over to the page where this form is
 * being used, and that should be it
 *
 * Maybe validation should be handled within this component
 */
class InformationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      iban: '',
      idFront: null,
      idBack: null,
      proofAddress: null,
      successSnackbarOpen: false,
      isDocumentUploaded: false,
      disbaled: false,
    };
  }

  componentDidMount() {
    const getUser = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_DATA}/user/me`, {
        withCredentials: true,
      });


      if (res.data) {
        this.setState({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          phone: res.data.phone_number == null ? '' : res.data.phone_number,
          address: res.data.address == null ? '' : res.data.address,
          city: res.data.city == null ? '' : res.data.city,
          state: res.data.state == null ? '' : res.data.state,
          zip: res.data.zip == null ? '' : res.data.zip,
          country: res.data.country == null ? '' : res.data.country,
          iban: res.data.iban == null ? '' : res.data.iban,
          isDocumentUploaded: res.data.isDocumentUploaded,
          isContractSigned: res.data.isContractSigned,
     
        });
      }
    };

    getUser();
  }

  handleSubmit() {
         this.setState({ disbaled: true });
        //  disbaled: false,
    if (this.state.idFront == null) {
      NotificationManager.error(
        this.props.t('Add_photos'),
        this.props.t('Missing_documents')
      );

      return;
    } else if (this.state.idBack == null) {
      NotificationManager.error(
        this.props.t('Add_photos'),
        this.props.t('Missing_documents')
      );

      return;
    } else if (this.state.proofAddress == null) {
      NotificationManager.error(
        this.props.t('Add_photos'),
        this.props.t('Missing_documents')
      );

      return;
    }

    const updateUserInfo = async () => {
      const payload = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        phone_number: this.state.phone,
        address: this.state.address,
        state: this.state.state,
        city: this.state.city,
        zip: this.state.zip,
        country: this.state.country,
        id_front: this.state.idFront,
        id_back: this.state.idBack,
        proof_address: this.state.proofAddress,
      };

      const res = await axios.put(
        `${process.env.REACT_APP_API_DATA}/user/updateInfo`,
        payload,
        { withCredentials: true }
      );

      if (res.status == 200) {
        NotificationManager.success(
          this.props.t('the_info'),
          this.props.t('Submitted_successfully')
        );
        setTimeout(()=> {
    window.location.reload();
        }, 1000)
    
      } else {
        NotificationManager.error(
          this.props.t('unable'),
          this.props.t('Error')
        );
      }
    };

    updateUserInfo();
  }

  /**
   *
   * @param {array} files An array of files to be uploaded, assumed to be of length 1
   * @param {boolean} isFront Boolean indicating whether the user uploaded the front or back of his/her ID
   * @returns
   */
  handleFileUpload(files, isFront, isProof = false) {
    let stateField = isFront ? 'idFront' : 'idBack';
    if (isProof) stateField = 'proofAddress';
    if (files.length == 0) {
      // Remove file data if the user removed the
      // file from the dropzone area
      this.setState({
        [stateField]: null,
      });

      return;
    }

    let idFile = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      this.setState({
        [stateField]: event.target.result.split(',')[1],
      });
    };

    reader.readAsDataURL(idFile);
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="firstName"
              name="firstName"
              label={t('Name')}
              value={this.state.firstName}
              onChange={(event) => {
                this.setState({ firstName: event.target.value });
              }}
              fullWidth
              autoComplete="given-name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="lastName"
              name="lastName"
              label={t('Last_Name')}
              value={this.state.lastName}
              onChange={(event) => {
                this.setState({ lastName: event.target.value });
              }}
              fullWidth
              autoComplete="family-name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="address"
              name="address"
              label={t('Addressm')}
              value={this.state.address}
              onChange={(event) => {
                this.setState({ address: event.target.value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="city"
              name="city"
              label={t('Cityd')}
              value={this.state.city}
              onChange={(event) => {
                this.setState({ city: event.target.value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled={this.state.isDocumentUploaded}
              id="state"
              name="state"
              label={t('Region')}
              value={this.state.state}
              onChange={(event) => {
                this.setState({ state: event.target.value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="zip"
              name="zip"
              label={t('ZIPCode')}
              value={this.state.zip}
              onChange={(event) => {
                this.setState({ zip: event.target.value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled={this.state.isDocumentUploaded}
              id="country"
              name="country"
              label={t('Country')}
              value={this.state.country}
              onChange={(event) => {
                this.setState({ country: event.target.value });
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>

          {!this.state.isDocumentUploaded && (
            <Grid item xs={12}>
              <Title>{t('Upload_your_documents')}</Title>
              <Grid item xs={12}>
                <DropzoneArea
                  filesLimit={1}
                  onChange={(files) => {
                    this.handleFileUpload(files, true);
                  }}
                  acceptedFiles={['image/*', 'application/pdf']}
                  dropzoneText={t('front_card')}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <DropzoneArea
                  filesLimit={1}
                  onChange={(files) => {
                    this.handleFileUpload(files, false);
                  }}
                  acceptedFiles={['image/*', 'application/pdf']}
                  dropzoneText={t('front_back')}
                />
              </Grid>
              <br />
              <Typography variant="h6" gutterBottom>
                {t('Proof_of_ID')}
              </Typography>
              <Typography color="textSecondary">
                {t('in_case')} <br />
                {t('documents_must')}
                <li>{t('Full_copy')}</li>
                <li>{t('Document_must_be_in_color')}</li>
                <li>{t('Your_full_name')}</li>
                <li>{t('A_unique_ID_number')}</li>
                <li>{t('Your_birthdate')}</li>
                <li>{t('Your_place_of_birth')}</li>
                <li>{t('A_visible_photo')}</li>
                <li>{t('Your_nationality')}</li>
                <li>{t('Issue_date')}</li>
                <li>{t('Expiry_date')}</li>
              </Typography>
              <br /> <br />
              <Grid item xs={12}>
                <DropzoneArea
                  filesLimit={1}
                  onChange={(files) => {
                    this.handleFileUpload(files, false, true);
                  }}
                  acceptedFiles={['image/*', 'application/pdf']}
                  dropzoneText={t('Proof_of_Residence')}
                />
              </Grid>
              <br />
              <Typography variant="h6" gutterBottom>
                {t('Proof_of_Residence')}
              </Typography>
              <Typography color="textSecondary">
                {t('bank_statement')} <br />
                {t('doc_follow')} <br />
                <li>{t('Full_copy_of_the_document_showing_all_corners')}</li>
                <li>{t('Your_full_name')}</li>
                <li>{t('your_physical')}</li>
                <li>{t('Recent_date')}</li>
                <li>{t('Utility_Bill')}</li>
              </Typography>
              <br /> <br />
              <Typography color="textSecondary">
                *{t('for_further')}{' '}
                <a
                  style={{ color: '#0041C1' }}
                  href="mailto:support@dealence.com"
                >
                  support@dealence.com
                </a>
              </Typography>
              <br />
              <Grid item xs={12}>
                <Button
                  onClick={() => this.handleSubmit()}
                  variant="contained"
                  color="primary"
                  disabled={this.state.disbaled}
                >
                  {t('Send')}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </React.Fragment>
    );
  }
}

export default withTranslation()(InformationForm);
