import { IUniversityClass , GradeObject} from "../types/api_types";
import { DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { calcAllFinalGrade } from "../utils/calculate_grade";
/**
 * You might find it useful to have some dummy data for your own testing.
 * Feel free to write this function if you find that feature desirable.
 * 
 * When you come to office hours for help, we will ask you if you have written
 * this function and tested your project using it.
 */

/**
 * This is the component where you should write the code for displaying the
 * the table of grades.
 *
 * You might need to change the signature of this function.
 *
 */
interface GradeTableProps {
  selectedClassId: string;
}

interface Student {
  universityId: string
  name: string
  dateEnrolled: string
  status: string
}
const headers = {
  'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
};

export const GradeTable: React.FC<GradeTableProps> = ({selectedClassId}) => {
  const [studentData, setStudentData] = useState<GridRowsProp>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentIdsRes = await axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/class/listStudents/${selectedClassId}?buid=U07405824`, { headers });
        const studentIdsForClass = studentIdsRes.data;
  
        const [studentsRes, classRes, gradesRes, assignmentWeightsRes] = await Promise.all([
          Promise.all(studentIdsForClass.map((id: string) => axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/student/GetById/${id}?buid=U07405824`, { headers }))),
          axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/class/GetById/${selectedClassId}?buid=U07405824`, { headers }),
          Promise.all(studentIdsForClass.map((id: string) => axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${id}/${selectedClassId}?buid=U07405824`, { headers }))),
          axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${selectedClassId}?buid=U07405824`, { headers })
        ]);
  
        const fetchedStudents = studentsRes.map(res => res.data);
        const fetchedClass: IUniversityClass = classRes.data;
        const fetchedGrades = gradesRes.map(res => res.data);
  
        const assignmentWeights: { [key: string]: number } = {};
        assignmentWeightsRes.data.forEach((assignment: any) => {
          assignmentWeights[assignment.assignmentId] = assignment.weight;
        });
  
        const newRows: GridRowsProp = fetchedStudents.map((studentElem: any, index: number) => {
          const stu = studentElem[0];
          const studentGrade: { [key: string]: string } = fetchedGrades[index].grades[0];
          const finalGrade = calcAllFinalGrade(studentGrade, assignmentWeights);
          console.log('HERE is student name: ', stu.name);
          console.log('Here is the student object: ', stu);
          return {
            id: index + 1,
            'Student ID': stu.universityId,
            'Student Name': stu.name,
            'Class ID': selectedClassId,
            'Class Name': fetchedClass.title,
            'Semester': fetchedClass.semester,
            'Final Grade': finalGrade,
          };
        });
  
        setStudentData(newRows);
  
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    fetchData();
  
  }, [selectedClassId]);
  


    
  const columns: GridColDef[] = [
    { field: 'id', hide: true },
    { field: 'Student ID', headerName: 'Student ID', width: 110 },
    { field: 'Student Name', headerName: 'Student Name', width: 150 },
    { field: 'Class ID', headerName: 'Class ID', width: 80 },
    { field: 'Class Name', headerName: 'Class Name', width: 120 },
    { field: 'Semester', headerName: 'Semester', width: 120 },
    { field: 'Final Grade', headerName: 'Final Grade', width: 120 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={studentData} columns={columns} />
    </div>
  );
};

