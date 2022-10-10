import { Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ClipLoader from "react-spinners/ClipLoader";

function UploadFile(props) {
  const docsUp = () => {
    props.uploadImage();
  };
  return (
    <>
      <div>
        <p style={{ fontSize: "18px" }}>
          Upload Identity documents (Passport, Identity card or driving license)
        </p>
        <input type="file" onChange={props.uploadFileHandler } /> {props.response ==="success"?
        <Alert severity="success">Document Uploaded</Alert>: ''}
        {
          props.loading===true?
          <ClipLoader color="#3F51B5" loading="true" size={26} />:""
        }
        <Button
          variant="contained"
          color="default"
          onClick={docsUp}
          style={{ display: "block", marginTop: "8px" }}
          size={"small"}
        >
          Upload
        </Button>
      </div>
    </>
  );
}

export default UploadFile;
