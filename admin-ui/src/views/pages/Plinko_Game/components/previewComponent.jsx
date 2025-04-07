import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Engine, Runner, World, Bodies, Body, Events, Composite } from 'matter-js'
import downarrow from '../../../../assets/images/plinko/downarrow.svg'
import '../css/PlinkoBoard.scss'

const PlinkoCanvas = ({
  width,
  height,
  BackgroundColor,
  DotobstaclesColor,
  SideobstaclesColor,
  BallColor,
  Rewards = [3, 2, 1, 0, 1, 2, 3],
  ArrowImage,
}) => {
  const canvasRef = useRef(null)
  const ballBodiesRef = useRef([])
  const ballDropLimit = 5
  const ballDropCountRef = useRef(0)

  // Predetermined target buckets
  const predeterminedLeftTarget = 1
  const predeterminedRightTarget = 5

  // Determine the reward text based on the provided Rewards array.
  // If exactly 4 reward values are provided, compute the pattern "4321234".
  // Otherwise, if 7 values are provided, use them directly.
  let rewardsText = []
  if (Rewards.length === 4) {
    rewardsText[0] = Rewards[3]
    rewardsText[1] = Rewards[2]
    rewardsText[2] = Rewards[1]
    rewardsText[3] = Rewards[0]
    rewardsText[4] = Rewards[1]
    rewardsText[5] = Rewards[2]
    rewardsText[6] = Rewards[3]
  } else {
    rewardsText = Rewards
  }

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1) Create Matter.js engine and runner
    const engine = Engine.create({ enableSleeping: true })
    engine.world.gravity.y = 1
    const runner = Runner.create()
    Runner.run(runner, engine)

    // 2) Board constants
    const rows = 8
    const cols = 7
    const pegRadius = 4
    const slotWidth = width / cols
    const arrowRegionHeight = (height / rows) * 0.8
    const obstacleHeight = 100
    const lineWidth = 3

    // Offsets for peg placement
    const shiftLeft = width * -0.1
    const shiftDown = height * 0.1
    const pegSpacingY = height / (rows + 6)

    // 3) Create pegs using DotobstaclesColor for fill
    const pegs = []
    for (let row = 0; row < rows; row++) {
      const numPegs = row % 2 === 0 ? 8 : 7
      const pegSpacingX = width / (cols + 3)
      for (let i = 0; i < numPegs; i++) {
        const pegX = (i + 1) * pegSpacingX - (row % 2 === 0 ? pegSpacingX / 2 : 0) - shiftLeft
        const pegY = (row + 1) * pegSpacingY + shiftDown
        const peg = Bodies.circle(pegX, pegY, pegRadius, {
          isStatic: true,
          restitution: 0.8,
          friction: 0,
        })
        pegs.push(peg)
      }
    }
    World.add(engine.world, pegs)

    // 4) Create bottom divider obstacles (for bucket separation)
    const bottomObstacles = Array.from({ length: cols - 1 }, (_, i) =>
      Bodies.rectangle(
        (i + 1) * slotWidth,
        height - obstacleHeight / 2,
        lineWidth,
        obstacleHeight,
        { isStatic: true },
      ),
    )
    World.add(engine.world, bottomObstacles)

    // 5) Create floor
    const floor = Bodies.rectangle(width / 2, height, width, 10, {
      isStatic: true,
      restitution: 0,
    })
    World.add(engine.world, floor)

    // 6) Create left & right boundary walls (invisible walls for physics)
    World.add(engine.world, [
      Bodies.rectangle(-10, height / 2, 10, height, { isStatic: true }),
      Bodies.rectangle(width + 10, height / 2, 10, height, { isStatic: true }),
    ])

    // 7) Create visible border obstacles (green lines) with reduced height.
    // Introduce a vertical offset for the borders:
    const borderYOffset = 290 // Adjust this value to bring the borders further down
    const newBorderHeight = height * 0.5 // New, shorter height for the borders

    const leftBorderObstacle = Bodies.rectangle(
      0,
      borderYOffset + newBorderHeight / 2, // vertical center adjusted with offset
      2,
      newBorderHeight,
      { isStatic: true },
    )
    const rightBorderObstacle = Bodies.rectangle(
      width,
      borderYOffset + newBorderHeight / 2,
      2,
      newBorderHeight,
      { isStatic: true },
    )
    World.add(engine.world, [leftBorderObstacle, rightBorderObstacle])

    // 8) Create side obstacles (custom sharper pentagon obstacles)
    const rawVertices = [
      { x: 47, y: 42 },
      { x: 50, y: 50 },
      { x: 47, y: 58 },
      { x: 20, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 100 },
      { x: 20, y: 100 },
    ]
    const centroid = rawVertices.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }), {
      x: 0,
      y: 0,
    })
    centroid.x /= rawVertices.length
    centroid.y /= rawVertices.length
    const centeredVertices = rawVertices.map((v) => ({
      x: v.x - centroid.x,
      y: v.y - centroid.y,
    }))
    const scaleFactor = 0.5
    const scaledCenteredVertices = centeredVertices.map((v) => ({
      x: v.x * scaleFactor,
      y: v.y * scaleFactor,
    }))
    const scaledMirroredVertices = scaledCenteredVertices.map((v) => ({
      x: -v.x,
      y: v.y,
    }))

    const topY = shiftDown + pegSpacingY
    const numObstacles = 3
    const polygonGap = 72
    const startingPolygonY = topY + 20
    const leftCenterX = 8
    const rightCenterX = width - 8
    const heightScaleFactor = 1.3

    const leftCustomObstacles = []
    const rightCustomObstacles = []
    for (let i = 0; i < numObstacles; i++) {
      const centerY = startingPolygonY + i * polygonGap

      const leftObstacle = Bodies.fromVertices(
        leftCenterX,
        centerY,
        [scaledCenteredVertices],
        {
          isStatic: true,
          restitution: 0.8,
          friction: 0,
          render: {
            fillStyle: SideobstaclesColor,
            strokeStyle: SideobstaclesColor,
            lineWidth: 1,
          },
        },
        true,
      )
      Body.scale(leftObstacle, 1, heightScaleFactor)
      leftCustomObstacles.push(leftObstacle)

      const rightObstacle = Bodies.fromVertices(
        rightCenterX,
        centerY,
        [scaledMirroredVertices],
        {
          isStatic: true,
          restitution: 0.8,
          friction: 0,
          render: {
            fillStyle: SideobstaclesColor,
            strokeStyle: SideobstaclesColor,
            lineWidth: 1,
          },
        },
        true,
      )
      Body.scale(rightObstacle, 1, heightScaleFactor)
      rightCustomObstacles.push(rightObstacle)
    }
    World.add(engine.world, leftCustomObstacles.concat(rightCustomObstacles))

    // 9) After each update, force every ball’s horizontal velocity toward its target bucket center.
    const funnelThreshold = height * 0.7
    Events.on(engine, 'afterUpdate', () => {
      ballBodiesRef.current.forEach((ball) => {
        if (!ball.isStatic && ball.position.y > funnelThreshold) {
          const tb = ball.targetBucket
          const targetCenter = (tb + 0.5) * slotWidth
          const tolerance = 1 // pixels
          const dx = targetCenter - ball.position.x
          if (Math.abs(dx) > tolerance) {
            const desiredVX = Math.sign(dx) * 1
            Body.setVelocity(ball, { x: desiredVX, y: ball.velocity.y })
          } else {
            Body.setVelocity(ball, { x: 0, y: ball.velocity.y })
          }
        }
      })
    })

    // 10) Create tinted arrow (drop indicator)
    const arrowImg = new Image()
    arrowImg.src = ArrowImage || downarrow
    let tintedArrowCanvas = null
    const createTintedArrow = () => {
      tintedArrowCanvas = document.createElement('canvas')
      tintedArrowCanvas.width = 58
      tintedArrowCanvas.height = 58
      const tintedCtx = tintedArrowCanvas.getContext('2d')
      if (tintedCtx) {
        tintedCtx.drawImage(arrowImg, 0, 0, 20, 20)
        tintedCtx.globalCompositeOperation = 'source-in'
        tintedCtx.fillStyle = SideobstaclesColor || '#C926AE'
        tintedCtx.fillRect(0, 0, 24, 24)
        tintedCtx.globalCompositeOperation = 'source-over'
      }
    }
    if (arrowImg.complete) {
      createTintedArrow()
    } else {
      arrowImg.onload = createTintedArrow
    }

    // 11) Render loop (draw board, obstacles, pegs, arrows, rewards, balls, borders)
    let animationFrameId
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      // Use BackgroundColor prop for board background
      ctx.fillStyle = BackgroundColor
      ctx.fillRect(0, 0, width, height)

      // Draw side obstacles using SideobstaclesColor
      ctx.fillStyle = SideobstaclesColor
      leftCustomObstacles.concat(rightCustomObstacles).forEach((obstacle) => {
        ctx.beginPath()
        const { vertices } = obstacle
        ctx.moveTo(vertices[0].x, vertices[0].y)
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y)
        }
        ctx.closePath()
        ctx.fill()
      })

      // Draw pegs using DotobstaclesColor
      ctx.fillStyle = DotobstaclesColor
      pegs.forEach(({ position }) => {
        ctx.beginPath()
        ctx.arc(position.x, position.y, pegRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw top arrows (drop indicator)
      const arrowCount = cols + 2
      const arrowSpacing = (width / arrowCount) * 0.95
      for (let i = 0; i < arrowCount; i++) {
        const offsetX = 25
        const x = (i + 0.5) * arrowSpacing + offsetX
        if (tintedArrowCanvas) {
          ctx.drawImage(tintedArrowCanvas, x - 24, arrowRegionHeight - 24, 48, 48)
        }
      }

      // Draw bottom dividers using DotobstaclesColor
      ctx.fillStyle = DotobstaclesColor
      bottomObstacles.forEach((ob) => {
        ctx.beginPath()
        ctx.moveTo(ob.vertices[0].x, ob.vertices[0].y)
        ob.vertices.slice(1).forEach(({ x, y }) => ctx.lineTo(x, y))
        ctx.closePath()
        ctx.fill()
      })

      // Draw reward text from rewardsText array.
      ctx.fillStyle = DotobstaclesColor || '#427AD0'
      ctx.font = '15px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      rewardsText.forEach((reward, index) => {
        const text = typeof reward === 'object' && reward !== null ? reward.reward : reward
        const bucketWidth = width / 7
        const x = (index + 0.5) * bucketWidth
        const maxWidth = bucketWidth * 0.8
        const lineHeight = 18
        const startY = height - 30

        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
          let words = text.split(' ')
          let line = ''
          let lines = []

          for (let i = 0; i < words.length; i++) {
            let testLine = line + (line ? ' ' : '') + words[i]
            let testWidth = ctx.measureText(testLine).width

            if (testWidth > maxWidth && line) {
              lines.push(line)
              line = words[i]
            } else {
              line = testLine
            }
          }
          lines.push(line)

          lines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * lineHeight)
          })
        }

        wrapText(ctx, text, x, startY, maxWidth, lineHeight)
      })

      // Draw balls using BallColor
      ballBodiesRef.current.forEach(({ position, circleRadius }) => {
        ctx.fillStyle = BallColor
        ctx.beginPath()
        ctx.arc(position.x, position.y, circleRadius || 10, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw borders (green obstacles) with the updated vertical offset
      const borderDisplayHeight = newBorderHeight
      ctx.strokeStyle = DotobstaclesColor
      ctx.lineWidth = 7

      // Left border: start drawing from borderYOffset
      ctx.beginPath()
      ctx.moveTo(0, borderYOffset)
      ctx.lineTo(0, borderYOffset + borderDisplayHeight)
      ctx.stroke()

      // Right border: start drawing from borderYOffset
      ctx.beginPath()
      ctx.moveTo(width, borderYOffset)
      ctx.lineTo(width, borderYOffset + borderDisplayHeight)
      ctx.stroke()

      // Bottom border remains the same
      ctx.beginPath()
      ctx.moveTo(0, height)
      ctx.lineTo(width, height)
      ctx.stroke()

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    // 12) Handle canvas clicks to drop balls
    const handleCanvasClick = (e) => {
      if (ballDropCountRef.current >= ballDropLimit) return
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      if (clickX < 0 || clickX > width) return
      console.log('Dropping ball at x =', clickX)
      const ball = Bodies.circle(clickX, arrowRegionHeight, 10, {
        restitution: 0.5,
        friction: 0,
        sleepThreshold: 60,
      })
      ball.targetBucket = clickX <= width / 2 ? predeterminedLeftTarget : predeterminedRightTarget
      ballBodiesRef.current.push(ball)
      World.add(engine.world, ball)
      ballDropCountRef.current += 1
    }
    canvas.addEventListener('click', handleCanvasClick)

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('click', handleCanvasClick)
      cancelAnimationFrame(animationFrameId)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [
    height,
    width,
    BackgroundColor,
    DotobstaclesColor,
    SideobstaclesColor,
    BallColor,
    Rewards,
    ArrowImage,
  ])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="plinko-canvas"
      role="img"
      aria-label="Interactive plinko game board"
    />
  )
}

PlinkoCanvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  BackgroundColor: PropTypes.string.isRequired,
  DotobstaclesColor: PropTypes.string.isRequired,
  SideobstaclesColor: PropTypes.string.isRequired,
  BallColor: PropTypes.string.isRequired,
  Rewards: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  ),
  ArrowImage: PropTypes.string,
}

export default PlinkoCanvas
