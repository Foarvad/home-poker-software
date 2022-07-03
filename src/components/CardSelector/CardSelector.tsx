import { styled } from "@stitches/react"
import { useMemo, useState } from "react";
import { PieMenu } from "../PieMenu";

type CardSuit = 'spade' | 'heart' | 'diamond' | 'club';

type CardSelectorProps = {
    suit: CardSuit;
}

const StyledButton = styled('button', {
    width: 'min(15vw, 15vh)',
    height: 'min(15vw, 15vh)',
    fontSize: '1.5rem',
})

const cards = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

const cardOptions = cards.map((card) => ({ label: card, value: card }));

export const CardSelector: React.FC<CardSelectorProps> = ({ suit }) => {
    const [isMenuOpened, setMenuOpened] = useState(false);

    const handleTouchStart = () => {
        setMenuOpened(true);
    }

    const handleTouchEnd = () => {
        setMenuOpened(false);
    }

    const handleSelect = (value: string) => {
        alert(`SELECTED: ${value}`);
    }

    const suitSymbol = useMemo(() => {
        switch (suit) {
            case 'spade':
                return '♠';
            case 'heart':
                return '♥';
            case 'diamond':
                return '♣';
            case 'club':
                return '♦';
        }
    }, [suit])

    return (
        <PieMenu opened={isMenuOpened} options={cardOptions} centerSymbol={suitSymbol} onSelect={handleSelect} onTouchStart={(handleTouchStart)} onTouchEnd={(handleTouchEnd)}>
            <StyledButton>{suitSymbol}</StyledButton>
        </PieMenu>
    )

}