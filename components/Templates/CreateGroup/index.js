import styles from '../../../styles/Home.module.css';
import { nextClient } from '../../../lib/api-client';
import { useState } from "react";
import { useRouter } from "next/router";

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


export default function AddCampaign() {
  const router = useRouter()
  const [groupName, setGroupName] = useState('');
  const [tag, setTag] = useState('');
  const [entitiesNumb, setEntitiesNumb] = useState("Add");

  const handleForm = async (e) => {
    e.preventDefault();
    nextClient
    .post('/createCampaign', {
      entityName: entityName,
      entityUrl: entityUrl,
      tag: tag,
      groupName: groupName,
    })
    .then((res) => {
      console.log(res.data.message);
      router.push("/campaigns");
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
};

  return (
    <div className={styles.container}>
      <form onSubmit={handleForm}>
        <p className={styles.description}>
          Create new Group
        </p>
        
        <div className={styles.entitiesForm}>
          <TextField id="groupTag" label="Group Tag" variant="standard"
            onChange={(e) => {
              setTag(e.target.value);
            }}/>
            <TextField id="groupName" label="Group Name" variant="standard"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}/>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Add existing entities?
          </InputLabel>
          <Stack style={{alignSelf: "center"}} direction="row" spacing={2}>
            <Button defaultChecked className={styles.formChoiceButton} onClick={() => setEntitiesNumb("Add")}>Yes</Button>
            <Button className={styles.formChoiceButton} onClick={() => setEntitiesNumb("No")}>No</Button>
          </Stack>
          {
            entitiesNumb === "Add" ? (
              <Button style={{ color: 'black' }}>Add Entities</Button>
            ) : null
          }
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
