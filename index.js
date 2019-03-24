import { ipcRenderer, remote } from 'electron';
const { Menu, MenuItem, dialog } = remote;

let currentFile = null; //当前文档保存的路径
let isSaved = true;     //当前文档是否已保存
let txtEditor = document.getElementById('txtEditor'); //获得TextArea文本框的引用
let txtCompile = document.getElementById('txtCompile'); //获得TxtCompile文本框的引用
//关键字 

let key = ["auto", "break", "case", "char", "const", "continue",
"default", "do", "double", "else", "enum", "extern",
"float", "for", "goto", "if", "int", "long",
"register", "return", "short", "signed", "sizeof", "static",
"struct", "switch", "typedef", "union", "unsigned", "void",
"volatile", "while"];    
//关键字的种别码
let keyNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]; 
//运算符和界符 
let symbol=["<",">","!=",">=","<=","==",",",";","(",")","{","}","+","-","*","/","=","#",".","\""," ","'"];

//运算符和界符的种别码 
let symbolNum=[33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,51,52,53,54];
//存放文件取出的字符 
let letter =[""];
//将字符转换为单词
let  words;
let length = 0;  //保存程序中字符的数目 
let num = 0;

document.title = "Compile - Untitled"; //设置文档标题，影响窗口标题栏名称

//给文本框增加右键菜单
const contextMenuTemplate=[
    { role: 'compile' },       //compile菜单项
    { role: 'redo' },       //Redo菜单项
    { type: 'separator' },  //分隔线
    { role: 'cut' },        //Cut菜单项
    { role: 'copy' },       //Copy菜单项
    { role: 'paste' },      //Paste菜单项
    { role: 'delete' },     //Delete菜单项
    { type: 'separator' },  //分隔线
    { role: 'selectall' }   //Select All菜单项
];
const contextMenu=Menu.buildFromTemplate(contextMenuTemplate);
txtEditor.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});

//监控文本框内容是否改变
txtEditor.oninput=(e)=>{
    if(isSaved) document.title += " *";
    isSaved=false;
};

//监听与主进程的通信
ipcRenderer.on('action', (event, arg) => {
    switch(arg){        
    case 'new': //新建文件
        askSaveIfNeed();
        currentFile=null;
        txtEditor.value='';   
        document.title = "Compile - Untitled";
        isSaved=true;
        break;
    case 'open': //打开文件
        askSaveIfNeed();
        const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
                { name: 'All Files', extensions: ['*'] } ],
            properties: ['openFile']
        });
        if(files){
            currentFile=files[0];
            const txtRead=readText(currentFile);
            txtEditor.value=txtRead;
            document.title = "Compile - " + currentFile;
            isSaved=true;
        }
        break;
    case 'save': //保存文件
        saveCurrentDoc();
        break;
    case 'exiting':
        askSaveIfNeed();
        ipcRenderer.sendSync('reqaction', 'exit');
        break;
    case 'compile': //编译文件
        askSaveIfNeed();
        analysis();
        TakeWord();
        break;
    }
});

//读取文本文件
function readText(file){
    const fs = require('fs');
    return fs.readFileSync(file, 'utf8');
}
//保存文本内容到文件
function saveText(text, file){
    const fs = require('fs');
    fs.writeFileSync(file, text);
}

//保存当前文档
function saveCurrentDoc(){
    if(!currentFile){
        const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
                { name: 'All Files', extensions: ['*'] } ]
        });
        if(file) currentFile=file;
    }
    if(currentFile){
        const txtSave=txtEditor.value;
        saveText(txtSave, currentFile);
        isSaved=true;
        document.title = "Compile - " + currentFile;
    }
}

//如果需要保存，弹出保存对话框询问用户是否保存当前文档
function askSaveIfNeed(){
    if(isSaved) return;
    const response=dialog.showMessageBox(remote.getCurrentWindow(), {
        message: 'Do you want to save the current document?',
        type: 'question',
        buttons: [ 'Yes', 'No' ]
    });
    if(response==0) saveCurrentDoc(); //点击Yes按钮后保存当前文档
}

//进行文本的词法分析
function analysis(){
    const response=dialog.showMessageBox(remote.getCurrentWindow(), {
        message: '编译成功！',
        type: 'question',
        buttons: [ 'Yes' ]
    });
    if(response==0) saveCurrentDoc(); //点击Yes按钮后保存当前文档
        let flag1=false;
        let flag2=false;
        let txt = txtEditor.value;
        for(let i = 0; i < txt.length; i++)
        {
            if(txt[i]=="\"")flag2=!flag2;
            else if(txt[i]=="'")flag1=!flag1;
            else if(txt[i]!=" "||flag1||flag2){
                letter[length]=txt[i];
                length++;
            }   //去掉程序中的空格
        } 
        return 0;
}



function isSymbol(s){ //判断运算符和界符 
    let i = 0;
    for(i=0;i<22;i++){
        if(s==symbol[i])
            return symbolNum[i]; 
    }
    return 0;
} 

//判断是否为数字 
function isNum(s){
    if(s>="0"&&s<="9")
        return true;
    return false;
}

//判断是否为字母 
function  isLetter(s)
{
    if((s>="a" && s<="z") || (s>="A" && s<="Z"))
        return true;
    return false;
}

//判断是否为关键字,是返回种别码 
function isKeyWord(s){
    let i;
    for(i=0;i<32;i++){
        if(s==key[i])
            return keyNum[i];
    }
    return 0;
}

//返回单个字符的类型 
function typeword(str){
    if((str>="a" && str<="z") || (str>="A" && str<="Z"))   //   字母 
        return 1;

    else if(str>="0" && str<="9")   //数字 
        return 2;

    else if(str==">"||str=="="||str=="<"||str=="!"||str==","||str==";"||str=="("||str==")"||str=="{"||str=="}"
    ||str=="+"||str=="-"||str=="*"||str=="/"||str=="#"||str=="."||str=="\""||str==" ")   //判断运算符和界符 
        return 3; 
    else return -1;

}

//链接标志符
function identifier(s, n){
    let j=n+1;
    let flag=1;

    while(flag){
        if(isNum(letter[j]) || isLetter(letter[j])){
            s=s+letter[j];
            if(isKeyWord(s)){
                j++;
                num=j;
                return s;
            }
            j++;
        }
        else{
            flag=0;
        }
    } 

    num=j;
    return s;
}

//连接符号和界符
function symbolStr(s, n){
    let j=n+1;
    let str=letter[j];
    if(str==">"||str=="="||str=="<"||str=="!") {
        s=s+letter[j];
        j++;
    }
    num=j;
    return s;
}

//连接数字
function Number(s, n){
    let j=n+1;
    let flag=1;

    while(flag){
        if(isNum(letter[j])){
            s=s+letter[j];
            j++;
        }
        else{
            flag=0;
        }
    }

    num=j;
    return s;
}

function prlet(s, n){
    txtCompile.value += "(" + s + "," + n + ")" + "\n";
}

function TakeWord(){  //取单词 
    let k = 0;

    for(num=0;num<length;){
        let str1=" ";
        let str=letter[num];
        
        k=typeword(str);
        switch(k){
            case 1:
                {
                    str1=identifier(str,num);
                    if(isKeyWord(str1))
                        prlet(str1,isKeyWord(str1));
                    else
                        prlet(str1,0);
                    break;
                }

            case 2:
                {
                    str1=Number(str,num);
                    prlet(str1,55);
                    break;
                }

            case 3:
                {
                    str1=symbolStr(str,num);
                    prlet(str1,isSymbol(str1));
                    break;  
                }
            case -1: num++;break;

        }

    } 
}
