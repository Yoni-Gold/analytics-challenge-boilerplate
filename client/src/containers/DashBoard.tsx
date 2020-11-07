import React , {Suspense, lazy, useCallback , useEffect , useState} from "react";
import { Interpreter } from "xstate";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundray from '../MyComponents/ErrorBoundray';
import styled from 'styled-components';
const EventWorldMap = lazy(() => import('../MyComponents/EventWorldMap'));
const RetentionCohort = lazy(() => import('../MyComponents/retentionCohort'));
const EventsList = lazy(() => import('../MyComponents/EventsList'));
const SessionsADay = lazy(() => import('../MyComponents/SessionsADay'));
const SessionsAnHour = lazy(() => import('../MyComponents/SessionsAnHour'));
const BrowsersPie = lazy(() => import('../MyComponents/BrowsersPie'));

type AreaProps = {
  area: string;
};

const Title = styled.h1`
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-size: 50px;
font-family: 'Audiowide', cursive;
color: black;
text-shadow: 4px 4px 0px lightblue;
margin: 10px;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  text-align: center;
  align-content: center;
  justify-content: center;
  padding: 10px;
  height: auto;
  width: 100%;
  @media only screen and (max-width: 1200px) {
  grid-template:
    'map map map map' 300px
    'retention retention retention retention' auto 
    'browsers browsers browsers browsers' auto
    'byDays byDays byDays byDays' auto
    'byHours byHours byHours byHours' auto
    'eventLog eventLog eventLog eventLog' 300px / 25% 25% 25% 25%;
  }
  grid-template:
    'map map map map' 500px
    'browsers retention retention retention' 300px 
    'byDays byDays byHours byHours' auto
    'eventLog eventLog eventLog eventLog' 500px / 25% 25% 25% 25%;

`;

const GridDiv = styled.div<AreaProps>`
  ${props => props.area !== 'eventLog' && 'display: flex; justify-content: center;'}
  text-align: center;
  align-content: center;
  padding: 2px;
  background-color: lightgray;
  border: 2px solid black;
  box-shadow: 2px 2px 2px black;
  grid-area: ${props => props.area};
`;

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    alignItems: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    flexDirection: "column",
  },
}));

const containerStyle = {
  width: '100%',
  height: '500px',
};

const DashBoard: React.FC = () => {
  
  const classes = useStyles();  

  return (
    <Paper className={classes.paper}>
    <Title>Analytics Page</Title>
    <AnalyticsGrid>
    <GridDiv area='map'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><EventWorldMap /></Suspense></ErrorBoundray></GridDiv>
    <GridDiv area='byDays'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><SessionsADay /></Suspense></ErrorBoundray></GridDiv>
    <GridDiv area='retention'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><RetentionCohort /></Suspense></ErrorBoundray></GridDiv>
    <GridDiv area='byHours'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><SessionsAnHour /></Suspense></ErrorBoundray></GridDiv>
    <GridDiv area='eventLog'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><EventsList /></Suspense></ErrorBoundray></GridDiv>
    <GridDiv area='browsers'><ErrorBoundray><Suspense  fallback={<h1>loading....</h1>}><BrowsersPie /></Suspense></ErrorBoundray></GridDiv>
    </AnalyticsGrid>
    </Paper>
    
  );
};

export default DashBoard;
