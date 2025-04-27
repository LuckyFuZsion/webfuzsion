import Image from "next/image"

export function LogoSvg() {
  return (
    <div className="relative h-8 w-auto">
      <Image
        src="/images/webfuzsion-logo.png"
        alt="WebFuZsion"
        width={240}
        height={60}
        className="h-full w-auto"
        priority
      />
    </div>
  )
}
