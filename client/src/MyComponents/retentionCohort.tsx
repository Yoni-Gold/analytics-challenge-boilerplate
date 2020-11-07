import React , {useCallback , useState , useEffect} from "react";
import { Event } from "../models/event";
import axios from 'axios';
import styled from 'styled-components';

type TDprops = {
    level?: number;
};

const Table = styled.table`
    border: 1px solid black;
    background-color: white;
    font-size: 1em;
    font-weight: bold;
    color: white;
    height: auto;
    width: 100%;
`;

const Title = styled.h1`
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-size: 2em;
font-family: 'Audiowide', cursive;
color: black;
text-shadow: 4px 4px 0px lightblue;
margin: 10px;
`;

const TD = styled.td<TDprops>`
    border: 1px solid black;
    background-color: ${props => {
        if (!props.level && props.level !== 0)
        {
            return 'darkgray';
        }
        else if (props.level === 100)
        {
            return 'blue';
        }
        else if (props.level > 80)
        {
            return 'lightblue';
        }
        else if (props.level > 50)
        {
            return 'lightgreen';
        }
        else if (props.level > 20)
        {
            return 'orange';
        }
        else 
        {
            return 'red';
        }
    }};
`;

const RetentionCohort: React.FC = () => {  
  
  const [info , setInfo] = useState<any>(null);   

  const getInfo = () => {
    axios.get('http://localhost:3001/events/retention?dayZero=1601331200000').then(r => {setInfo(r.data)});
  };

  useEffect(getInfo , []);

  const createGrid = () => {
    return (<Table>
        <tr><TD>weeks: </TD>{info.map((week: any , index: number) => <TD>week {index}</TD>)}</tr>
        {info.map((week: any) => <tr><TD>{week.start} to {week.end}</TD>{week.weeklyRetention.map((r: number) => <TD level={r}>{r}%</TD>)}</tr>)}
    </Table>);
    
  };

  return <div>
      <Title>Retention Cohort</Title>
      {info && createGrid()}
      </div>;
}

export default RetentionCohort;