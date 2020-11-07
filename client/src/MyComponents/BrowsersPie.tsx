import React , {useCallback , useState , useEffect} from "react";
import { Event } from "../models/event";
import axios from 'axios';
import styled from 'styled-components';
import {PieChart, Pie, Legend, Tooltip} from 'recharts';

type PieInfo = [
    {name: 'chrome' , value: number},
    {name: 'ie' , value: number},
    {name: 'edge' , value: number},
    {name: 'firefox' , value: number},
    {name: 'safari' , value: number},
    {name: 'other' , value: number},
];

const Title = styled.h1`
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-size: 2em;
font-family: 'Audiowide', cursive;
color: black;
text-shadow: 4px 4px 0px lightblue;
margin: 10px;
`;

const BrowsetrsPie: React.FC = () => {

    const [info , setInfo] = useState<PieInfo>([
        {name: 'chrome' , value: 0},
        {name: 'ie' , value: 0},
        {name: 'edge' , value: 0},
        {name: 'firefox' , value: 0},
        {name: 'safari' , value: 0},
        {name: 'other' , value: 0},
    ]);

    const [render , setRender] = useState<boolean>(false);

    const getInfo = () => {
        let update = info;
        for (let i = 0; i < info.length; i++)
        {
            axios.get(`http://localhost:3001/events/all-filtered?offset=1000&browser=${info[i].name}`).then(r => {
                update[i].value = r.data.events.length;
            });
        }
        setInfo(update);
    };

    useEffect(() => {getInfo(); setTimeout(() => {setRender(true)} , 2000);} , []);

    return <div><Title>Most Used Browsers</Title>
    {render && <PieChart width={200} height={200}>
    <Pie dataKey="value" isAnimationActive={false} data={info} outerRadius={80} fill="#8884d8" label />
    <Tooltip />
    </PieChart>}</div>
}

export default BrowsetrsPie;