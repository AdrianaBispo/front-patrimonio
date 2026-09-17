
export default function ErrorLabel({ message, children }) {
  const content = message || children;

  if (!content) return null;

  return (
    <span className="text-xs text-red-500 mt-1 block">
      {content}
    </span>
  );
}