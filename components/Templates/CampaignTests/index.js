import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table";
import { useRouter } from "next/router";
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UpdateEntity from '../UpdateEntity';

export default function CampaignTests({ tag }) {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [addTest, setAddTest] = useState(false);
  const [testsData, setTestsData] = useState([]);
  const [testsSelected, setTestsSelected] = useState([]);

  const headCellsData = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Test',
    },
    {
      id: '',
      numeric: true,
      disablePadding: false,
      label: '',
    },
    {
      id: '',
      numeric: true,
      disablePadding: false,
      label: '',
    },
    {
      id: '',
      numeric: true,
      disablePadding: false,
      label: '',
    },
    {
      id: '',
      numeric: true,
      disablePadding: false,
      label: '',
    },
    {
      id: '',
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
      });
    });
    return parsedData;
  }

  useEffect(() => {
    nextClient
      .get('/getCampaignTests', {params: {
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
    .get('/getUnusedCampaignTests', {params: {tag: tag}})
    .then((res) => {
      setTestsData(JSON.parse(res.data));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }, [tag]);

  const handleCheckboxChange = (e, index) => {
    if(testsSelected.includes(index)){
      setTestsSelected(testsSelected.filter((el) => el !== index));
    } else {
      setTestsSelected([...testsSelected, index]);
    }
  }

  
  const handleDelete = (visibleRows, selected) => {
    const data = visibleRows.filter((r) => !selected.includes(r.id));
    nextClient.post('/removeTestsServices', {
      tests: data,
      tag: tag
    }).then((res) => {
      router.push({
        pathname: `/campaign/${tag}/tests`
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

  const handleTestsList = () => {
    const data = [];
    testsSelected.forEach(i => data.push({id: testsData[i].id}));
    nextClient
    .post('/createNewTestsServicesVersion', {
      tests: data,
      tag: tag
    })
    .then((res) => {
      router.push({
        pathname: `/campaign/${tag}/tests`
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

  const handleClosePopup = () => {
    setAddTest(false); 
    setTestsSelected([]);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {tag}
      </h1>
      <h3 className={styles.description}>
        Tests
      </h3>
      <div className={styles.groupButtons}>
        <Stack direction="row" spacing={2}>
          <Button className={styles.formChoiceButton} onClick={() => setAddTest(true)}>Add Test</Button>
        </Stack>
      </div>
      {addTest && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <IconButton className={styles.closeButton} onClick={() => handleClosePopup()} aria-label="close" size="small">
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <div className={styles.center}>
              <h2>Add Test</h2>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.headerCell}>Select</div>
                  <div className={styles.headerCell}>Name</div>
                </div>
                <div className={styles.tableBody} key="table-body">
                  {testsData.map((row, index) => (
                    <div className={styles.tableRow} key={row.id}>
                      <div className={styles.cell}>
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(e, index)}
                        />
                      </div>
                      <div className={styles.cell}>{row.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleTestsList} className={styles.submitButton}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {
        rows.length > 0 ? (
          <Table 
            rows={rows} 
            headCellsData={headCellsData} 
            enableDelete={true}
            handleDelete={handleDelete}
          />
        ) : (<CircularProgress/>)
      }
    </div>
  );
}
