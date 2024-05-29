import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table";
import { useRouter } from "next/router";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UpdateEntity from '../UpdateEntity';
import CircularProgress from '@mui/material/CircularProgress';

export default function Group({ tag, version }) {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [addEntities, setAddEntities] = useState(false);
  const [entitiesData, setEntitiesData] = useState([]);
  const [dataToUpdate, setDataToUpdate] = useState({});
  const [showUpdateEntities, setShowUpdateEntities] = useState(false);

  const headCellsData = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'acronym',
      numeric: true,
      disablePadding: false,
      label: 'Acronym',
    },
    {
      id: 'url',
      numeric: true,
      disablePadding: false,
      label: 'Url',
    },
    {
      id: 'groups',
      numeric: true,
      disablePadding: false,
      label: 'Groups Number',
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

  const headCellsEntitiesToAddData = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'acronym',
      numeric: true,
      disablePadding: false,
      label: 'Acronym',
    },
    {
      id: 'url',
      numeric: true,
      disablePadding: false,
      label: 'Url',
    },
    {
      id: 'groups',
      numeric: true,
      disablePadding: false,
      label: 'Groups Number',
    },
    {
      id: 'creationDate',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'creationDate',
      numeric: true,
      disablePadding: false,
      label: '',
    },
  ];

  const createData = (data) => {
    const parsedData = [];
    data.forEach(element => {
      parsedData.push({
        "id": element.id,
        "c1": element.name,
        "c2": element.acronym,
        "c3": element.url,
        "c4": element.groups,
        "c5": element.creationDate,
        "c6": element.updateDate,
      });
    });
    return parsedData;
  }

  const createEntitiesToAddData = (data) => {
    const parsedData = [];
    data.forEach(element => {
      parsedData.push({
        "id": element.id,
        "c1": element.name,
        "c2": element.acronym,
        "c3": element.url,
        "c4": element.groups,
        "c5": element.creationDate
      });
    });
    return parsedData;
  }

  /*const handleForm = async (e) => {
    e.preventDefault();
    nextClient
    .post('/createEntities', {
      entityName: entityName,
      entityUrl: url,
      tag: tag,
      version: parseInt(version),
      createGroup: false,
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
  };*/

  useEffect(() => {
    nextClient
      .get('/getGroup', {params: {
        tag: tag
      }})
      .then((res) => {
        setRows(createData(JSON.parse(res.data)));
      })
      .catch((err) => {
          if(err.response?.status === 400 && err.response.data){
              console.log(err.response.data);
          }
      });
    nextClient
    .get('/getEntitiesWithout', {params: {tag: tag}})
    .then((res) => {
      setEntitiesData(createEntitiesToAddData(JSON.parse(res.data)));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }, [tag]);
  
  const handleDelete = (visibleRows, selected) => {
    const data = visibleRows.filter((r) => !selected.includes(r.id));
    nextClient.post('/removeGroupEntitiesRelation', {
      entities: data,
      tag: tag,
      version: parseInt(version)
    }).then((res) => {
      const nextVersion = parseInt(version) + 1;
      console.log(nextVersion);
      router.push({
        pathname: `/group/${tag}-v${nextVersion}/entities`
      });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }

  const handleEntitiesList = (visibleRows, selected) => {
    const data = visibleRows.filter((r) => selected.includes(r.id));
    nextClient
    .post('/createGroupEntitiesRelation', {
      entities: data,
      tag: tag,
      version: parseInt(version)
    })
    .then((res) => {
      const nextVersion = parseInt(version) + 1;
      console.log(nextVersion);
      router.push({
        pathname: `/group/${tag}-v${nextVersion}/entities`
      });
      setTimeout(() => {
        window.location.reload();
      }, 100); 
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {tag}
      </h1>
      <h3 className={styles.description}>
        Current Version: {version}
      </h3>
      <div className={styles.groupButtons}>
        <Stack direction="row" spacing={2}>
          <Button className={styles.formChoiceButton} onClick={() => setAddEntities(true)}>Add Entity</Button>
          <Button className={styles.formChoiceButton} onClick={() => router.push(`/campaign/create/${tag}-v${version}`)}>Create Campaign</Button>
        </Stack>
      </div>
      {addEntities && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <IconButton className={styles.closeButton} onClick={() => setAddEntities(false)} aria-label="close" size="small">
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <div className={styles.center}>
              <h2>Add Entity</h2>
              <Table 
                rows={entitiesData} 
                headCellsData={headCellsEntitiesToAddData} 
                isAdder
                handleSelection={handleEntitiesList}
              />
            </div>
          </div>
        </div>
      )}
      {
        showUpdateEntities && (
          <UpdateEntity name={dataToUpdate.name} acronym={dataToUpdate.acronym} url={dataToUpdate.url} setClose={setShowUpdateEntities}/>
        )
      }
      {
        rows.length > 0 ? (
          <Table 
            rows={rows} 
            headCellsData={headCellsData} 
            setEntityUpdate={setDataToUpdate} 
            setShowUpdateEntities={setShowUpdateEntities} 
            enableDelete={true}
            handleDelete={handleDelete}
          />
        ) : (<CircularProgress/>)
      }
    </div>
  );
}
