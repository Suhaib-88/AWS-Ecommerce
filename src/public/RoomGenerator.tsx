// ecommerce-ui/src/public/RoomGenerator.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from "@/components/Layout/Layout";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { VueCompareImage } from 'vue3-compare-image';
import RoomGallery from '@/components/RoomGenerator/RoomGallery';
import Keypoint from '@/components/RoomGenerator/Keypoint';
import SimilarProducts from "@/components/RoomGenerator/SimilarProducts";
import ImageUpload from "@/components/RoomGenerator/ImageUpload";
import { downloadImageS3 } from '../util/downloadImageS3';

const RoomsRepository = RepositoryFactory.get('rooms');

const RoomGenerator: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [uploadedRoomId, setUploadedRoomId] = useState(null);
  const [imageCompare, setImageCompare] = useState({ left: null, right: null });
  const [bothImagesLoaded, setBothImagesLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [highlightedBoundingBox, setHighlightedBoundingBox] = useState(null);
  const [highlightedBoundingBoxStyle, setHighlightedBoundingBoxStyle] = useState({});
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [keypointStyles, setKeypointStyles] = useState({});
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRooms();
    const handleResize = debounce(() => {
      updateBoundingBoxStyle();
      if (imageContainerRef.current) {
        const { offsetWidth, offsetHeight } = imageContainerRef.current;
        setContainerDimensions({ width: offsetWidth, height: offsetHeight });
        calculateKeyPointStyles();
      }
    }, 300);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRooms = async () => {
    const rooms = await RoomsRepository.getRooms();
    setRooms(rooms);
  };

  const onFileSelected = () => {
    setActiveRoom(null);
    setUploadedRoomId(null);
    setMatchingProducts([]);
  };

  const onRoomUploaded = (roomId: string) => {
    const fetchRoomAndUpdate = async (id: string, count: number) => {
      setShowSpinner(true);
      setUploadedRoomId(id);
      const room = await RoomsRepository.getRoom(id);
      setStatusMessage(room.room_state);
      if (room.room_state === 'Done') {
        setShowSpinner(false);
        setActiveRoom(room);
        setStatusMessage('');
        getRooms();
      } else {
        if (count < 20) {
          setTimeout(() => fetchRoomAndUpdate(id, count + 1), 5000);
        } else {
          setShowSpinner(false);
          setStatusMessage('Timed Out Waiting for Room Generation');
          console.log("Timed out waiting for room generation.");
        }
      }
    };
    fetchRoomAndUpdate(roomId, 1);
    getRooms();
  };

  const onRoomSelected = async (room: any) => {
    console.log('New active room:', room);
    setMatchingProducts([]);
    const fetchedRoom = await RoomsRepository.getRoom(room);
    setActiveRoom(fetchedRoom);
  };

  const calculateKeyPointStyles = () => {
    activeRoom?.labels?.forEach((label: any, index: number) => {
      updateKeypointStyle(index, label.bounding_box);
    });
  };

  const updateKeypointStyle = (index: number, boundingBox: any) => {
    const { width, height } = containerDimensions;
    const style = calculateKeyPointStyle(boundingBox, width, height);
    setKeypointStyles((prevStyles) => ({ ...prevStyles, [index]: style }));
  };

  const imageLoaded = () => {
    const checkVueCompareImageLoaded = () => {
      const container = imageContainerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        if (containerWidth > 0 && containerHeight > 0) {
          setContainerDimensions({ width: containerWidth, height: containerHeight });
          updateBoundingBoxStyle();
          calculateKeyPointStyles();
        } else {
          setTimeout(checkVueCompareImageLoaded, 100);
        }
      }
    };
    checkVueCompareImageLoaded();
  };

  const calculateKeyPointStyle = (boundingBox: any, containerWidth: number, containerHeight: number) => {
    const left = boundingBox.Left * containerWidth;
    const top = boundingBox.Top * containerHeight;
    const width = boundingBox.Width * containerWidth;
    const height = boundingBox.Height * containerHeight;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    return {
      position: 'absolute',
      left: `${centerX}px`,
      top: `${centerY}px`,
      width: `30px`,
      height: `30px`,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: 'var(--blue-500)',
      cursor: 'pointer',
      border: '2px solid white',
    };
  };

  const selectKeypoint = (keypoint: any) => {
    highlightBoundingBox(keypoint.bounding_box);
    setMatchingProducts(keypoint.similar_items);
  };

  const highlightBoundingBox = (boundingBox: any) => {
    setHighlightedBoundingBox(boundingBox);
    updateBoundingBoxStyle();
  };

  const updateBoundingBoxStyle = () => {
    if (!highlightedBoundingBox) {
      setHighlightedBoundingBoxStyle({});
      return;
    }
    const containerWidth = imageContainerRef.current?.offsetWidth || 0;
    const containerHeight = imageContainerRef.current?.offsetHeight || 0;
    const style = {
      left: `${highlightedBoundingBox.Left * containerWidth}px`,
      top: `${highlightedBoundingBox.Top * containerHeight}px`,
      width: `${highlightedBoundingBox.Width * containerWidth}px`,
      height: `${highlightedBoundingBox.Height * containerHeight}px`,
    };
    setHighlightedBoundingBoxStyle(style);
  };

  const debounce = (func: Function, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

  return (
    <Layout>
      <div className="content">
        <div className="container">
          <h2 className="m-0 text-left">Room Makeover</h2>
          <div className="row">
            <div className="col">
              <ImageUpload activeRoom={activeRoom} onFileSelected={onFileSelected} onRoomUploaded={onRoomUploaded} />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              {showSpinner && <div className="spinner-border" role="status" />}
            </div>
            <div className="col-2">
              <p>{statusMessage}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-10">
              {bothImagesLoaded && activeRoom && (
                <div className="relative-container" ref={imageContainerRef}>
                  <VueCompareImage leftImage={imageCompare.left} rightImage={imageCompare.right} />
                  <Keypoint labels={activeRoom?.labels} containerDimensions={containerDimensions} highlightedBoundingBox={highlightedBoundingBox} onKeypointSelected={selectKeypoint} />
                  {highlightedBoundingBox && <div style={highlightedBoundingBoxStyle} className="highlighted-bounding-box"></div>}
                </div>
              )}
            </div>
            <div className="col-2">
              <SimilarProducts itemIds={matchingProducts} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RoomGallery rooms={rooms} uploadedRoom={uploadedRoomId} onRoomSelected={onRoomSelected} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomGenerator;
