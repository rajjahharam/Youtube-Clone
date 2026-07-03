import { useEffect } from "react";
import { X } from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const ComingSoonModal = ({ isOpen, onClose, featureName }: ComingSoonModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-neutral-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="mx-auto w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-4xl">
          🚧
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-2">{featureName}</h2>
        <p className="text-neutral-400 text-lg mb-6">
          This feature is coming soon!
        </p>
        
        <p className="text-neutral-500 mb-8">
          We're working hard to bring the best experience to you.<br />
          Thank you for your patience!
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-white text-black font-medium rounded-2xl hover:bg-neutral-200 transition-all cursor-pointer"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;