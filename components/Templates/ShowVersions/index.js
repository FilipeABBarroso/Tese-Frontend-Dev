import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/FileDownloadSharp';
import IconButton from '@mui/material/IconButton';

export default function ShowVersions({ tag, version }) {
  const router = useRouter();
  const [data, setData] = useState();

  useEffect(() => {
    nextClient
        .get('/getGroupVersions', {params: {
          tag: tag
        }})
        .then((res) => {
          setData(JSON.parse(res.data));
        })
        .catch((err) => {
            if(err.response?.status === 400 && err.response.data){
                console.log(err.response.data);
            }
        });
  }, [tag]);

  const handleAccordion = () => {
    const accordionData = [];
    data.forEach(element => {
      accordionData.push(
        (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Version {element.version} - {element.date}
            </AccordionSummary>
            <AccordionDetails>
              {
                element.entities.length < 1 ? (
                  <>
                    Empty Group
                  </>
                ) : (
                  <>
                    <div className={styles.accordionContentHeader}>
                      <p>Acronym</p>
                      <p>Name</p>
                      <p>Url</p>
                    </div>
                    {element.entities.map((entity, index) => (
                      <div key={index} className={styles.accordionContent}>
                        <div>{entity.acronym}</div>
                        <div>{entity.name}</div>
                        <div>{entity.url}</div>
                      </div>
                    ))}
                  </>
                )
              }
            </AccordionDetails>
          </Accordion>
        )
      );
    });
    return accordionData;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {tag}
      </h1>
      <h3 className={styles.description}>
        Current Version: {version}
      </h3>
      { 
        data && (
          <div className={styles.AccordionWrapper}>
            {handleAccordion()}
          </div>
        )
        }
    </div>
  );
}
