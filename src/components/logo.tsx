import Image from 'next/image'

interface LogoProps {
  variant?: 'default' | 'white'
  className?: string
  width?: number
  height?: number
}

export function Logo({ variant = 'default', className, width = 150, height = 50 }: LogoProps) {
  const src = variant === 'white' 
    ? '/images/logo transul branca.png'
    : '/images/Logo Transul.png'

  return (
    <div className={className}>
      <Image
        src={src}
        alt="Transul Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  )
}
