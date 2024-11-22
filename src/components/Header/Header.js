import React from 'react';

import './style.css';

function Header({score}) {
    return (
        <header className="header">
            <span>SCORE: {score*10}</span>
        </header>
    )
}

Header.defaultProps = {
    score: 0
}

export default Header;