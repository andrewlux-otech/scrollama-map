import React, { useState, useCallback, useRef } from "react";
import MapComponent from "./components/MapComponent";
import ScrollStory from "./components/ScrollStory";
import "./App.css";

let timeout;

const App = () => {
  const [mapState, setMapState] = useState({
    zoom: 2,
    center: [0, 0],
    markers: [
      { lng: 2.3522, lat: 48.8566, color: "blue" },
    ],
  });
  const [dynamicMarkers, setDynamicMarkers] = useState([]);
  const [clusterMarkers, setClusterMarkers] = useState([]);
  
  const map = useRef(null);

  
  

  const handleStepEnter = useCallback(({ element }) => {    

    const addRandomMarkers = () => {
      const randomLng = -180 + Math.random() * 360;
      const randomLat = -90 + Math.random() * 180;

      const queryResult = map.current.queryRenderedFeatures(
        map.current.project([randomLng, randomLat]),
        { layers: ['water'] } // Ensure 'land' layer exists in your map style
      );
    
      if (queryResult.length === 0) { // Only add markers if on land
        const newMarker = {
          lng: randomLng, // Random longitude
          lat: randomLat,  // Random latitude
          color: 'red',
          size: Math.random() * 30 + 10, // Size range: 10px to 40px
        };
        setDynamicMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      } else {
        addRandomMarkers();
      }
    };

    const addClusteredMarkers = () => {
      let temp = [];

      dynamicMarkers.forEach(({ lng, lat, size }) => {
        // Generate a cluster around the main dot
        const clusterCount = Math.floor(Math.random() * 50) + 3; // 3–7 dots per cluster

        temp = temp.concat(Array.from({ length: clusterCount }).map(() => {
          const offset = Math.random() * 3 + 2; // Small offset for clustering
          const offset2 = Math.random() * 3 + 2; // Small offset for clustering
          return {
            lng: lng + offset < -180 ? -180 : (lng + offset > 180 ? 180 : lng + offset),
            lat: lat + offset2 < -90 ? -90 : (lat + offset2 > 90 ? 90 : lat + offset2),
            color: "red",
            size: Math.random() * size, // Small size: 5px to 15px
          };
        }));
      });
    
      setClusterMarkers(temp);
    };
    

    const stepIndex = element.dataset.step;

    if (stepIndex === "1") {
      setMapState((mapState) => ({ ...mapState, center: [0, 0], zoom: 2 }));
    } else if (stepIndex === "2") {
      timeout = setTimeout(() => {
        addRandomMarkers();
      }, 200);
    } else if (stepIndex === "3") {
      clearTimeout(timeout);
      if (dynamicMarkers.length) {
        map.current.flyTo({
          center: [2.3522, 48.8566], // Example: New York City coordinates
          zoom: 3, // Adjust zoom level as needed
          speed: 1.2, // Animation speed
          curve: 1.5, // Animation curvature
        });
        
        addClusteredMarkers();
        setDynamicMarkers([]);
      }
    }
  }, [dynamicMarkers]);

  return (
    <div>
      <div className="map-mask"></div>
      <MapComponent {...mapState} dynamicMarkers={dynamicMarkers} clusterMarkers={clusterMarkers} mapRef={map} />
      <div className="scroll-container">
        <ScrollStory onStepEnter={handleStepEnter} />
      </div>
    </div>
  );
  
};

export default App;
