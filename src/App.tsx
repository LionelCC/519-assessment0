import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Select, Typography, MenuItem } from "@mui/material";
/**
 * You will find globals from this file useful!
 */
import { GET_DEFAULT_HEADERS } from "./globals";
import { IUniversityClass } from "./types/api_types";
import { GradeTable } from "./components/GradeTable";
import axios from 'axios';
import { config } from "process";

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  /**
   * This is JUST an example of how you might fetch some data(with a different API).
   * As you might notice, this does not show up in your console right now.
   * This is because the function isn't called by anything!
   *
   * You will need to lookup how to fetch data from an API using React.js
   * Something you might want to look at is the useEffect hook.
   *
   * The useEffect hook will be useful for populating the data in the dropdown box.
   * You will want to make sure that the effect is only called once at component mount.
   *
   * You will also need to explore the use of async/await.
   *
   */
  const fetchSomeData = async () => {
    try {
      const config = {
        headers: GET_DEFAULT_HEADERS()
      };
      
      const response = await axios.get('https://spark-se-assessment-api.azurewebsites.net/api/class/listBySemester/fall2022?buid=U07405824', 
      {
        headers: {
          'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
        }
      });
      
      /**if (response.status === 200){
        const classes = response.data;
        setClassList(classes);
      }*/
      if (response.data && Array.isArray(response.data)) {
        setClassList(response.data);
      }
    } catch (error){
      console.error('Error fetching data');
    }
    /**
     * const res = await fetch("https://cat-fact.herokuapp.com/facts/", {
      method: "GET",
    });
    const json = await res.json();
    console.log(json); */
    
  };

  const fetchStudentData = async(classId: string) => {
    const res = await axios.get('https://spark-se-assessment-api.azurewebsites.net/api/student/findByStatus/enrolled?buid=U07405824',
    {
      headers: {
        'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
      }
    });
    setStudents(res.data);
  }

  useEffect(() => {
    fetchSomeData();
  }, []);

  useEffect(() => {
    if(currClassId) {
      fetchStudentData(currClassId);
    }
  }, [currClassId]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            <Select fullWidth={true} label="Class" value={currClassId} onChange={(e) => setCurrClassId(e.target.value as string)}>
              <MenuItem value = "">
                <em>None</em>
              </MenuItem>
              {classList.map((uniClass, index) => (
                <MenuItem key={uniClass.classId} value={uniClass.classId}>
                  {uniClass.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <GradeTable selectedClassId={currClassId}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
