import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop,
  Check,
  Upload,
  Image as ImageIcon,
  Move,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ImageAdjusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | 'free';
  title?: string;
  onSave: (croppedDataUrl: string) => void;
  presetImages?: { label: string; url: string }[];
}

export const ImageAdjusterModal: React.FC<ImageAdjusterModalProps> = ({
  isOpen,
  onClose,
  initialImageUrl = '',
  aspectRatio = '1:1',
  title = 'Adjust & Crop Image',
  onSave,
  presetImages = [],
}) => {
  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageUrl);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<'1:1' | '16:9' | '4:3' | 'free'>(aspectRatio);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [urlInput, setUrlInput] = useState('');

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageSrc(initialImageUrl);
      setZoom(1);
      setRotation(0);
      setOffsetX(0);
      setOffsetY(0);
      setSelectedRatio(aspectRatio);
      setUrlInput('');
    }
  }, [isOpen, initialImageUrl, aspectRatio]);

  if (!isOpen) return null;

  // Handle local file upload (mobile camera / photo gallery / desktop files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string);
          setZoom(1);
          setOffsetX(0);
          setOffsetY(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle pointer drag for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Render crop to high quality data URL
  const handleApplyCrop = () => {
    if (!currentImageSrc) {
      onClose();
      return;
    }

    const canvas = document.createElement('canvas');
    let targetWidth = 800;
    let targetHeight = 800;

    if (selectedRatio === '16:9') {
      targetWidth = 1200;
      targetHeight = 675;
    } else if (selectedRatio === '4:3') {
      targetWidth = 800;
      targetHeight = 600;
    } else if (selectedRatio === '1:1') {
      targetWidth = 800;
      targetHeight = 800;
    } else {
      targetWidth = 800;
      targetHeight = 800;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      onSave(currentImageSrc);
      onClose();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const scale = zoom;
      const drawX = offsetX * (targetWidth / 300) - (img.width * scale) / 2;
      const drawY = offsetY * (targetHeight / 300) - (img.height * scale) / 2;

      // Better cover fit math
      const baseRatio = Math.max(targetWidth / img.width, targetHeight / img.height);
      const scaledW = img.width * baseRatio * scale;
      const scaledH = img.height * baseRatio * scale;
      const posX = offsetX * 2 - scaledW / 2;
      const posY = offsetY * 2 - scaledH / 2;

      ctx.drawImage(img, posX, posY, scaledW, scaledH);
      ctx.restore();

      const outputDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onSave(outputDataUrl);
      onClose();
    };

    img.onerror = () => {
      // Fallback if cross-origin tainted
      onSave(currentImageSrc);
      onClose();
    };

    img.src = currentImageSrc;
  };

  // Determine frame aspect ratio styling
  const getFrameAspectClass = () => {
    switch (selectedRatio) {
      case '16:9':
        return 'aspect-video max-w-lg';
      case '4:3':
        return 'aspect-[4/3] max-w-md';
      case '1:1':
      default:
        return 'aspect-square max-w-sm';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#126B45] flex items-center justify-center font-bold">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              <p className="text-[11px] text-gray-500">
                Upload from phone/PC, zoom, reposition & crop for professional display
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Canvas / Viewport */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="flex justify-center bg-gray-900 p-4 rounded-2xl relative select-none touch-none">
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`w-full ${getFrameAspectClass()} mx-auto relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-400/80 bg-black/40 cursor-grab active:cursor-grabbing flex items-center justify-center`}
            >
              {currentImageSrc ? (
                <img
                  ref={imageRef}
                  src={currentImageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="max-none pointer-events-none transition-transform duration-75 select-none"
                  style={{
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <div className="text-center text-gray-400 p-6 space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-500 stroke-1" />
                  <p className="text-xs">No image loaded yet.</p>
                  <p className="text-[11px] text-gray-400">
                    Upload a photo from your device or select a preset below.
                  </p>
                </div>
              )}

              {/* Grid overlay for cropping guidance */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Pan Hint */}
              {currentImageSrc && (
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-white/70 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs pointer-events-none">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" /> Drag to reposition
                  </span>
                  <span>Zoom: {zoom.toFixed(1)}x</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Controls Bar */}
          {currentImageSrc && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-3">
              {/* Zoom & Rotate Sliders */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-1">
                  <div className="flex items-center justify-between text-gray-600 font-semibold text-[11px]">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-700" /> Zoom Level
                    </span>
                    <span>{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                      className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-[#126B45]"
                    />
                    <button
                      type="button"
                      onClick={() => setZoom(Math.min(3.0, zoom + 0.2))}
                      className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg font-semibold text-gray-700 flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-700" /> Rotate 90°
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setOffsetX(0);
                      setOffsetY(0);
                      setRotation(0);
                    }}
                    className="px-2.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-600 flex items-center gap-1"
                    title="Reset Alignment"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-200">
                <span className="text-gray-500 font-semibold text-[11px]">Aspect Ratio:</span>
                {(['1:1', '4:3', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setSelectedRatio(ratio)}
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                      selectedRatio === ratio
                        ? 'bg-[#126B45] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {ratio === '1:1' ? '1:1 (Square / Logo)' : ratio === '16:9' ? '16:9 (Cover Banner)' : '4:3 (Product)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload, Paste URL, or Pick Presets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#126B45] border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4" /> Upload from Mobile or PC
              </button>

              {currentImageSrc && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentImageSrc('');
                    setOffsetX(0);
                    setOffsetY(0);
                  }}
                  className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-4 h-4" /> Remove Image
                </button>
              )}
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste external image URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (urlInput.trim()) {
                    setCurrentImageSrc(urlInput.trim());
                    setZoom(1);
                    setOffsetX(0);
                    setOffsetY(0);
                    setUrlInput('');
                  }
                }}
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 bg-gray-800 text-white font-bold rounded-xl disabled:opacity-40"
              >
                Load URL
              </button>
            </div>

            {/* Presets if provided */}
            {presetImages.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-gray-500">Marketplace Sample Images:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {presetImages.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentImageSrc(preset.url);
                        setZoom(1);
                        setOffsetX(0);
                        setOffsetY(0);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200 text-gray-700 font-medium whitespace-nowrap text-[11px] transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#F2B84B]" /> {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={!currentImageSrc}
            className="px-6 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white font-bold rounded-xl transition shadow flex items-center gap-1.5 disabled:opacity-40"
          >
            <Check className="w-4 h-4" /> Save & Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};
