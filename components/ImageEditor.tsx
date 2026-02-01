
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { 
  Wand2, 
  Upload, 
  Download, 
  RefreshCcw, 
  Sparkles, 
  Camera, 
  Image as ImageIcon,
  Loader2,
  Trash2
} from 'lucide-react';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await editImageWithGemini(image, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        setError("AI returned an empty response. Try a different prompt.");
      }
    } catch (err) {
      setError("Failed to process image. Please check your API key and connection.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    const target = editedImage || image;
    if (!target) return;
    const link = document.createElement('a');
    link.href = target;
    link.download = 'lansky_edited_product.png';
    link.click();
  };

  const reset = () => {
    setImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
  };

  const SUGGESTIONS = [
    "Clean background",
    "Add a retro film filter",
    "Increase brightness and contrast",
    "Put the item in a luxury setting",
    "Make colors more vibrant"
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            AI Product Studio <Sparkles className="text-blue-500 fill-blue-500" />
          </h1>
          <p className="text-slate-500 mt-1">Enhance your product photos with Gemini 2.5 Flash Image.</p>
        </div>
        {(image || editedImage) && (
          <button 
            onClick={reset}
            className="text-slate-400 hover:text-rose-500 flex items-center gap-2 font-medium transition-colors"
          >
            <Trash2 size={18} /> Clear Studio
          </button>
        )}
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center min-h-[500px] border-4 border-dashed border-slate-200 rounded-[40px] bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
        >
          <div className="p-8 rounded-full bg-slate-50 group-hover:bg-blue-100 transition-colors mb-6">
            <ImageIcon size={64} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Drop your product photo</h2>
          <p className="text-slate-500 mt-2">or click to browse your computer</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <Camera size={16} /> Webcam supported
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
              <Sparkles size={16} /> AI Powered
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workspace Side */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Wand2 size={20} className="text-blue-600" /> AI Instruction
              </h3>
              <div className="space-y-4">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Remove the messy background and place this on a marble countertop..."
                  className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 resize-none transition-all"
                />
                
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button 
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleEdit}
                  disabled={isProcessing || !prompt}
                  className={`
                    w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all
                    ${isProcessing || !prompt 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700'}
                  `}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Gemini is thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Enhancement
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl font-medium">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={downloadImage}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
              >
                <Download size={20} />
                Download Final
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all"
              >
                <RefreshCcw size={20} />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="space-y-4">
            <div className="relative group aspect-square bg-slate-100 rounded-[40px] overflow-hidden border border-slate-200">
              <img 
                src={editedImage || image} 
                alt="Product Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest">
                {editedImage ? 'AI Generated' : 'Original Photo'}
              </div>
              {editedImage && (
                <button 
                  onClick={() => setEditedImage(null)}
                  className="absolute bottom-6 left-6 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-full uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-colors"
                >
                  Compare Original
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
