import AnsiToHtml from 'ansi-to-html';

type AnsiColor = { [key: number]: string };

function rgbToHex(r: number, g: number, b: number) {
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function build256Palette(customBase: AnsiColor = {}) {
    const colors: AnsiColor = {};

    const defaultBase: AnsiColor = {
        0: '#000000',
        1: '#AA0000',
        2: '#00AA00',
        3: '#AA5500',
        4: '#0000AA',
        5: '#AA00AA',
        6: '#00AAAA',
        7: '#AAAAAA',
        8: '#555555',
        9: '#FF5555',
        10: '#55FF55',
        11: '#FFFF55',
        12: '#5555FF',
        13: '#FF55FF',
        14: '#55FFFF',
        15: '#FFFFFF',
    };

    for (let i = 0; i <= 15; i++) {
        colors[i] = (customBase[i] && customBase[i].trim()) || defaultBase[i];
    }

    const steps = [0, 95, 135, 175, 215, 255];
    for (let r = 0; r < 6; r++) {
        for (let g = 0; g < 6; g++) {
            for (let b = 0; b < 6; b++) {
                const idx = 16 + 36 * r + 6 * g + b;
                colors[idx] = rgbToHex(steps[r], steps[g], steps[b]);
            }
        }
    }

    for (let gray = 0; gray < 24; gray++) {
        const idx = 232 + gray;
        const l = gray * 10 + 8;
        colors[idx] = rgbToHex(l, l, l);
    }

    return colors;
}

const myBase16 = {
    0: '#222233', // black
    1: '#e65c4f', // red
    2: '#55d88b', // green
    3: '#f0c24f', // yellow
    4: '#7cb8ff', // blue
    5: '#b48efc', // magenta
    6: '#6cd3e3', // cyan
    7: '#f5f5f7', // white

    8: '#555566', // bright black
    9: '#ff7366', // bright red
    10: '#7ef5ac', // bright green
    11: '#ffe16a', // bright yellow
    12: '#9acbff', // bright blue
    13: '#d4aaff', // bright magenta
    14: '#8ee9f4', // bright cyan
    15: '#ffffff', // bright white
};

const fullPalette = build256Palette(myBase16);

const convertAnsiToHtml = new AnsiToHtml({ colors: fullPalette });

export const COLOR_TO_CLASS: Record<string, string> = {
    '#222233': 'ansi-black',
    '#e65c4f': 'ansi-red',
    '#55d88b': 'ansi-green',
    '#f0c24f': 'ansi-yellow',
    '#7cb8ff': 'ansi-blue',
    '#b48efc': 'ansi-magenta',
    '#6cd3e3': 'ansi-cyan',
    '#f5f5f7': 'ansi-white',

    '#555566': 'ansi-bright-black',
    '#ff7366': 'ansi-bright-red',
    '#7ef5ac': 'ansi-bright-green',
    '#ffe16a': 'ansi-bright-yellow',
    '#9acbff': 'ansi-bright-blue',
    '#d4aaff': 'ansi-bright-magenta',
    '#8ee9f4': 'ansi-bright-cyan',
    '#ffffff': 'ansi-bright-white',
};

function replaceInlineColorWithClass(html: string): string {
    return html.replace(/<span\s+style="([^"]*)">/gi, (match, style) => {
        const m = /color\s*:\s*(#[0-9a-fA-F]{3,6}|[a-zA-Z0-9()%,.\s-]+)\s*;?/.exec(style);
        if (!m) return '<span>';
        const color = m[1].trim().toLowerCase();
        const cls = COLOR_TO_CLASS[color] || null;
        return cls ? `<span class="${cls}">` : '<span>';
    });
}

function ansiToHtml(input: string): string {
    return replaceInlineColorWithClass(convertAnsiToHtml.toHtml(input));
}

export default ansiToHtml;
