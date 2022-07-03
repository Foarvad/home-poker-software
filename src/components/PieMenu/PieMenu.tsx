// Article used: https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936

import { styled } from "@stitches/react"
import { ReactNode, useCallback, useState } from "react";
import throttle from 'lodash.throttle';

type PieMenuOption = {
    label: string;
    value: string;
}

type PieMenuProps = {
    opened: boolean;
    options: PieMenuOption[];
    children: ReactNode;
    centerSymbol?: string;
    onSelect: (value: string) => void;
    onTouchStart?: Function;
    onTouchEnd?: Function;
}

const StyledWrapper = styled('div', {
    position: "relative",
    display: "inline-flex",
})

const StyledSvg = styled('svg', {
    width: 'min(80vw, 50vh)',
    height: 'min(80vw, 50vh)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
})

const StyledSlice = styled('path', {
    transition: 'all .5s ease',
    fill: "grey",
    stroke: 'white',
    strokeWidth: '.01',
})

const StyledOptionText = styled('text', {
    fill: "white",
    fontSize: '0.23px',
    fontWeight: 500,
    dominantBaseline: "middle",
    textAnchor: "middle",
})

const StyledSliceGroup = styled('g', {
    // '&:hover, &:active': {
    //     [`${StyledSlice}`]: {
    //         fill: 'black',
    //     }
    // },
    variants: {
        hover: {
            true: {
                [`${StyledSlice}`]: {
                    fill: 'black',
                }
            }
        }
    }
})

const StyledCenterCircle = styled('circle', {
    stroke: "white",
    strokeWidth: 0.01,
});

const StyledCenterSymbol = styled('text', {
    fontSize: '0.2px',
    fill: "white",
    dominantBaseline: "middle",
    textAnchor: "middle",
    // For Safari
    pointerEvents: "none",
})

const ChildrenWrapper = styled('div', {

});

const getCoordinatesForPercent = (percent: number) => {
    const precision = 2;
    const rotationOffset = -0.25; // Start drawing from the top instead of right
    const x = +Math.cos(2 * Math.PI * (percent + rotationOffset)).toFixed(precision);
    const y = +Math.sin(2 * Math.PI * (percent + rotationOffset)).toFixed(precision);
    return [x, y];
}

export const PieMenu: React.FC<PieMenuProps> = ({ opened, options, centerSymbol, children, onSelect, onTouchStart, onTouchEnd }) => {

    const [hoveringElement, setHoveringElement] = useState<string | null>(null);

    const slicePercent = 1 / options.length;

    const handleTouchStart = useCallback((e: any) => {
        onTouchStart?.();
    }, []);

    const handleTouchMove = useCallback(throttle((e) => {
        const overTarget = document.elementFromPoint(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
        )?.parentElement;

        const elementValue = overTarget?.getAttribute('data-value');

        if (elementValue) {
            setHoveringElement(elementValue);
        } else {
            setHoveringElement(null);
        }
    }, 75), []);

    const handleTouchEnd = useCallback((e: any) => {
        const endTarget = document.elementFromPoint(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
        )?.parentElement;
        const elementValue = endTarget?.getAttribute('data-value');

        if (elementValue) {
            setHoveringElement(null);
            onSelect(elementValue);
        }
        onTouchEnd?.();
    }, []);

    return (
        <StyledWrapper>
            <ChildrenWrapper onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>{children}</ChildrenWrapper>
            {opened && (
                <StyledSvg width={2} height={2} viewBox="-1 -1 2 2">

                    {/* Invisible placeholder to prevent unwanted behaviour in Safari */}
                    <rect x={-1} y={-1} width={2} height={2} fillOpacity={0}></rect>

                    {options.map((option, i) => {
                        let startPercent = slicePercent * i;
                        let endPercent = slicePercent * (i + 1);

                        const [startX, startY] = getCoordinatesForPercent(startPercent);
                        const [endX, endY] = getCoordinatesForPercent(endPercent);

                        // if the slice is more than 50%, take the large arc (the long way around)
                        const largeArcFlag = slicePercent > .5 ? 1 : 0;

                        const pathData = [
                            `M ${startX} ${startY}`, // Move
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                            `L 0 0`, // Line
                        ].join(' ');

                        // TODO: add unified presicion for this component
                        const [textX, textY] = [(endX + startX) / 2.5, (endY + startY) / 2.5];

                        return (
                            <StyledSliceGroup
                                key={`${option.value}`}
                                data-value={option.value}
                                hover={hoveringElement === option.value}
                            >
                                <StyledSlice d={pathData} />
                                <StyledOptionText x={textX} y={textY}>{option.label}</StyledOptionText>
                            </StyledSliceGroup>
                        )
                    })}
                    <g>
                        <StyledCenterCircle r={0.2} />
                        <StyledCenterSymbol y={0.02}>{centerSymbol}</StyledCenterSymbol>
                    </g>
                </StyledSvg>
            )
            }
        </StyledWrapper >
    )

}