import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="p-4">
      made with{' '}
      <Link
        href="https://github.com/d5vis/ta.lmucs.org"
        target="_blank"
        className="text-lmucrimson"
      >
        &lt;3
      </Link>
      {' at '}
      <span className="text-lmublue">loyola marymount university</span>
    </footer>
  )
}

export default Footer
