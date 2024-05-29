import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/FileDownloadSharp';
import IconButton from '@mui/material/IconButton';
import { saveAs } from 'file-saver';


export default function ShowCampaignResults({ tag }) {
  const [data, setData] = useState();

  useEffect(() => {
    nextClient
    .get('/getCampaignResults', {params: {tag}})
    .then((res) => {
      setData(JSON.parse(res.data));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }, []);

  const handleDownload = (path, date) => {
    nextClient
    .get('/getCampaignResultFile', {params: {path}, responseType: 'arraybuffer', headers: {
      'Content-Type': 'blob',
      }})
    .then(response => {
      const blob = new Blob([response.data]);
      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tag}${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
  }

  const handleAccordion = () => {
    const listData = [];
    data.forEach(element => {
      listData.push(
        (
          <>
            <ListItem>
              <ListItemText>
                Test exexuted at {element.date} in group {element.group} with version {element.version}
              </ListItemText>
              <IconButton className={styles.closeButton} onClick={() => handleDownload(element.path, element.date)} aria-label="close" size="small">
                <DownloadIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
            { listData.length > 0 && (<Divider component="li" />)}
          </>
        )
      );
    });
    return listData;
  }

  const resultsStyle = {
    py: 0,
    minWidth: '60vw',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {tag}
      </h1>
      <h1 className={styles.description}>
        Results
      </h1>
      { 
        data && (
          <List sx={resultsStyle}>
            {handleAccordion()}
          </List>
        )
      }
    </div>
  );
}
