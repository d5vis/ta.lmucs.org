const Banner = ({ body }: { body: React.ReactNode }) => {
  return (
    <div className="z-40 motion-preset-slide-down motion-delay-200 w-full bg-gradient-to-r from-lmublue via-lmucrimson to-lmublue bg-[size:200%] hover:bg-right text-white p-1 text-sm transition-all duration-500">
      {body}
    </div>
  )
}

export default Banner
