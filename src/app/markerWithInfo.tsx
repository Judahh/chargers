import { useAdvancedMarkerRef, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import { Marker } from "./types";
import styles from "./markerWithInfo.module.css";

type Position = {
    lat: number;
    lng: number;
};
export const MarkerWithInfo = ({ position, markerConf }: { position: Position, markerConf: Marker}) => {
    // `markerRef` and `marker` are needed to establish the connection between
    // the marker and infowindow (if you're using the Marker component, you
    // can use the `useMarkerRef` hook instead).
    const availableMarkerImg = '/available.png';
    const busyMarkerImg = '/busy.png';
    const unknownMarkerImg = '/unknown.png';
    const blackBoltImg = '/bolt.svg';
    const blueBoltImg = '/bolt-b.svg';
    const blue2BoltImg = '/bolt-b2.svg';
    const yellowBoltImg = '/bolt-y.svg';
    const redBoltImg = '/bolt-r.svg';
    const greenBoltImg = '/bolt-g.svg';
    const [markerRef, marker] = useAdvancedMarkerRef();

    const [infoWindowShown, setInfoWindowShown] = useState(false);

    // clicking the marker will toggle the infowindow
    const handleMarkerClick = useCallback(
        () => setInfoWindowShown(isShown => !isShown),
        []
    );

    // if the maps api closes the infowindow, we have to synchronize our state
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const getBoltImg = (marker: Marker) => {
        // get the highest power plug
        let maxPower = 0;
        let maxPowerPlug = null;
        marker?.plugs?.forEach((plug) => {
            const currentPower = plug?.maxPower || 0;
            if (currentPower > maxPower) {
                maxPower = currentPower;
                maxPowerPlug = plug;
            }
        });
        // no plugs -> no bolt
        // 0-6kW -> red bolt
        // 6-15kW -> black bolt
        // 15-30kW -> yellow bolt
        // 30-60kW -> green bolt
        // 60-120kW -> blue2 bolt
        // 120+kW -> blue bolt
        if (!maxPowerPlug) {
            return undefined;
        }
        if (maxPower <= 6) {
            return redBoltImg;
        }
        if (maxPower <= 15) {
            return blackBoltImg;
        }
        if (maxPower <= 30) {
            return yellowBoltImg;
        }
        if (maxPower <= 60) {
            return greenBoltImg;
        }
        if (maxPower <= 120) {
            return blue2BoltImg;
        }
        return blueBoltImg;
    }

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                position={position}
                onClick={handleMarkerClick}
            >
                <img src={markerConf.status == 'available' ? availableMarkerImg : markerConf.status == 'busy' ? busyMarkerImg : unknownMarkerImg} width={32} height={32} />
                {getBoltImg(markerConf) && <img src={getBoltImg(markerConf)} width={5} height={5} className={styles.floatingBoltImg}/>}
            </AdvancedMarker>

            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <div style={{color: 'black'}}>
                        <h2>{markerConf.name}</h2>
                        {markerConf.rating ? <p>Rating: {markerConf.rating}</p> : null}
                        {markerConf.totalRatings ? <p>Total Ratings: {markerConf.totalRatings}</p> : null}
                        {markerConf.status ? <p>Status: {markerConf.status}</p> : null}
                        {markerConf.address ? <p>Address: {markerConf.address}</p> : null}
                        {markerConf.description ? <p>Description: {markerConf.description}</p> : null}
                        {markerConf.parking?.isFree !== undefined ? <p>Parking: {markerConf.parking?.isFree ? 'Free' : markerConf.parking?.price?.map((price) => `${price.currency} ${price.value} per ${price.unit}`).join(', ')}</p> : null}
                        {markerConf.plugs.map((plug, index) => (
                            <div key={index}>
                                <h3>{plug.brand}</h3>
                                {plug.rating ? <p>Rating: {plug.rating}</p>: null}
                                {plug.totalRatings ? <p>Total Ratings: {plug.totalRatings}</p>: null}
                                {plug.maxPower ? <p>Max Power: {plug.maxPower}</p>: null}
                                {plug.currentType ? <p>Current Type: {plug.currentType}</p>: null}
                                {plug.type ? <p>Type: {plug.type}</p>: null}
                                {plug.status ? <p>Status: {plug.status}</p>: null}
                                {plug.isFree ? <p>Price: {plug.isFree ? 'Free' : plug.price?.map((price) => `${price.currency} ${price.value} per ${price.unit}`).join(', ')}</p>: null}
                                {plug.reservationQueue ? <p>Reservation Queue: {plug.reservationQueue?.map((reservation) => `${reservation.userId} started at ${reservation.startedAt} and expires at ${reservation.expiresAt}`).join(', ')}</p>: null}
                                {plug.endsAt ? <p>Ends At: {plug.endsAt?.toDateString()}</p>: null}
                            </div>
                        ))}
                    </div>
                </InfoWindow>
            )}
        </>
    );
};