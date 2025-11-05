import React from 'react';
import { MdPerson, MdSettings, MdLogout } from 'react-icons/md';
import '../../css/layout.css';

export const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="user-info">
                <MdPerson className="user-avatar" />
                <span>Karen</span>
            </div>
            <div className="header-actions">
                <button className="icon-button">
                    <MdSettings />
                </button>
                <button className="icon-button">
                    <MdLogout />
                </button>
            </div>
        </header>
    );
};