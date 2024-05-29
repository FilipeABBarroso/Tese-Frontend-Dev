import styles from '../../../styles/Home.module.css';
import { nextClient } from '../../../lib/api-client';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function UpdateEntity({ name, acronym, url, setClose }) {
  const router = useRouter();
  const [entityName, setEntityName] = useState(name);
  const [entityAcronym, setEntityAcronym] = useState(acronym);
  const [entityUrl, setEntityUrl] = useState(url);

  const handleForm = async (e) => {
    e.preventDefault();
    nextClient
      .post('/updateEntity', {
        url: url,
        new_name: entityName,
        new_acronym: entityAcronym,
        new_url: entityUrl,
      })
      .then((res) => {
        console.log(res.data.message);
        router.reload();
      })
      .catch((err) => {
        if (err.response?.status === 400 && err.response.data) {
          console.log(err.response.data);
        }
      });
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <IconButton className={styles.closeButton} onClick={() => setClose(false)} aria-label="close" size="small">
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <form onSubmit={handleForm}>
          <p className={styles.description}>
            Update Entity
          </p>

          <div className={styles.entitiesForm}>
            <TextField id="name" label="Entity Name" variant="standard" defaultValue={entityName}
              onChange={(e) => {
                setEntityName(e.target.value);
              }} />
            <TextField id="name" label="Entity Acronym" variant="standard" defaultValue={entityAcronym}
              onChange={(e) => {
                setEntityAcronym(e.target.value);
              }} />
            <TextField id="url" label="Entity Url" variant="standard" defaultValue={entityUrl}
              onChange={(e) => {
                setEntityUrl(e.target.value);
              }} />
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}