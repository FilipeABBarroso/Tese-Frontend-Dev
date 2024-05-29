import styles from '../../../styles/Home.module.css';
import { nextClient } from '../../../lib/api-client';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';

export default function AddEntities({ setClose }) {
  const router = useRouter()
  const [entityName, setEntityName] = useState('');
  const [entityAcronym, setEntityAcronym] = useState('');
  const [entityUrl, setEntityUrl] = useState('');
  const [groupName, setGroupName] = useState('');
  const [tag, setTag] = useState('');
  const [entitiesNumb, setEntitiesNumb] = useState(1);
  const [groups, setGroups] = useState([]);
  const [groupOption, setGroupOption] = useState("No Group");

  const handleForm = async (e) => {
    e.preventDefault();
    nextClient
      .post('/createEntities', {
        entitiesList: [{ name: entityName, acronym: entityAcronym, url: entityUrl }],
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

  /*useEffect(() => {
    nextClient
      .get('/getGroups')
      .then((res) => {
        setGroups(JSON.parse(res.data));
      })
      .catch((err) => {
        if (err.response?.status === 400 && err.response.data) {
          console.log(err.response.data);
        }
      });
  }, []);*/

  const handleCheckboxChange = (e, tag, groupName) => {
    setGroupName(groupName);
    setTag(tag);
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleMultipleEntities = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 2 });
      nextClient
        .post('/createEntities', {
          entitiesList: jsonData,
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
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popup_inner}>
        <IconButton className={styles.closeButton} onClick={() => setClose(false)} aria-label="close" size="small">
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <form onSubmit={handleForm}>
          <p className={styles.description}>
            Create Entities
          </p>
          <div className={styles.entitiesForm}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              How many entities?
            </InputLabel>
            <Stack direction="row" spacing={2}>
              <Button defaultChecked className={styles.formChoiceButton} onClick={() => setEntitiesNumb(1)}>One</Button>
              <Button className={styles.formChoiceButton} onClick={() => setEntitiesNumb(2)}>Multiple</Button>
            </Stack>
            {
              entitiesNumb > 1 ? (
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  onChange={handleMultipleEntities}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" />
                </Button>
              ) : (
                <>
                  <TextField id="name" label="Entity Name" variant="standard"
                    onChange={(e) => {
                      setEntityName(e.target.value);
                    }} />
                  <TextField id="name" label="Entity Acronym" variant="standard"
                    onChange={(e) => {
                      setEntityAcronym(e.target.value);
                    }} />
                  <TextField id="url" label="Entity Url" variant="standard"
                    onChange={(e) => {
                      setEntityUrl(e.target.value);
                    }} />
                </>
              )
            }
            { /*<InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Group
                </InputLabel>
                <Stack direction="row" spacing={2}>
                  <Button defaultChecked className={styles.formChoiceButton} onClick={() => setGroupOption("Create")}>Create Group</Button>
                  <Button className={styles.formChoiceButton} onClick={() => setGroupOption("Add")}>Add to existing Group</Button>
                  <Button className={styles.formChoiceButton} onClick={() => setGroupOption("No Group")}>No Group</Button>
                </Stack>
                {
                  groupOption === "Create" ? (
                    <>
                      <TextField id="groupTag" label="Group Tag" variant="standard"
                      onChange={(e) => {
                        setTag(e.target.value);
                      }}/>
                      <TextField id="groupName" label="Group Name" variant="standard"
                      onChange={(e) => {
                        setGroupName(e.target.value);
                      }}/>
                    </>
                  ) : groupOption === "Add" && groups.length > 0 ? (
                    <>
                      <div className={styles.table}>
                        <div className={styles.tableHeader}>
                          <div className={styles.headerCell}>Select</div>
                          <div className={styles.headerCell}>Tag</div>
                          <div className={styles.headerCell}>Name</div>
                        </div>
                        <div className={styles.tableBody} key="table-body">
                          {groups.map((row) => (
                            <div className={styles.tableRow} key={row.id}>
                              <div className={styles.cell}>
                                <input
                                  type="checkbox"
                                  checked={tag === row.tag}
                                  onChange={(e) => handleCheckboxChange(e, row.tag, row.name)}
                                />
                              </div>
                              <div className={styles.cell}>{row.tag}</div>
                              <div className={styles.cell}>{row.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null
                          */}
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
