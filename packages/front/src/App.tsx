import { styled } from '@stitches/react';

import { HandSelector } from './features/HandSelector';

import './App.css'

const StyledHeader = styled('div', {
  position: 'absolute',
  width: '100vw',
  top: 0,
  height: '20vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '3rem',
})

const StyledWrapper = styled('div', {
  marginTop: '50vh',
  transform: 'translateY(-50%)'
})


function App() {
  return (
    <div>
      <StyledHeader>
        Hand 22
      </StyledHeader>
      <StyledWrapper>
        <HandSelector />
      </StyledWrapper>
    </div>
  )
}

export default App
