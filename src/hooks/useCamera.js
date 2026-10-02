import { useCallback, useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';

const RISK_RULES = {
  person: { label: 'Human / Trespass Risk', severity: 'critical' },
  cow: { label: 'Animal on Track', severity: 'critical' },
  horse: { label: 'Animal on Track', severity: 'critical' },
  dog: { label: 'Animal on Track', severity: 'high' },
  sheep: { label: 'Animal on Track', severity: 'high' },
  cat: { label: 'Animal Near Track', severity: 'medium' },
  car: { label: 'Vehicle Obstruction', severity: 'critical' },
  truck: { label: 'Heavy Vehicle Obstruction', severity: 'critical' },
  bus: { label: 'Vehicle Obstruction', severity: 'critical' },
  bicycle: { label: 'Object / Vehicle on Track', severity: 'high' },
  motorcycle: { label: 'Vehicle Obstruction', severity: 'high' },
  backpack: { label: 'Possible Object Obstruction', severity: 'medium' },
  suitcase: { label: 'Possible Object Obstruction', severity: 'medium' },
  train: { label: 'Train Detected — Normal Monitoring', severity: 'info' },
};

const riskScore = {
  critical: 100,
  high: 75,
  medium: 50,
  info: 10,
};

export default function useCamera({ onDetection } = {}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const runningRef = useRef(false);
  const callbackRef = useRef(onDetection);
  const lastReportRef = useRef({});

  const [cameraState, setCameraState] = useState('off');
  const [modelState, setModelState] = useState('idle');
  const [cameraError, setCameraError] = useState('');
  const [detections, setDetections] = useState([]);
  const [risk, setRisk] = useState('safe');
  const [fps, setFps] = useState(0);
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    callbackRef.current = onDetection;
  }, [onDetection]);

  const drawBoxes = useCallback((items) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);

    items.forEach((item) => {
      const [x, y, boxWidth, boxHeight] = item.bbox;

      const color =
        item.severity === 'critical'
          ? '#ff5361'
          : item.severity === 'high'
            ? '#ffb648'
            : item.severity === 'medium'
              ? '#62b7ff'
              : '#35ddb4';

      context.strokeStyle = color;
      context.lineWidth = 3;
      context.strokeRect(x, y, boxWidth, boxHeight);

      const text = `${item.class} ${item.confidence}%`;

      context.font = 'bold 16px Arial';
      const textWidth = context.measureText(text).width + 14;

      context.fillStyle = color;
      context.fillRect(x, Math.max(0, y - 28), textWidth, 28);

      context.fillStyle = '#06111f';
      context.fillText(text, x + 7, Math.max(18, y - 8));
    });
  }, []);

  const processPredictions = useCallback((predictions) => {
    const items = predictions.map((prediction) => {
      const name = prediction.class.toLowerCase();

      const rule = RISK_RULES[name] || {
        label: 'Unknown Object',
        severity: 'medium',
      };

      return {
        ...prediction,
        confidence: Math.round(prediction.score * 100),
        label: rule.label,
        severity: rule.severity,
      };
    });

    setDetections(items);

    const highest = items
      .slice()
      .sort(
        (a, b) =>
          (riskScore[b.severity] || 0) -
          (riskScore[a.severity] || 0)
      )[0];

    const nextRisk =
      highest?.severity === 'critical'
        ? 'critical'
        : highest?.severity === 'high'
          ? 'high'
          : highest?.severity === 'medium'
            ? 'medium'
            : 'safe';

    setRisk(nextRisk);

    const now = Date.now();

    items.forEach((item) => {
      if (item.severity === 'info') return;

      const key = `${item.class}-${item.severity}`;

      if (
        !lastReportRef.current[key] ||
        now - lastReportRef.current[key] > 7000
      ) {
        lastReportRef.current[key] = now;
        callbackRef.current?.(item);
      }
    });

    drawBoxes(items);
  }, [drawBoxes]);

  const detectLoop = useCallback(async () => {
    if (
      !runningRef.current ||
      !detectorRef.current ||
      !videoRef.current
    ) {
      return;
    }

    const video = videoRef.current;

    if (video.readyState >= 2) {
      try {
        const predictions = await detectorRef.current.detect(
          video,
          12,
          0.45
        );

        processPredictions(predictions);
        setFps(6);
      } catch (error) {
        console.warn('Detection error:', error);
      }
    }

    if (runningRef.current) {
      window.setTimeout(detectLoop, 180);
    }
  }, [processPredictions]);

  const startCamera = useCallback(async (requestedFacingMode = facingMode) => {
    setCameraError('');
    setCameraState('starting');
    setModelState('loading');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Camera API unavailable. Use localhost or HTTPS.'
        );
      }

      await tf.ready();

      const model = await cocoSsd.load({
        base: 'lite_mobilenet_v2',
      });

      detectorRef.current = model;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: requestedFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setModelState('ready');
      setCameraState('live');
      runningRef.current = true;

      detectLoop();
    } catch (error) {
      detectorRef.current = null;
      setModelState('idle');
      setCameraState('error');

      setCameraError(
        error?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access and try again.'
          : error?.message || 'Unable to access camera.'
      );
    }
  }, [detectLoop, facingMode]);

  const stopCamera = useCallback(() => {
    runningRef.current = false;

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
    detectorRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState('off');
    setModelState('idle');
    setDetections([]);
    setRisk('safe');
    setFps(0);

    const canvas = canvasRef.current;

    if (canvas) {
      canvas.getContext('2d')?.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }, []);

  const switchCamera = useCallback(async () => {
    const next = facingMode === 'user' ? 'environment' : 'user';

    setFacingMode(next);

    if (cameraState === 'live') {
      stopCamera();
      window.setTimeout(() => startCamera(next), 100);
    }
  }, [cameraState, facingMode, startCamera, stopCamera]);

  const captureSnapshot = useCallback(() => {
    const video = videoRef.current;

    if (!video || video.readyState < 2) return '';

    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas
      .getContext('2d')
      ?.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.86);
  }, []);

  useEffect(
    () => () => stopCamera(),
    [stopCamera]
  );

  return {
    videoRef,
    canvasRef,
    cameraState,
    modelState,
    cameraError,
    detections,
    risk,
    fps,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera,
    captureSnapshot,
  };
}
