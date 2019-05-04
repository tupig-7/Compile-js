const { app } = require('electron');

export var appMenuTemplate = [{
        label: 'File',
        submenu: []
    },
    {
        label: 'Edit',
        submenu: [{
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: '词法分析(W)',
        submenu: []
    },
    {
        label: '语法分析(P)',
        submenu: []
    },
    {
        label: '中间代码(M)',
        submenu: []
    },
    {
        label: '目标代码生成(O)',
        submenu: []
    },
    {
        label: 'View',
        submenu: [{
                role: 'reload'
            },
            {
                role: 'forcereload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'help',
        submenu: [{
            label: 'Home Page',
            click() { require('electron').shell.openExternal('http://www.zhuzhujiang.xin/blog'); }
        }]
    }
];