import Image from "next/image"

interface LogoSvgProps {
  priority?: boolean
}

export function LogoSvg({ priority = false }: LogoSvgProps) {
  return (
    <div className="custom-logo">
      <Image
        src="/images/webfuzsion-logo-outline.png"
        alt="WebFuZsion"
        width={180}
        height={40}
        priority={priority}
        className="h-8 md:h-10 w-auto"
      />
    </div>
  )
}
