import React from 'react';


//lazy load particular component
const GamePage = React.lazy(() => import('./pages/GamePage'))

//Routes
const routes=[
      {
        path: '/game',
        exact: true,
        name: 'Game',
        element: GamePage,
      },
]

export default routes;