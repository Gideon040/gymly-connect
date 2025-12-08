interface MessagePreviewProps {
  date: string;
  message: string;
  color?: 'green' | 'orange' | 'purple' | 'blue';
}

const colorClasses = {
  green: 'bg-green-50 border-green-200 text-green-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function MessagePreview({ date, message, color = 'green' }: MessagePreviewProps) {
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <p className="text-sm font-medium mb-1">📱 Preview:</p>
      <p className="text-sm">
        &quot;Your appointment is coming up on <strong>{date}</strong> at <strong>{message}</strong>. If you need to change it, please reply back and let us know.&quot;
      </p>
    </div>
  );
}