import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table"
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AddEntities from '../AddEntitiesModal';
import UpdateEntity from '../UpdateEntity';


export default function ShowEntities() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [showAddEntities, setShowAddEntities] = useState(false);
  const [showUpdateEntities, setShowUpdateEntities] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState({});

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
    },,
    {
      id: 'updateDate',
      numeric: true,
      disablePadding: false,
      label: 'Updated At',
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

  useEffect(() => {
    nextClient
    .get('/getEntities')
    .then((res) => {
      setRows(createData(JSON.parse(res.data)));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Entities
      </h1>
      <IconButton onClick={() => setShowAddEntities(true)} className={styles.addButton}>
        <Add />
      </IconButton>
      {
        showAddEntities && (
          <AddEntities setClose={setShowAddEntities}/>
        )
      }
      {
        showUpdateEntities && (
          <UpdateEntity name={dataToUpdate.name} acronym={dataToUpdate.acronym} url={dataToUpdate.url} setClose={setShowUpdateEntities}/>
        )
      }
      {
        rows.length > 0 && (
          <Table rows={rows} headCellsData={headCellsData} setEntityUpdate={setDataToUpdate} setShowUpdateEntities={setShowUpdateEntities} />
        )
      }
    </div>
  );
}
