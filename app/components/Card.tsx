// Card.tsx
import React from 'react';
import './Card.css';

type CardProps = {
    width?: number;
    height?: number;
    borderRadius?: number;
    customTitle?: string;
    titleColor?: string;
    textColor?: string;
    iconColor?: string;
    bgColor?: string;
    borderColor?: string;
    titlePrefixIcon?: JSX.Element;
    hideBorder?: boolean;
    hideTitle?: boolean;
    children?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
                                       width = 300,
                                       height = 200,
                                       borderRadius = 8,
                                       customTitle,
                                       titleColor = '#9745f5',
                                       textColor = '#ffffff',
                                       iconColor = '#9f4bff',
                                       bgColor = '#000000',
                                       borderColor = '#9745f5',
                                       titlePrefixIcon,
                                       hideBorder = false,
                                       hideTitle = false,
                                       children,
                                   }) => {
    return (
        <div
            className="card"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: `${borderRadius}px`,
                backgroundColor: bgColor,
                borderColor: hideBorder ? 'transparent' : borderColor,
            }}
        >
            {!hideTitle && (
                <div className="card-header" style={{ color: titleColor }}>
                    {titlePrefixIcon && (
                        <span className="icon" style={{ color: iconColor }}>
                            {titlePrefixIcon}
                        </span>
                    )}
                    <h2>{customTitle || 'Default Title'}</h2>
                </div>
            )}
            <div className="card-body" style={{ color: textColor }}>
                {children}
            </div>
        </div>
    );
};

export default Card;