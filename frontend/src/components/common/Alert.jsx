export default function Alert({ type = 'info', children }) {
  const styles = {
    info: 'bg-goldSoft border-navy text-navy',
    error: 'bg-[#FCEAE6] border-[#C0392B] text-[#C0392B]',
    success: 'bg-[#DCF3E3] border-[#2E9E5B] text-[#2E9E5B]',
  };

  return (
    <div className={`border-2 rounded-xl px-4 py-3 text-sm font-medium ${styles[type]}`}>
      {children}
    </div>
  );
}
