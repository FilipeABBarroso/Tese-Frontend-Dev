import styles from '../../../styles/Home.module.css';
import { nextClient } from '../../../lib/api-client';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from "../../Table";
import Alert from '@mui/material/Alert';



export default function AddCampaign({ receivedTag=undefined, receivedVersion=undefined }) {
  const router = useRouter();
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const [campaignName, setCampaignName] = useState('');
  const [tag, setTag] = useState(receivedTag);
  const [version, setVersion] = useState(receivedVersion);
  const [date, setDate] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [specificDates, setSpecificDates] = useState([]);
  const [testsSelected, setTestsSelected] = useState([]);
  const [tests, setTests] = useState([]);
  const [scheduleOption, setScheduleOption] = useState("Automate");
  const [automateOption, setAutomateOption] = useState("daily");
  const [rows, setRows] = useState([]);
  const [addGroup, setAddGroup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  
  const handleForm = async (e) => {
    e.preventDefault();
    if(scheduleOption === "Automate" && startDate?.$d > endDate?.$d) {
      setErrorMessage("Start date bigger than end date");
      setShowError(true);
    } else {
      nextClient
      .post('/createCampaign', {
        campaignTag: campaignName,
        groupId: tag,
        groupVersion: parseInt(version),
        testsId: testsSelected.map((o) => o.id),
        campaignType: scheduleOption === "Automate" ? automateOption : "personalized",
        dates: scheduleOption === "Automate" ? [startDate?.$d, endDate?.$d] : specificDates,
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
    }
  };

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
    .get('/getTests')
    .then((res) => {
      setTests(JSON.parse(res.data));
    })
    .catch((err) => {
        if(err.response?.status === 400 && err.response.data){
            console.log(err.response.data);
        }
    });
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

  const handleChange = (event) => {
    setAutomateOption(event.target.value);
  };

  const handleDate = (event) => {
    if(!specificDates.includes(date?.$d)) {
      setSpecificDates([...specificDates, date?.$d]);
    } else {
      console.log("date already picked");
    }
  };

  const handleGroupSelect = (visibleRows, selected) => {
    const version = visibleRows.filter((r) => r.id == selected)[0].c4
    setTag(selected[0]);
    setVersion(version);
    setAddGroup(false)
  }

  return (
    <>
       { tests.length > 0 && (
      <div className={styles.container}>
        <form onSubmit={handleForm}>
          <p className={styles.description}>
            Create Campaign
          </p>
          {
            showError && (
              <Alert severity="error">{errorMessage}</Alert>
            )
          }
          {addGroup && (
            <div className={styles.popup}>
              <div className={styles.popup_inner}>
                <IconButton className={styles.closeButton} onClick={() => setAddGroup(false)} aria-label="close" size="small">
                  <CloseIcon fontSize="inherit" />
                </IconButton>
                <div className={styles.center}>
                  <h2>Add Entity</h2>
                  <Table 
                    rows={rows} 
                    headCellsData={headCellsData}
                    sigleSelection
                    handleSelection={handleGroupSelect}
                    selectedData={tag}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles.entitiesForm}>
          <TextField id="campaign-name" label="Campaign Name" variant="standard" 
            onChange={(e) => {
              setCampaignName(e.target.value);
            }}/>
            <InputLabel variant="standard" sx={{color:'black', fontSize:18}} htmlFor="uncontrolled-native">
              Group
            </InputLabel>
            {
              receivedTag && receivedVersion ? (
                <>
                  Group: {receivedTag} Version: {receivedVersion}
                </>
              ) : <>
                    {
                      tag != undefined && version != undefined && (
                        <>
                          Group: {tag} Version: {version}
                        </>
                      )
                    }
                    <Button className={styles.formChoiceButton} onClick={() => setAddGroup(true)}>Pick Group</Button>
                  </>
            }
            <InputLabel variant="standard" sx={{color:'black', fontSize:18}} htmlFor="uncontrolled-native">
              Tests
            </InputLabel>
            <Autocomplete
              multiple
              id="checkboxes-tests"
              options={tests}
              disableCloseOnSelect
              onChange={(e, option) => setTestsSelected(option)}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={testsSelected.some((element) => element.id === option.id)}
                  />
                  {option.name}
                </li>
              )}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField {...params} label="Tests List" placeholder="Test Name" />
              )}
            />
            <InputLabel variant="standard" sx={{color:'black', fontSize:18}} htmlFor="uncontrolled-native">
              Scheduling
            </InputLabel>
            <Stack direction="row" spacing={2}>
              <Button defaultChecked className={styles.formChoiceButton} onClick={() => setScheduleOption("Automate")}>Automate Date</Button>
              <Button className={styles.formChoiceButton} onClick={() => setScheduleOption("Specific")}>Specific Dates</Button>
            </Stack>
            {
              scheduleOption === "Automate" ? (
                <>
                  <Select
                    labelId="interval-label"
                    id="interval-id"
                    value={automateOption}
                    onChange={handleChange}
                    autoWidth
                    label="Interval"
                  >
                    <MenuItem value={"daily"}>Daily</MenuItem>
                    <MenuItem value={"weekly"}>Weekly</MenuItem>
                    <MenuItem value={"montly"}>Montly</MenuItem>
                  </Select>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker disablePast onChange={(newValue) => setStartDate(newValue)}/>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker disablePast onChange={(newValue) => setEndDate(newValue)}/>
                  </LocalizationProvider>
                </>
              ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker disablePast onChange={(newValue) => setDate(newValue)}/>
                    <Button className={styles.formChoiceButton} onClick={() => handleDate()}>Add Date</Button>
                  </LocalizationProvider>
              )
            }
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
       )}
    </>
  );
}
