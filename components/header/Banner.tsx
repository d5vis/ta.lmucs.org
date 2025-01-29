const Banner = ({ body }: { body: React.ReactNode }) => {
  return (
    <div className="z-40 motion-preset-slide-down motion-delay-200 z-40 w-full bg-gradient-to-r from-lmublue to-lmucrimson text-white p-1 text-sm">
      {body}
    </div>
  )
}

export default Banner
