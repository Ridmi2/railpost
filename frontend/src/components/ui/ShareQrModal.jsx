import { useState } from 'react';
import { X, Mail, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { senderApi } from '../../api/endpoints/senderApi';

export default function ShareQrModal({ trackingNumber, onClose }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    try {
      await senderApi.shareQrCode(trackingNumber, email);
      toast.success('QR Code sent successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send QR Code');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" 
           onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Share Tracking QR Code</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-5">
            Send the tracking QR code and link for cargo <span className="font-mono font-bold text-blue-600">{trackingNumber}</span> to anyone via email.
          </p>

          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                           hover:bg-gray-50 font-medium text-sm transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={sending || !email}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl
                           hover:bg-blue-700 disabled:bg-blue-400 font-medium text-sm transition-colors
                           flex items-center justify-center gap-2">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Sending...' : 'Send QR Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
