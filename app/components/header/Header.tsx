import Logo from './Logo'
import AppBar from './AppBar'

// const BANNER_CONTENT = ''
const BANNER_CONTENT = (
  <div>
    LMUHacks 2025 is happening on March 15th! {''}
    <a
      href="https://forms.gle/javPabKzcZUhi6f46"
      target="_blank"
      className="underline"
    >
      Register now!
    </a>
  </div>
)

const Header = () => {
  return (
    <div className="sticky top-0 flex flex-col z-50">
      <div className="z-50 grid grid-cols-[auto_1fr] min-w-screen gap-2 p-2 bg-background border-b">
        <Logo />
        <AppBar />
      </div>
      {BANNER_CONTENT && (
        <div className="z-40 motion-preset-slide-down motion-delay-200 z-40 w-full bg-lmublue text-white p-1 text-sm">
          {BANNER_CONTENT}
        </div>
      )}
    </div>
  )
}

export default Header
