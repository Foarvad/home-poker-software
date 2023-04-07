import { styled } from '@stitches/react';

import { HandSelector } from './features/HandSelector';

import './App.css'
import { useEffect, useRef } from 'react';

const StyledWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
})

const StyledHeader = styled('header', {
  height: '25vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '3rem',
  backgroundColor: 'green',
})

const StyledMain = styled('main', {
  flexGrow: 1,
  backgroundColor: 'purple',
})

const StyledFooter = styled('footer', {
  height: '15vh',
  backgroundColor: 'black',
})

function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const setWindowHeight = () => {
    if (wrapperRef.current){
      wrapperRef.current.style.height = `${window.innerHeight}px`;
    }
  }

  // Set page height to current inner height using JS (because IOS toolbar overflows content if we set height to 100vh)
  useEffect(() => {
    setWindowHeight();

    addEventListener('resize', setWindowHeight);
    return () => {
      removeEventListener('resize', setWindowHeight);
    }
  }, []);

  return (
    <StyledWrapper ref={wrapperRef}>
      <StyledHeader>
        Hand 22
      </StyledHeader>
      <StyledMain>
        <HandSelector />
      </StyledMain>
      <StyledFooter>

      </StyledFooter>
    </StyledWrapper>
  )
}

export default App
