import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  RotateCw,
  HelpCircle,
  FileText,
  Volume2,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { SAMPLE_CARDS } from '../utils/sampleCardGenerator';
import { playShutterSound } from '../utils/soundEffects';
import { UILang } from './Header';

interface Step1CaptureProps {
  frontImage: string | null;
  backImage: string | null;
  onFrontChange: (img: string | null) => void;
  onBackChange: (img: string | null) => void;
  onStartScanning: () => void;
  uiLang: UILang;
}

export const Step1Capture: React.FC<Step1CaptureProps> = ({
  frontImage,
  backImage,
  onFrontChange,
  onBackChange,
  onStartScanning,
  uiLang,
}) => {
  const [activeSlot, setActiveSlot] = useState<'front' | 'back'>('front');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Enumerate video devices on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoDevs = devices.filter((d) => d.kind === 'videoinput');
          setAvailableCameras(videoDevs);
          if (videoDevs.length > 0 && !selectedCameraId) {
            setSelectedCameraId(videoDevs[0].deviceId);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Translations
  const textMap = {
    en: {
      stepTitle: 'Step 1: Capture Card Photo',
      stepDesc: 'Front side required; back side optional for addresses, tax or branch details.',
      frontSide: 'Front Side (Required)',
      backSide: 'Back Side (Optional)',
      useCamera: 'Open Webcam',
      deviceCamera: 'Take Photo (Camera)',
      uploadFile: 'Upload Image',
      testSample: 'Or test with an Indian sample card:',
      startAI: 'Extract Details with Multilingual AI (Step 2)',
      alignGuide: 'Align card inside the frame and hold steady',
      clickPhoto: 'Capture Photo',
      switchCam: 'Flip Camera',
      retake: 'Retake',
      removeBack: 'Remove Back',
      rotate: 'Rotate 90°',
      dragDrop: 'Click or drag & drop card image',
    },
    hi: {
      stepTitle: 'स्टेप 1 — कार्ड की फोटो लें',
      stepDesc: 'सामने का भाग (Front) अनिवार्य; पिछला भाग (Back) वैकल्पिक है।',
      frontSide: 'सामने का भाग (Front Side - अनिवार्य)',
      backSide: 'पिछला भाग (Back Side - वैकल्पिक)',
      useCamera: 'वेबकैम खोलें',
      deviceCamera: 'कैमरे से फोटो लें',
      uploadFile: 'फोटो अपलोड करें',
      testSample: 'या भारतीय नमूना कार्ड से तुरंत टेस्ट करें:',
      startAI: 'एआई द्वारा विवरण पढ़ें (स्टेप 2)',
      alignGuide: 'कार्ड को फ्रेम के अंदर सीधा रखें',
      clickPhoto: 'फोटो खींचें',
      switchCam: 'कैमरा बदलें',
      retake: 'दोबारा लें',
      removeBack: 'हटाएं',
      rotate: 'घुमाएं (Rotate)',
      dragDrop: 'कार्ड की फोटो क्लिक करें या यहाँ खींचें',
    },
    gu: {
      stepTitle: 'પગલું 1 — કાર્ડનો ફોટો લો',
      stepDesc: 'આગળનો ભાગ (Front) ફરજિયાત; પાછળનો ભાગ (Back) વૈકલ્પિક.',
      frontSide: 'આગળનો ભાગ (Front - જરૂરી)',
      backSide: 'પાછળનો ભાગ (Back - વૈકલ્પિક)',
      useCamera: 'વેબકેમ શરૂ કરો',
      deviceCamera: 'કેમેરાથી ફોટો લો',
      uploadFile: 'ઈમેજ અપલોડ કરો',
      testSample: 'અથવા સેમ્પલ કાર્ડ વડે તરત ચકાસો:',
      startAI: 'AI વડે વિગતો વાંચો (પગલું 2)',
      alignGuide: 'કાર્ડને ફ્રેમમાં બરાબર ગોઠવો',
      clickPhoto: 'ફોટો લો',
      switchCam: 'કેમેરા ફેરવો',
      retake: 'ફરીથી લો',
      removeBack: 'દૂર કરો',
      rotate: 'ફેરવો',
      dragDrop: 'કાર્ડનો ફોટો અહીં પસંદ કરો',
    },
    mr: {
      stepTitle: 'पायरी 1 — कार्डचा फोटो घ्या',
      stepDesc: 'पुढील बाजू (Front) अनिवार्य; मागील बाजू (Back) ऐच्छिक.',
      frontSide: 'पुढील बाजू (Front - अनिवार्य)',
      backSide: 'मागील बाजू (Back - ऐच्छिक)',
      useCamera: 'वेबकॅम सुरू करा',
      deviceCamera: 'कॅमेऱ्याने फोटो घ्या',
      uploadFile: 'फोटो अपलोड करा',
      testSample: 'किंवा नमुना कार्ड निवडा:',
      startAI: 'AI द्वारे तपशील वाचा (पायरी 2)',
      alignGuide: 'कार्ड फ्रेममध्ये नीट ठेवा',
      clickPhoto: 'फोटो काढा',
      switchCam: 'कॅमेरा बदला',
      retake: 'पुन्हा घ्या',
      removeBack: 'काढून टाका',
      rotate: 'फिरवा',
      dragDrop: 'कार्डचा फोटो येथे अपलोड करा',
    },
  }[uiLang];

  // Stop camera stream cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start camera stream with multi-stage fallback
  const startCamera = async (targetDeviceId?: string) => {
    stopCamera();
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Live webcam API is not supported in this browser. Please use "Take Photo (Camera)" or "Upload Image".');
      return;
    }

    const deviceToUse = targetDeviceId || selectedCameraId;

    // Progressive fallback constraints:
    // 1. If explicit deviceId is chosen, try that first
    // 2. Try facingMode (environment / user)
    // 3. Try opposite facingMode (e.g. user-facing on laptops that have no rear camera)
    // 4. Try generic { video: true } which matches any attached camera
    const attempts: MediaStreamConstraints[] = [];

    if (deviceToUse) {
      attempts.push({
        video: { deviceId: { exact: deviceToUse } },
        audio: false,
      });
    }

    attempts.push({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    attempts.push({
      video: {
        facingMode: { ideal: facingMode === 'environment' ? 'user' : 'environment' },
      },
      audio: false,
    });

    attempts.push({
      video: true,
      audio: false,
    });

    let activeStream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraints of attempts) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (activeStream) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        // Proceed to next fallback constraint
      }
    }

    if (activeStream) {
      streamRef.current = activeStream;
      if (videoRef.current) {
        videoRef.current.srcObject = activeStream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setCameraError(null);

      // Re-enumerate to get labeled devices
      navigator.mediaDevices.enumerateDevices().then((devs) => {
        const vDevs = devs.filter((d) => d.kind === 'videoinput');
        setAvailableCameras(vDevs);
      }).catch(() => {});
    } else {
      console.warn('Camera stream acquisition failed:', lastError);
      const isNotFound =
        lastError?.name === 'NotFoundError' ||
        lastError?.name === 'DevicesNotFoundError' ||
        lastError?.message?.toLowerCase().includes('not found');
      const isPermissionDenied =
        lastError?.name === 'NotAllowedError' ||
        lastError?.name === 'PermissionDeniedError';

      if (isNotFound) {
        setCameraError(
          'No webcam hardware was detected on this device. You can click "Take Photo (Camera)" to use your mobile camera, upload an image file, or click a sample card below.'
        );
      } else if (isPermissionDenied) {
        setCameraError(
          'Camera access was denied by your browser permissions. Please allow camera access in the browser address bar, or upload an image.'
        );
      } else {
        setCameraError(
          `Camera could not be started (${lastError?.message || 'Device not available'}). You can upload an image or take a photo using your device camera.`
        );
      }
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture snapshot from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    playShutterSound();

    if (activeSlot === 'front') {
      onFrontChange(dataUrl);
      // Auto switch target slot to back if front is captured
      if (!backImage) {
        setActiveSlot('back');
      }
    } else {
      onBackChange(dataUrl);
    }

    stopCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (activeSlot === 'front') {
          onFrontChange(result);
          if (!backImage) setActiveSlot('back');
        } else {
          onBackChange(result);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Rotate image by 90 degrees
  const rotateImage = (isFront: boolean) => {
    const targetImage = isFront ? frontImage : backImage;
    if (!targetImage) return;

    const img = new Image();
    img.src = targetImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedData = canvas.toDataURL('image/jpeg', 0.92);
      if (isFront) {
        onFrontChange(rotatedData);
      } else {
        onBackChange(rotatedData);
      }
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Step Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {textMap.stepTitle}
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {textMap.stepDesc}
            </p>
          </div>

          {/* Quick Step Indicators */}
          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                frontImage
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Front: {frontImage ? 'Ready ✓' : 'Required'}
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                backImage
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Back: {backImage ? 'Attached ✓' : 'Optional'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Slots Selection (Front vs Back) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Front Slot */}
        <div
          onClick={() => {
            setActiveSlot('front');
          }}
          className={`relative rounded-2xl border-2 p-4 transition-all cursor-pointer ${
            activeSlot === 'front'
              ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  activeSlot === 'front' ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-slate-700'
                }`}
              />
              <span className="font-bold text-sm text-white">{textMap.frontSide}</span>
            </div>
            {frontImage && (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateImage(true);
                  }}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFrontChange(null);
                  }}
                  title="Remove"
                  className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Front Preview Box */}
          <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative group">
            {frontImage ? (
              <img
                src={frontImage}
                alt="Front Card"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {textMap.dragDrop}
                </p>
                <span className="inline-block text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Back Slot */}
        <div
          onClick={() => {
            setActiveSlot('back');
          }}
          className={`relative rounded-2xl border-2 p-4 transition-all cursor-pointer ${
            activeSlot === 'back'
              ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  activeSlot === 'back' ? 'bg-indigo-500 ring-4 ring-indigo-500/20' : 'bg-slate-700'
                }`}
              />
              <span className="font-bold text-sm text-white">{textMap.backSide}</span>
            </div>
            {backImage && (
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateImage(false);
                  }}
                  title="Rotate 90°"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackChange(null);
                  }}
                  title={textMap.removeBack}
                  className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Back Preview Box */}
          <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center relative group">
            {backImage ? (
              <img
                src={backImage}
                alt="Back Card"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Branch list, GSTIN or bank details
                </p>
                <span className="inline-block text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Optional
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Camera Viewfinder or Capture Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative aspect-[16/9] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black border-2 border-indigo-500/50 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay Card Box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                <div className="w-[85%] max-w-md aspect-[1.586/1] border-2 border-dashed border-indigo-400/80 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                  {/* Corner Markers */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

                  {/* Guide text */}
                  <div className="absolute bottom-3 inset-x-0 text-center">
                    <span className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-300 border border-indigo-400/40">
                      {textMap.alignGuide} ({activeSlot === 'front' ? 'Front' : 'Back'})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {availableCameras.length > 1 && (
              <div className="flex items-center justify-center gap-2 pb-2">
                <span className="text-xs text-slate-400">Select Camera:</span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => {
                    setSelectedCameraId(e.target.value);
                    if (isCameraActive) {
                      startCamera(e.target.value);
                    }
                  }}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  {availableCameras.map((cam, idx) => (
                    <option key={cam.deviceId || idx} value={cam.deviceId}>
                      {cam.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
                  setTimeout(() => startCamera(), 100);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                {textMap.switchCam}
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                {textMap.clickPhoto} (Space)
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Native Device Camera Trigger (Direct camera capture on phone/tablet/web) */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>{textMap.deviceCamera}</span>
              </button>

              {/* Live WebCam Stream Trigger */}
              <button
                type="button"
                onClick={() => startCamera()}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                <span>{textMap.useCamera}</span>
              </button>

              {/* Upload Image File */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span>{textMap.uploadFile}</span>
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={nativeCameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {cameraError && (
          <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 text-center space-y-2.5">
            <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Camera Notice</span>
            </div>
            <p className="text-xs text-amber-200/90 max-w-lg mx-auto">
              {cameraError}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Take Photo (Camera)</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Card Image</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Built-in Multilingual Sample Cards for Instant Testing */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {textMap.testSample}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            1-Click testing for Hindi, Gujarati, Marathi & Bengali
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_CARDS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                const dataUrl = sample.render();
                onFrontChange(dataUrl);
              }}
              className="text-left p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {sample.languageBadge}
                </span>
                <span className="text-[10px] text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  Load →
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">
                {sample.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Proceed Button */}
      {frontImage && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onStartScanning}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{textMap.startAI}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
