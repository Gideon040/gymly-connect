interface ConfigCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ConfigCard({ title, children, className = '' }: ConfigCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}