interface TestResultProps {
  result: string | null;
  logs: string[];
}

export default function TestResult({ result, logs }: TestResultProps) {
  return (
    <div className="space-y-6">
      {result && (
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Resultaat:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-60">
            {result}
          </pre>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-900 mb-2">📝 Recente Tests</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">Nog geen activiteit</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log, i) => (
              <p key={i} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}