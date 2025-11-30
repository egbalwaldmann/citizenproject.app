'use client';

import { useState } from 'react';

export default function LoginButton() {
    const [text, setText] = useState('Login');

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setText('Wir sind noch nicht soweit 😅');
        setTimeout(() => {
            setText('Login');
        }, 2000);
    };

    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm whitespace-nowrap transition-all duration-200 min-w-[80px]"
        >
            {text}
        </button>
    );
}
