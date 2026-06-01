import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReceiptModal({ trackingNumber, onClose, nextRoute }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    if (nextRoute) {
      navigate(nextRoute);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-center relative print:bg-white print:text-black">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white print:hidden"
          >
            <X size={24} />
          </button>
          <CheckCircle2 className="mx-auto text-white print:text-black mb-3" size={48} />
          <h2 className="text-2xl font-bold text-white print:text-black">Success!</h2>
          <p className="text-blue-100 print:text-gray-600 mt-1">Cargo Registered Successfully</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center bg-slate-50 print:bg-white">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tracking Number</p>
          <p className="text-3xl font-mono font-bold text-gray-900 mb-8 tracking-widest">{trackingNumber}</p>
          
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm inline-block mb-6 print:border-black print:shadow-none">
            <QRCodeSVG value={trackingNumber} size={160} level="H" includeMargin={true} />
          </div>
          
          <p className="text-sm text-gray-500 max-w-[250px] mx-auto print:hidden">
            Scan this QR code at any station to quickly pull up the cargo details.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <Printer size={18} /> Print Label
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
