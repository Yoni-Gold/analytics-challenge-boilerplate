import React , {useCallback , useState , useEffect, useRef} from "react";
import { Event } from "../models/event";
import axios from 'axios';
import styled from 'styled-components';
import { AlternateEmail } from "@material-ui/icons";

type Info = {
    events: Array<Event>;
    more: boolean;
}

const Main = styled.div`
    background-color: gray;
    padding: 5px;
    overflow-y: scroll;
    height: 100%;
`;

const Filters = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    align-content: center;
    justify-content: space-around;
    margin: 10px;
`;

const EventDiv = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 5px;
    height: auto;
    padding: 5px;
    color: white;
    background-color: black;
    border: 3px solid white;
    font-size: 1em;
    @import url('https://fonts.googleapis.com/css2?family=Iceberg&display=swap');
    font-family: 'Iceberg';
`;

const Title = styled.h1`
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-size: 2em;
font-family: 'Audiowide', cursive;
color: black;
text-shadow: 4px 4px 0px lightblue;
margin: 10px;
`;

const EventsLog: React.FC = () => {

    const [sort , setSort] = useState<string | null>('+date');
    const [type , setType] = useState<string | null>(null);
    const [browser , setBrowser] = useState<string | null>(null);
    const [search , setSearch] = useState<string | null>(null);
    const [scroll , setScroll] = useState<number>(10);
    const [info , setInfo] = useState<Info | null>(null);

    const main = useRef<any>();

    const getInfo = () => {
        axios.get(`http://localhost:3001/events/all-filtered?${(type && type !== 'all') ? `type=${type}&` : ''}${(browser && browser !== 'all') ? `browser=${browser}&` : ''}${(search && search !== '') ? `search=${search}&` : ''}${sort ? `sorting=${sort}&` : ''}${scroll ? `offset=${scroll}&` : ''}` ).then(r => {setInfo(r.data)});
    };

    useEffect(getInfo , [type, sort, browser, search, scroll]);
    useEffect(() => {setScroll(10)} , [type, browser, search]);

    const handleScroll = () => {
        if (main.current.scrollHeight - main.current.scrollTop === main.current.clientHeight)
        { 
            setScroll(scroll + 5);
        }
    };

    return <Main ref={main} onWheel={handleScroll}>
        <Title>Events Log</Title>
        <Filters>
            <span>Search: <input placeholder={'search by session id'} onChange={(e) => setSearch(e.target.value)}></input></span>
            <span>Sort: <select onChange={(e) => setSort(e.target.value)}>
                <option value='-%0Adate'>-date</option>
                <option value='%2Bdate'>+date</option>
            </select></span>
            <span>Type: <select onChange={(e) => setType(e.target.value)}>
                <option value='all'>all</option>
                <option value='signup'>signup</option>
                <option value='login'>login</option>
                <option value='pageView'>page view</option>
            </select></span>
            <span>Browser: <select onChange={(e) => setBrowser(e.target.value)}>
                <option value='all'>all</option>
                <option value='chrome'>Chrome</option>
                <option value='ie'>Internet Explorer</option>
                <option value='firefox'>Firefox</option>
                <option value='edge'>Edge</option>
                <option value='safari'>Safari</option>
                <option value='other'>other</option>
            </select></span>
        </Filters>
            {info && info.events.map((event: Event) => <EventDiv>
          <div><span style={{color: 'lightblue'}}>User ID:</span> {event.distinct_user_id}</div>
          <div><span style={{color: 'lightblue'}}>Event Name:</span> {event.name}</div>
          <div><span style={{color: 'lightblue'}}>Date:</span> {new Date(event!.date).toDateString()}</div>
          <div><span style={{color: 'lightblue'}}>OS:</span> {event.os}</div>
          <div><span style={{color: 'lightblue'}}>Browser:</span> {event.browser}</div>
          </EventDiv>)}
    </Main>
}

export default EventsLog;