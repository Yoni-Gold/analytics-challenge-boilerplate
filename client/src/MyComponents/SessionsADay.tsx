import React , {useCallback , useState , useEffect} from "react";
import { Event } from "../models/event";
import axios from 'axios';
import styled from 'styled-components';
import { LineChart , BarChart , Bar , Cell , Line , CartesianGrid , XAxis , YAxis , Tooltip , Legend } from 'recharts';

type Session = {
    date: string,
    count: number
}

const Title = styled.h1`
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-size: 2em;
font-family: 'Audiowide', cursive;
color: black;
text-shadow: 4px 4px 0px lightblue;
margin: 10px;
`;

const SessionsADay: React.FC = () => {

    const [info , setInfo] = useState<Array<Session> | null>(null);
    const [date, setDate] = useState<number>(new Date(new Date().toDateString()).getTime());

    const getInfo = () => {
        axios.get(`http://localhost:3001/events/by-days/${date}`).then(r => {setInfo(r.data)});
    };

    useEffect(getInfo , []);
    useEffect(getInfo , [date]);

    const findDays = (num : number) => {
        let now = Date.now();
        let day = 86400000;
        setDate(Math.floor((now - num) / day));
    }

    return <div>
        <Title>Sessions Each Day</Title>
        <input type='date' onChange={(e) => findDays(new Date(e.target.value).getTime())}></input>
        <LineChart width={300} height={150} data={info || []}>
        <Line name='sessions' type="monotone" dataKey="count" stroke="blue" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        </LineChart>
    </div>
}

export default SessionsADay;