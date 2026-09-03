import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverURL } from "../App";
import Step3Report from "../components/Step3Report";

const InterviewReport = () => {
  const [report, setReport] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function reportData() {
      try {
        const result = await axios.get(
          serverURL + `/api/interview/getinterviewdetail/${id}`,
          { withCredentials: true },
        );
        console.log(result.data);
        setReport(result.data);
      } catch (error) {
        console.log("Error while fetching interview history report : ", error);
      }
    }
    reportData();
  }, []);

  return <Step3Report interviewReport={report} />;
};

export default InterviewReport;
