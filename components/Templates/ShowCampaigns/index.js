import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table"
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';


export default function ShowCampaigns() {
  const router = useRouter();
  const [rows, setRows] = useState([]);

  const headCellsData = [
    {
      id: 'tag',
      numeric: false,
      disablePadding: true,
      label: 'Tag',
    },
    {
      id: 'type',
      numeric: true,
      disablePadding: false,
      label: 'Type',
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: false,
      label: 'Status',
    },
    {
      id: 'group',
      numeric: true,
      disablePadding: false,
      label: 'Group Tag',
    },
    {
      id: 'testsNumber',
      numeric: true,
      disablePadding: false,
      label: 'Tests',
    },
    {
      id: 'lastRun',
      numeric: true,
      disablePadding: false,
      label: 'Last Run',
    },
  ];

  function createData(data) {
    const parsedData = [];
    data.forEach(element => {
      parsedData.push({
        "id": element.tag,
        "c1": element.tag,
        "c2": element.type,
        "c3": element.status,
        "c4": element.group,
        "c5": element.tests,
        "c6": element.lastRun ? element.lastRun : "No runs"
      });
    });
    return parsedData;
  }

  useEffect(() => {
    nextClient
    .get('/getCampaigns')
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
        Campaigns
      </h1>
      <IconButton onClick={() => router.push("/createCampaign")} className={styles.addButton}>
        <Add />
      </IconButton>
      {
        rows.length > 0 && (
          <Table rows={rows} headCellsData={headCellsData} isCampaign/>
        )
      }
    </div>
  );
}
