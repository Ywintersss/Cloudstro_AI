import React from 'react';

export interface OverlayState {
  isVisible: boolean;
  status: 'loading' | 'success' | 'error';
  message: string;
}

interface StatusOverlayProps {
  overlay: OverlayState;
  onClose: () => void;
}

const StatusOverlayLoader: React.FC<StatusOverlayProps> = ({ overlay, onClose }) => {
  const getOverlayIcon = () => {
    switch (overlay.status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        );
      case 'success':
        return (
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getOverlayColors = () => {
    switch (overlay.status) {
      case 'loading':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const getTitle = () => {
    switch (overlay.status) {
      case 'loading':
        return 'Generating Content';
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error Occurred';
      default:
        return '';
    }
  };

  if (!overlay.isVisible) return null;

  const colors = getOverlayColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 p-8 rounded-2xl border-2 ${colors.bg} ${colors.border} shadow-2xl`}>
        <div className="text-center">
          {getOverlayIcon()}
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {getTitle()}
          </h3>
          <p className="text-gray-600 mb-6">
            {overlay.message}
          </p>
          {overlay.status !== 'loading' && (
            <button
              onClick={onClose}
              className={`px-6 py-2 text-white rounded-lg transition-colors font-medium ${colors.button}`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusOverlayLoader;