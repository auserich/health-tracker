import React, {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import "./MainDashboard.css";
import axios from 'axios';

const MainDashboard = () => {

    const [username,setUsername] = useState([]);
    const [currCal,setCal] = useState([]);
    const [currWater,setWater] = useState([]);
    const [currMin,setMin] = useState([]);
    const [currBurn,setBurn] = useState([]);
    const [currSleep,setSleep] = useState([]);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });

    useEffect( () => {
        setUsername(localStorage.getItem("username"));

        const currDate = new Date().toJSON().slice(0,10);

        const getUser = async () => {
            try {
                const response = await axiosInstance.get('/api/user/whoami');
                localStorage.setItem("Id", response.data.id);
                return response.data;
                
              } catch (error) {
                console.error('Error:', error);
              }

        }

        const getCalorie = async () => {
            try {
                const response = await axiosInstance.get(`/api/meal/calories/${localStorage.getItem("Id")}/${currDate}`);
                setCal(response.data);
                return response.data;                
              } catch (error) {
                console.error('Error:', error);
              }

        }

        const getWater = async () => {
            try {
                const response = await axiosInstance.get(`/api/water/ounces/${localStorage.getItem("Id")}/${currDate}`);
                setWater(response.data);
                return response.data;                
              } catch (error) {
                console.error('Error:', error);
              }

        }

        const getExercise = async () => {
            try {
                const response = await axiosInstance.get(`/api/user-exercises/minutes/${localStorage.getItem("Id")}/${currDate}`);
                setMin(response.data);

                const response2 = await axiosInstance.get(`/api/user-exercises/calories/${localStorage.getItem("Id")}/${currDate}`);
                setBurn(response2.data);
                return response.data;                
              } catch (error) {
                console.error('Error:', error);
              }

        }

        const getSleep = async () => {
            var lastDate = new Date();
            lastDate.setDate(lastDate.getDate() - 1);
            try {
                const response = await axiosInstance.get(`/api/sleep/total/${localStorage.getItem("Id")}/${lastDate.toJSON().slice(0,10)}`);
                setSleep(response.data);
                return response.data;                
              } catch (error) {
                console.error('Error:', error);
              }

        }

        getUser().then(getCalorie).then(getWater).then(getExercise).then(getSleep);

      });
      

    function navFood() {
        navigate("/meal")
      }

      function navWater() {
        navigate("/water")
      }

      function navExercise() {
        navigate("/exercise-tracker")
      }

      function navSleep() {
        navigate("/sleep")
      }

    return(
        <div>
            <div className="main-header">
                <h1>DASHBOARD</h1>
                <p>{username}</p>
            </div>

            <div className="main-body">
                <div className="widget" onClick={navFood}>
                    <h1>Calorie Log</h1>
                    <p>Calories Consumed Today: {currCal} Calorie(s)</p>
                    <p>Calories Remaining Today: [ph]</p>

                    <div className="graph">
                        <p>[ph] bar graph of calories consumed this week</p>
                    </div>
                </div>

                <div className="widget" onClick={navWater}>
                    <h1>Water Log</h1>
                    <p>Water Consumed Today: {currWater} Ounce(s)</p>
                    <p>Water Remaining Today: [ph]</p>

                    <div className="graph">
                        <p>[ph] bar graph of calories consumed this week</p>
                    </div>
                </div>

                <div className="widget" onClick={navExercise}>
                    <h1>Exercise Log</h1>
                    <p>Time Spent Active Today: {currMin} Minute(s)</p>
                    <p>Calories Burned Today: {currBurn} Calorie(s)</p>

                    <div className="graph">
                        <p>[ph] bar graph of calories consumed this week</p>
                    </div>
                </div>

                <div className="widget" onClick={navSleep}>
                    <h1>Sleep Log</h1>
                    <p>Minutes Slept Most Recently: {currSleep} Minutes</p>
                    <p>Sleep Goal: [ph]</p>

                    <div className="graph">
                        <p>[ph] bar graph of calories consumed this week</p>
                    </div>
                </div>
            </div>

            <div className="main">
                <a href="http://localhost:3000/"><button>Logout</button></a>
            </div>
        </div>
    );
};

export default MainDashboard;
