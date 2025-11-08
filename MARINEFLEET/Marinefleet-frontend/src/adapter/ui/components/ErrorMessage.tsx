// Error Message Component

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning';
}

export const ErrorMessage = ({ message, onRetry, variant = 'error' }: ErrorMessageProps) => {
  const isWarning = variant === 'warning';
  const bgColor = isWarning ? 'bg-yellow-50' : 'bg-red-50';
  const textColor = isWarning ? 'text-yellow-800' : 'text-red-800';
  const borderColor = isWarning ? 'border-yellow-200' : 'border-red-200';
  const buttonColor = isWarning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className={`p-4 ${bgColor} ${borderColor} border rounded-md`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`ml-4 px-3 py-1 text-xs text-white rounded ${buttonColor}`}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};


