import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = ({ zoom, center, markers, dynamicMarkers, clusterMarkers, mapRef }) => {
  const mapContainer = useRef(null);
  const [els, setEls] = useState([]);

  useEffect(() => {
    if (clusterMarkers.length) {

      // Add all cluster markers
      clusterMarkers.forEach(({ lng, lat, color, size }) => {
        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundColor = color;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
    
        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        els.forEach((marker) => {
          marker.remove(); // Remove the marker from the map
        });
      });
    }
  }, [els, clusterMarkers, mapRef]);
  
  useEffect(() => {
    if (!mapRef.current) { return; }

    markers.forEach(({ lng, lat, color }) => {
      new mapboxgl.Marker({ color })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    });

    dynamicMarkers.forEach(({ lng, lat, color, size }) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = color;
      el.style.width = `${size}px`; // Initial size
      el.style.height = `${size}px`;

        setEls((oldEls) => [...oldEls, new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(mapRef.current)])
    });
    
  }, [markers, dynamicMarkers, mapRef]);
  

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom,
      });      
    }
    
  }, [zoom, center, mapRef]);

  return <div ref={mapContainer} className="map-container" />;

};

export default MapComponent;
