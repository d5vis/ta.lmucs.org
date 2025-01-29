import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <div className="flex items-center justify-center pl-4 rounded-2xl text-lmublue font-[family-name:var(--font-metric-bold)]">
      <Link href="/">
        <h1 className="flex items-center gap-1 justify-center text-3xl bg-clip-text transition-all">
          <Image
            src="/logo512.png"
            alt="lion"
            width="512"
            height="512"
            className="max-h-6 max-w-6"
          />{' '}
          LMUCS
        </h1>
      </Link>
    </div>
  )
}

export default Logo
