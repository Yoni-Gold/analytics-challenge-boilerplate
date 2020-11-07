import React , {useCallback , useState , useEffect} from "react";
import { GoogleMap, LoadScript, Marker , MarkerClusterer} from '@react-google-maps/api';
import { Clusterer, ClustererOptions} from '@react-google-maps/marker-clusterer'
import { Event } from "../models/event";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import styled from 'styled-components';
import axios from 'axios';

const NewFade = styled(Fade)`
width: auto;
height: auto;
padding: 5px;
color: white;
background-color: black;
border: 3px solid white;
font-size: 2vw;
@import url('https://fonts.googleapis.com/css2?family=Iceberg&display=swap');
font-family: 'Iceberg';
`;

const NewModal = styled(Modal)`
display: grid;
align-content: center;
justify-content: center;
`;

const options: ClustererOptions = {
    imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
}

const EventWorldMap: React.FC = () =>
{
    const [map, setMap] = useState<GoogleMap | null>(null);
    const [open , setOpen] = useState<boolean>(false);
    const [clickedEvent , setEvent] = useState<Event | null>(null);

    const [info , setInfo] = useState<any>(null);

    const getInfo = () => {
      axios.get('http://localhost:3001/events/all').then(r => {setInfo(r.data)});
    };

    useEffect(getInfo , []);

    const containerStyle = {
        width: '100%',
        height: '100%',
    };

    const markerClick = (index: number) => {             
        setEvent(info[index]);
        setOpen(true);
    };

    const onLoad = useCallback(function callback(map) {
      const bounds = new window.google.maps.LatLngBounds({lat: 10, lng: 10} , {lat: 50, lng: 50});
      map.fitBounds(bounds);
      setMap(map)
    }, [])
    
    const onUnmount = useCallback(function callback(map) {
      setMap(null)
    }, [])

    return (
    <LoadScript googleMapsApiKey="AIzaSyCIawjD0EAyDRJC0RyWqNfkwEKRoQZ0Wqg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
        <MarkerClusterer options={options}>
          {(clusterer: Clusterer): React.ReactNode => info && info.map((e: any, i: number) => <Marker onClick={() => markerClick(i)} key={i} position={e.geolocation.location} clusterer={clusterer}></Marker>)}
        </MarkerClusterer>
        </GoogleMap>
        <NewModal
        open={open}
        onClose={() => {setOpen(false)}}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <NewFade in={open}>
          <div>
          <div><span style={{color: 'lightblue'}}>User ID:</span> {clickedEvent?.distinct_user_id}</div>
          <div><span style={{color: 'lightblue'}}>Event Name:</span> {clickedEvent?.name}</div>
          <div><span style={{color: 'lightblue'}}>Date:</span> {clickedEvent ? new Date(clickedEvent!.date).toDateString() : null}</div>
          <div><span style={{color: 'lightblue'}}>OS:</span> {clickedEvent?.os}</div>
          <div><span style={{color: 'lightblue'}}>Browser:</span> {clickedEvent?.browser}</div>
          </div>
        </NewFade>
      </NewModal>
      </LoadScript>
      
      );
}

export default EventWorldMap;