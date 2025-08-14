export function InputOTPCode({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <div className={`w-full max-w-sm ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value.replace(/\D/g, '');
          onChange(newValue);
        }}
        placeholder="000000"
        className="w-full h-16 px-6 text-center text-2xl font-semibold tracking-[0.5em] rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/40 shadow-lg transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 focus:border-white/40"
      />
    </div>
  );
}
