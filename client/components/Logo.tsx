interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };


  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="CodeHut" className={`${sizeClasses[size]} object-contain`} />
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Code<span className="text-green-600">Hut</span>
        </span>
      )}
    </div>
  );
}
