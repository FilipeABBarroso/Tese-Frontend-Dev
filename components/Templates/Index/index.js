import styles from '../../../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { nextClient } from '../../../lib/api-client';
import Table from "../../Table"
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';


export default function Index() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome!!
      </h1>
    </div>
  );
}
