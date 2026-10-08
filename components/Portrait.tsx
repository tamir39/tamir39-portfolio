import Image from "next/image";

export function Portrait({ className, sizes, priority = false }: { className: string; sizes: string; priority?: boolean }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full ${className}`}>
      <div className="absolute inset-[-12.5%]">
        <Image src="/avatar.jpg" alt="Tamir speaking into a microphone" fill sizes={sizes} quality={95} priority={priority} className="object-cover object-[52%_24%]" />
      </div>
    </div>
  );
}
