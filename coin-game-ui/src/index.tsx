import React from "react";
import ReactDOM from "react-dom/client";
import GamePage from "./pages/GamePage";

const render = (id: string = "root",imgUrl?:string) => {
  const rootElement = document.getElementById(id);

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = ReactDOM.createRoot(rootElement);

  //Game page
  root.render(
    <React.StrictMode>
      <GamePage backgroundImage={imgUrl}/>
    </React.StrictMode>
  );
};

//gobal declare  window object
declare global {
  interface Window {
    coinFlip: {
      render: (id?: string,imgUrl?: string) => void;
    };
  }
}

//export this window object with  like this (render())
render();

window.coinFlip = window.coinFlip || {};
window.coinFlip.render = render;




export { render };