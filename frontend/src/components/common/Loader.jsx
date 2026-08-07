export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin" />
      <p className="text-sm text-navySoft font-medium">{label}</p>
    </div>
  );
}
