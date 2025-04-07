import './spinwheel.scss'
export const SpinningWheel = ({
  settings,
  howMuchToSpin,
  rouletteIsSpinning,
  wheelImage, // Accept wheel image as a prop
}) => {
  console.log('wheelImage', wheelImage)
  console.log('settings', settings)
  return (
    <div className="spinning-wheel-content">
      <div
        style={{
          '--duration': rouletteIsSpinning ? '6s' : '0s',
          '--rotation': `${howMuchToSpin}deg`,
        }}
      >
        <div className={`roulette-wheel ${rouletteIsSpinning ? 'spinning' : 'ready-to-spin'}`}>
          <img src={wheelImage} className="wheel-image" alt="Spinning Wheel" />
          {/* <LazyLoadImage
            className='wheel-image'
            // height={500}
            // width={500}
            // alt={skeletonImg}
            effect="opacity"
            // wrapperProps={{
            //   // If you need to, you can tweak the effect transition using the wrapper style.
            //   style: { transitionDelay: '1s' },
            // }}
            src={wheelImage}
          /> */}
          {settings?.prizeList?.map((item, index) => (
            <div
              className="wheel-text-item"
              key={`slot-${index}`}
              style={{
                '--nb-item': index,
                '--nb-items': settings.prizeList.length,
              }}
            >
              <div className="wheel-text">
                <h1>
                  {typeof item === 'string' && item.length > 0
                    ? item.charAt(0).toUpperCase() + item.slice(1)
                    : ''}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/*import React, { useRef, useEffect, useState } from 'react'

export const SpinningWheel = ({ settings, howMuchToSpin, rouletteIsSpinning, onSpinEnd }) => {
  const canvasRef = useRef(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const size = canvas.width / 2

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(size, size)
      ctx.rotate((rotation * Math.PI) / 180)

      const numSlices = settings?.prizeList?.length || 6
      const sliceAngle = (2 * Math.PI) / numSlices

      settings.prizeList.forEach((item, i) => {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, size, i * sliceAngle, (i + 1) * sliceAngle)
        ctx.fillStyle = i % 2 === 0 ? '#f00' : '#ff0'
        ctx.fill()
        ctx.stroke()

        // Draw text
        ctx.save()
        ctx.fillStyle = 'black'
        ctx.rotate(i * sliceAngle + sliceAngle / 2)
        ctx.textAlign = 'center'
        ctx.fillText(item, size / 2, 10)
        ctx.restore()
      })
      ctx.restore()
    }

    drawWheel()
  }, [rotation, settings])

  useEffect(() => {
    if (rouletteIsSpinning) {
      let currentRotation = 0
      let speed = 20
      let deceleration = 0.98
      let animationFrame

      const spin = () => {
        currentRotation += speed
        speed *= deceleration
        setRotation(currentRotation)
        if (speed > 0.1) {
          animationFrame = requestAnimationFrame(spin)
        } else {
          cancelAnimationFrame(animationFrame)
          onSpinEnd && onSpinEnd()
        }
      }
      spin()
    }
  }, [rouletteIsSpinning])

  return <canvas ref={canvasRef} width={300} height={300}></canvas>
}

export default SpinningWheel
*/
