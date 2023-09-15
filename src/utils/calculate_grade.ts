/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass } from "../types/api_types";
import axios from 'axios';

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentID: string,
  classID: string,
  klass: IUniversityClass
): Promise<number> {
  const headers = {
    'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
  };

  const gradesResponse = await axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/student/listGrades/${studentID}/${classID}?buid=U07405824`, { headers });
  const weightsResponse = await axios.get(`https://spark-se-assessment-api.azurewebsites.net/api/class/listAssignments/${classID}?buid=U07405824`, { headers });
  
  const assignmentWeights = Object.fromEntries(weightsResponse.data.map((assignment: any) => [assignment.assignmentId, assignment.weight]));

  const studentGrades = gradesResponse.data.grades[0];

  let weightedTotal = 0;
  let weightSum = 0;

  for (const [assignment, grade] of Object.entries(studentGrades)) {
    const weight = assignmentWeights[assignment] || 0;  
    weightedTotal += Number(grade) * weight;
    weightSum += weight;
  }

  return weightedTotal / weightSum;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export function calcAllFinalGrade(
  studentGrades: { [key: string]: string }, // grades are strings
  assignmentWeights: { [key: string]: number }
): number {
  let finalGrade = 0;

  for (const [assignmentId, grade] of Object.entries(studentGrades)) {
    const weight = assignmentWeights[assignmentId] || 0; // use 0 if weight not found
    finalGrade += Number(grade) * weight;                // convert grade to number
  }

  return finalGrade;
}