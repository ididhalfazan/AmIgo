import Image from "next/image";

type AvatarProps = {
  name: string;
  color: string;
  size?: number;
  src?: string | null;
};

export function Avatar({ name, color, size = 40, src }: AvatarProps) {
  const initials = name.trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
