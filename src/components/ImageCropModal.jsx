import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../lib/canvasUtils";
import { Button } from "./ui/Button";
import { X, Crop } from "lucide-react";
import toast from "react-hot-toast";

export const ImageCropModal = ({ isOpen, imageSrc, aspect, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setProcessing(true);
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBase64);
    } catch (e) {
      toast.error("Erro ao processar o recorte da imagem.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-monster-dark/90 backdrop-blur-sm p-4">
      <div className="bg-[#1c1c1c] border border-monster-neon/50 w-full max-w-2xl clip-diagonal shadow-[0_0_30px_rgba(57,255,20,0.15)] flex flex-col relative overflow-hidden">
        
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0 relative z-10 bg-[#1c1c1c]">
          <h3 className="text-xl font-display uppercase tracking-widest text-white flex items-center gap-2">
            <Crop className="h-5 w-5 text-monster-neon" /> Posicionar Imagem
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-monster-red transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative w-full h-[50vh] min-h-[300px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            cropShape={aspect === 1 ? "round" : "rect"}
            showGrid={true}
          />
        </div>

        <div className="p-4 border-t border-white/10 space-y-4 shrink-0 relative z-10 bg-[#1c1c1c]">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-monster-neon h-2 bg-monster-dark appearance-none rounded-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <Button variant="outline" onClick={onClose} disabled={processing}>Cancelar</Button>
            <Button onClick={handleConfirm} disabled={processing}>
              {processing ? "Recortando..." : "Confirmar Recorte"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
