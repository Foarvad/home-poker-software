import { styled } from '@stitches/react';

import { CardSelector } from './components/CardSelector';

import './App.css'

function App() {


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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '50vh',
    transform: 'translateY(-50%)'
  })


  return (
    <div>
      <StyledHeader>
        Hand 22
      </StyledHeader>
      <StyledWrapper>
        <div>
          <CardSelector suit='spade' />
          <CardSelector suit='heart' />
        </div>
        <div>
          <CardSelector suit='club' />
          <CardSelector suit='diamond' />
        </div>
      </StyledWrapper>
    </div>
  )
}

export default App
