import Logo from './Logo'
import AppBar from './AppBar'
import Banner from './Banner'

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
      {/* {BANNER_CONTENT && <Banner body={BANNER_CONTENT} />} */}
    </div>
  )
}

export default Header
