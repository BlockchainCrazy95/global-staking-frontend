import './App.css';
import { login, setPublicKey } from './store/walletslice';

import React, { useMemo, useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Modal from './components/Modal';
import ModalM from './components/ModalM';
import Market from "./components/Market";
import MarketItemDetails from './components/MarketItemDetails';
import Staking from './components/Staking';

import { NETWORK } from './config/constants';

export const App = () => {
  return (
      <Content />
  );
};

function Content() {
  const [show, setShow] = useState(false);
  const [showm, setShowm] = useState(false);
  const [shows, setShows] = useState(false);
  const [showd, setShowd] = useState(false);
  const [id, setId] = useState('');
  const [text, setText] = useState('')
  const [showi, setShowi] = useState(false);
  const [texti, setTexti] = useState('');
  
  const dispatch = useDispatch();  
  // console.log('[kg] => connected : ', connected);

  const x = window.innerWidth >= 1050 ? -1200 : window.innerWidth >= 700 ? -1200 : -740;

  return (
    <div className=' overlay'>

      <div style={{ position: "fixed", right: "5%", top: "30px", zIndex: 10000 }}>
        <button className='custom-wallet-button' style={{ 'backgroundColor': '#0c4a6e', 'color': 'white' }} />
      </div>
      <TransformWrapper
        minScale={1}
        maxScale={2}
        initialScale={1}
        initialPositionX={x}
        initialPositionY={1}
        defaultPositionX={1}
        defaultPositionY={1}
      >
        <TransformComponent wrapperClass='castle-overlay' contentClass='castle-bg'>
          <div className='quest-btn click-cursor'>
            <button className='game-button click-cursor' onClick={() => { setShow(true); setText('Quests') }}>
              <div className='title'>Quests</div>
              <img src='../scr/assets/bubble-arrow.c34d2c3a.png' alt='buble' />
            </button>
          </div>

          <div className='jester-container'>
            <div className='jester-wrap'>
              <div className='jester-grandle-btn click-cursor'>
                <button className='game-button click-cursor' onClick={() => { setShows(true); setText('Staking') }}>
                  <div className='title'>Staking</div>
                  <img src='../scr/assets/bubble-arrow.c34d2c3a.png' alt='buble' />
                </button>
              </div>
            </div>
          </div>

          <div className='jester-container'>
            <div className='jester-wrap'>
              <div className='clp-grandle-btn click-cursor'>
                <button className='game-button click-cursor' onClick={() => { setShow(true); setText('LP') }}>
                  <div className='title'><span style={{ color: '#ffe0b7' }}>...</span>LP<span style={{ color: '#ffe0b7' }}>..</span></div>
                  <img src='../scr/assets/bubble-arrow.c34d2c3a.png' alt='buble' />
                </button>
              </div>
            </div>
          </div>

          <div className='land-auction-btn click-cursor'>
            <button className='game-button click-cursor' onClick={() => { setShowm(true); setText('Marketplace') }}>
              <div className='title'>Marketplace</div>
              <img src='../scr/assets/bubble-arrow.c34d2c3a.png' alt='buble' />
            </button>
          </div>

          <div className='sum-btn click-cursor' onClick={() => { setShow(true); setText('Summons') }}>
            <button className='game-button click-cursor'>
              <div className='title'> Summons</div>
              <img src='../scr/assets/bubble-arrow.c34d2c3a.png' alt='buble' />
            </button>
          </div>

        </TransformComponent>
      </TransformWrapper>

      <Modal show={show} setShow={setShow} text={text} />
      <ModalM showm={showm} setShowm={setShowm} text={text} setShowi={setShowi} setTexti={setTexti} />
      <Market showi={showi} setShowm={setShowm} setShowi={setShowi} texti={texti} setId={setId} setShowd={setShowd} />

      <MarketItemDetails showd={showd} setShowd={setShowd} id={id} setId={setId} setShowi={setShowi} />
      <Staking shows={shows} setShows={setShows} />
    </div>

  );
}

export default App;
