export default function LoadingUI() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
      </div>
    </div>
  );
}
