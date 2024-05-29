import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table"
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

export default function ShowGroups() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [tag, setTag] = useState('');
  const [rows, setRows] = useState([]);
  const [createGroup, setCreateGroup] = useState(false);

  const headCellsData = [
    {
      id: 'tag',
      numeric: false,
      disablePadding: true,
      label: 'Tag',
    },
    {
      id: 'entities',
      numeric: true,
      disablePadding: false,
      label: 'Entities',
    },
    {
      id: 'campaigns',
      numeric: true,
      disablePadding: false,
      label: 'Campaigns',
    },
    {
      id: 'version',
      numeric: true,
      disablePadding: false,
      label: 'Version',
    },
    {
      id: 'creationDate',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'updateDate',
      numeric: true,
      disablePadding: false,
      label: 'Updated At',
    },
  ];

  function createData(data) {
    const parsedData = [];
    data.forEach(element => {
      parsedData.push({
        "id": element.id,
        "c1": element.id,
        "c2": element.entitiesCount,
        "c3": element.campaignsCount,
        "c4": element.version,
        "c5": element.creationDate,
        "c6": element.updateDate,
      });
    });
    return parsedData;
  }

  useEffect(() => {
    nextClient
    .get('/getGroups')
    .then((res) => {
      setRows(createData(JSON.parse(res.data)));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }, []);

  const handleForm = async (e) => {
    e.preventDefault();
    nextClient
    .post('/createGroup', {
      tag: tag,
    })
    .then((res) => {
      console.log(res.data.message);
      router.reload();
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Groups
      </h1>
      <IconButton onClick={() => setCreateGroup(true)} className={styles.addButton}>
        <Add />
      </IconButton>
      {createGroup && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <IconButton className={styles.closeButton} onClick={() => setCreateGroup(false)} aria-label="close" size="small">
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <h2>Create new Group</h2>
            <form onSubmit={handleForm}>
              <div className={styles.entitiesForm}>
                <TextField className={styles.popupInput} id="groupTag" label="Group Tag" variant="standard"
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}/>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {
        rows.length > 0 && (
          <Table rows={rows} headCellsData={headCellsData} isGroup={true} />
        )
      }
    </div>
  );
}
