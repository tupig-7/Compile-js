//选择文件获取文件名称
function getfilename(el, k) {
    var startIndex = el.value.lastIndexOf(".");
    var filetype = el.value.substring(startIndex + 1);
    if (filetype == "txt") {
        var _el = el.files;
        var _name = "";
        let text = "";

        //修改右侧文字
        for (var i = 0; i < _el.length; i++) {
            if (i == _el.length - 1) {
                _name += _el[i].name
            } else {
                _name += _el[i].name + '、'
            }
            //读取文件内容
            //支持chrome IE10  
            if (window.FileReader) {
                var file = el.files[0];

                var reader = new FileReader();
                reader.onload = function() {
                    if (k == 1) {
                        text = this.result;
                        var s = text.split(/\s+/);
                        addTable(s, 1);
                        document.getElementById("filename1").innerHTML = _name;
                    } else if (k == 2) {
                        text = this.result;
                        var s = text.split(/\s+/);

                        //将第一列和第三列变为数字
                        for (var i = 0; i < s.length; i += 3) {
                            console.log(s[i + 2])
                            s[i] = (Number)(s[i]);
                            s[i + 2] = (Number)(s[i + 2]);
                        }
                        addTable(s, 2);
                        document.getElementById("filename2").innerHTML = _name;
                    }
                }
                reader.readAsText(file);
            }
            //支持IE 7 8 9 10  
            else if (typeof window.ActiveXObject != 'undefined') {
                var xmlDoc;
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.load(el.value);
                alert(xmlDoc.xml);
            }
            //支持FF  
            else if (document.implementation && document.implementation.createDocument) {
                var xmlDoc;
                xmlDoc = document.implementation.createDocument("", "", null);
                xmlDoc.async = false;
                xmlDoc.load(el.value);
                alert(xmlDoc.xml);
            } else {
                alert('error');
            }
        }



    } else {
        alert("请选择txt文件");
    }

}

/*
 *保存文件到本地 
 */
function saveText(k) {
    if (k == 1) {
        var table = document.getElementById("NFA");
        var array = table.getElementsByTagName("td"); //所有td
        var s = "";
        for (var i = 0; i < array.length; i += 3) {
            s = s + array[i].innerText + "\t";
            s = s + array[i + 1].innerText + "\t";
            s = s + array[i + 2].innerText + "\r\n";
        }
        s = s.substring(0, s.length - 2);
        var file = new File([s], "NFA.txt", { type: "text/plain;charset=utf-8" });
        saveAs(file);
    } else if (k == 2) {
        var table = document.getElementById("DFA");
        var array = table.getElementsByTagName("td"); //所有td
        var s = "";
        for (var i = 0; i < array.length; i += 3) {
            s = s + array[i].innerText + "\t";
            s = s + array[i + 1].innerText + "\t";
            s = s + array[i + 2].innerText + "\r\n";
        }
        s = s.substring(0, s.length - 2);
        var file = new File([s], "DFA.txt", { type: "text/plain;charset=utf-8" });
        saveAs(file);
    }
}
/*
 *判断字符是否是字母 
 */
function isLetter(ch) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
        return true;
    else
        return false;
}

/*
 *判断正规式是否正确 
 */
function checkTrue() {
    let regular = document.getElementById("regular").value.replace(/\s+/g, "");;
    let left_Brackets = 0; //记录左括号数目
    let right_Brackets = 0; //记录右括号数目
    if (regular == "") {
        alert("请输入正规式");
    } else {

        for (var i = 0; i < regular.length; i++) {
            if (regular[i] != '|' && regular[i] != '(' && regular[i] != ')' && regular[i] != '*' && !isLetter(regular[i])) {
                alert("正规式错误");
                return;
            } else {
                if (regular[i] == '|') {
                    if (!(regular[i - 1] == ')' || isLetter(regular[i - 1]) || regular[i - 1] == '*') || !(regular[i + 1] == '(' || isLetter(regular[i + 1]) || regular[i + 1] == '*')) { //如果前后存在非字母或者不是*
                        alert("正规式错误");
                        return;
                    }

                } else if (regular[i] == '*' && i != 0) {
                    if (!(isLetter(regular[i - 1]) || regular[i - 1] == '*' || regular[i - 1] == ')')) { //如果之前不是字母或者不是*或者不是)
                        alert("正规式错误");
                        return;
                    }
                } else if (regular[i] == '(') {
                    left_Brackets++;
                    if (!isLetter(regular[i + 1])) {
                        alert("正规式错误");
                        return;
                    }
                } else if (regular[i] == ')') {
                    right_Brackets++;
                    if (regular[i - 1] == '(') {
                        alert("正规式错误");
                        return;
                    }

                }
            }

        }

        if (left_Brackets != right_Brackets) {
            alert("正规式错误");
            return false;
        }
        alert("通过");
        return true;
    }
}

/*
 *判断是否是运算符
 */
function isOperator(value) {
    var operatorString = "+|*/()";
    return operatorString.indexOf(value) > -1
}

/*
 *判断运算符优先级
 */
function getPrioraty(value) {
    switch (value) {
        case '+':
        case '|':
            return 1;
        case '*':
            return 2;
        default:
            return 0;
    }
}

/*
 *比较运算符优先级
 */
function prioraty(o1, o2) {
    return getPrioraty(o1) <= getPrioraty(o2);
}

/*
 *中缀表达式变为后缀表达式
 */
function dal2Rpn(exp) {
    var inputStack = [];
    var outputStack = [];
    var outputQueue = [];

    for (var i = 0, len = exp.length; i < len; i++) {
        var cur = exp[i];
        if (cur != ' ') {
            inputStack.push(cur);
        }
    }
    //console.log('step one');
    while (inputStack.length > 0) {
        var cur = inputStack.shift(); //当前的操作符
        if (isOperator(cur)) {
            if (cur == '(') {
                outputStack.push(cur);
            } else if (cur == ')') {
                var po = outputStack.pop();
                while (po != '(' && outputStack.length > 0) {
                    outputQueue.push(po);
                    po = outputStack.pop();
                }
                if (po != '(') {
                    throw "error: unmatched ()";
                }
            } else if (cur == '*') { //星号是一元运算符，单独处理
                outputQueue.push(cur);
            } else {
                while (prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
                    outputQueue.push(outputStack.pop());
                }
                outputStack.push(cur);
            }
        } else {
            outputQueue.push(cur);
        }
    }
    //console.log('step two');
    if (outputStack.length > 0) {
        if (outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '(') {
            throw "error: unmatched ()";
        }
        while (outputStack.length > 0) {
            outputQueue.push(outputStack.pop());
        }
    }
    //console.log('step three');
    // console.log(outputQueue);
    return outputQueue;

}

/*
 *正规式转NFA
 */

function NFA() {
    let regular = document.getElementById("regular").value;
    let NFA = new Array(); //存储得到的NFA三元数组
    let k = 1; //起始状态
    let num = 0;
    let exp = [];
    let start = []; //开始符号栈
    let end = []; //结束符号队列
    if (checkTrue()) { //正规式验证通过
        for (var i = 0; i < regular.length; i++) {
            //当出现两个字母在一起时，添加+运算符，优先级和|相同
            if (isLetter(regular[i]) && isLetter(regular[i + 1])) {
                exp.push(regular[i]);
                exp.push('+');
            } else if (regular[i] == '*' && isLetter(regular[i + 1])) {
                //当出现a*b*，添加加号改为a*+b*
                exp.push(regular[i]);
                exp.push('+');

            } else if (regular[i] == ')' && regular[i + 1] == '(') {
                //当出现两个括号连在一起，如(a)(b)，也添加一个加号
                exp.push(regular[i]);
                exp.push('+');

            } else {
                exp.push(regular[i]);
            }
        }
        console.log(exp)
        exp = dal2Rpn(exp); //获得正规式的后缀表达式
        //console.log(exp);
        for (var i = 0; i < exp.length; i++) {
            if (isLetter(exp[i])) { //如果是字母，构建开始状态和结束状态
                start.push(k); //开始符号入栈
                NFA[num] = k;
                NFA[num + 1] = exp[i];
                end.unshift(k + 1); //结束符号入队
                NFA[num + 2] = k + 1;
                num += 3;
                k += 2;
            } else if (exp[i] == '+') { //如果是+运算符
                NFA[num] = end.pop(); //出最后一个元素，前面第二个节点的抵达状态
                NFA[num + 1] = '#';
                NFA[num + 2] = start.pop(); //出栈，前面第一个节点的开始状态
                num += 3;
            } else if (exp[i] == '|') {
                /*
                 *碰到|运算符，创造两个新节点，节点A和节点B，
                 *1：节点A分别指向之前的两个节点的开始状态，并将两个节点的开始状态出start栈，节点A入start栈。
                 *2：将之前两个节点的结束状态作为开始状态分别指向节点B，并将两个结束状态出end队列，节点B入end队列。
                 */
                NFA[num] = k;
                NFA[num + 1] = '#';
                NFA[num + 2] = start.pop();

                NFA[num + 3] = k;
                NFA[num + 4] = '#';
                NFA[num + 5] = start.pop();
                start.push(k);
                num += 6;
                k++;

                NFA[num] = end.shift();
                NFA[num + 1] = '#';
                NFA[num + 2] = k;

                NFA[num + 3] = end.shift();
                NFA[num + 4] = '#';
                NFA[num + 5] = k;
                end.unshift(k);
                num += 6;
                k++;

            } else if (exp[i] == '*') {
                /*
                 *碰到*运算符，创造两个新节点，节点A和节点B，
                 *1：之前一个节点的结束状态指向开始状态
                 *2：节点A分别指向之前一个节点的开始状态，并将一个节点的开始状态出start栈，节点A入start栈。
                 *3：将之前一个节点的结束状态作为开始状态分别指向节点B，并将一个结束状态出end队列，节点B入end队列。
                 *4：将节点A指向节点B
                 */

                //步骤1
                NFA[num] = end[0];
                NFA[num + 1] = '#';
                NFA[num + 2] = start[start.length - 1];
                num += 3;

                //步骤2
                NFA[num] = k;
                NFA[num + 1] = '#';
                NFA[num + 2] = start.pop();
                start.push(k);
                num += 3;
                k++;

                //步骤3
                NFA[num] = end[0];
                NFA[num + 1] = '#';
                NFA[num + 2] = k;
                num += 3;
                end.shift();
                end.unshift(k);

                //步骤4
                NFA[num] = start[start.length - 1];
                NFA[num + 1] = '#';
                NFA[num + 2] = end[0];
                k++;
                num += 3;
            }
            console.log(start);
            console.log(end);
        }
    }
    addTable(NFA, 1);

}

/*
 *获得状态集数
 */
function getMax(arr, k) {
    var max = 0;
    for (var i = k; i < arr.length; i += 3) {
        max = max > (Number)(arr[i]) ? max : arr[i];
    }
    return max;
}

/*
 *将得到的三维数组填充到表格中
 */

function addTable(arr, k) {
    if (k == 1) {
        var table = document.getElementById("NFA");
        table.innerHTML = ""; 
        for (var i = 0; i < arr.length; i += 3) {          
            var cell = "<tr><td>" + arr[i] + "</td>" +
                "<td>" + arr[i + 1] + "</td>" +
                "<td>" + arr[i + 2] + "</td></tr>"
            table.innerHTML += cell; //单元格内的内容
        }
        //console.log(arr)
        document.getElementById("NFA-start").innerHTML = getMax(arr, 0);
        document.getElementById("NFA-end").innerHTML = getMax(arr, 2);
    } else if (k == 2) {
        var table = document.getElementById("DFA");
        table.innerHTML = ""; 
        for (var i = 0; i < arr.length; i += 3) {          
            var cell = "<tr><td>" + arr[i] + "</td>" +
                "<td>" + arr[i + 1] + "</td>" +
                "<td>" + arr[i + 2] + "</td></tr>"
            table.innerHTML += cell; //单元格内的内容
        }
        //console.log(arr)
        document.getElementById("DFA-start").innerHTML = 0;
        document.getElementById("DFA-end").innerHTML = "";
        getDFAEnd(arr);
    } else if (k == 3) {
        var table = document.getElementById("MFA");
        table.innerHTML = ""; 
        for (var i = 0; i < arr.length; i += 3) {          
            var cell = "<tr><td>" + arr[i] + "</td>" +
                "<td>" + arr[i + 1] + "</td>" +
                "<td>" + arr[i + 2] + "</td></tr>"
            table.innerHTML += cell; //单元格内的内容
        }
        //console.log(arr)
        document.getElementById("MFA-start").innerHTML = 0;
    }

}

/*
 *NFA转换为DFA
 */
function DFA() {

    var i;
    var DFA = [];
    var num = 0; //统计DFA条数
    var table = document.getElementById("NFA");
    var arr = table.getElementsByTagName("td");
    var max1 = (Number)(document.getElementById("NFA-start").innerHTML);
    var max2 = (Number)(document.getElementById("NFA-end").innerHTML);
    var len = Math.max(max1, max2);
    //创建图实例
    var graph = new Graph(len, arr.length / 3);
    for (i = 0; i < arr.length; i += 3) {
        if (arr[i + 1].innerText != '#') { //如果不是空加入队列
            DFA.push(arr[i]);
            DFA.push(arr[i + 1].innerText);
            DFA.push(arr[i + 2]);
            num++;
        }
        graph.addEdge(arr[i].innerText, arr[i + 2].innerText, arr[i + 1].innerText);
    }
    for (i = 1; i <= len; i++) {
        graph.set = new Set();
        graph.dfs(i);
        graph.marked = [];
        if (graph.set.size == len) { //如果哪一个能够到达所有的节点，则设该节点为开始节点。
            break;
        }
    }
    graph.bfs(i);
    var s = [];
    for (var k = 0; k < num; k++) {
        s[k] = [];
        var v = DFA[k * 3 + 2].innerText;
        var paths = graph.pathTo(v, i);
        //console.log(paths)
        var start = paths.pop();
        s[k].push(0); //开始状态都是0
        var end;
        while (paths.length > 0) {
            end = (Number)(paths.pop());
            if (graph.weight[start][end] != '#') {
                s[k].push(end);
            }
            start = end;
        }
    }
    //对s数组进行长度的排序
    var temp1 = new Array();
    for (i = 0; i < num - 1; i++) {
        for (var j = 0; j < num - 1 - i; j++) {
            if (s[j].length > s[j + 1].length) {
                temp1 = s[j];
                s[j] = s[j + 1];
                s[j + 1] = temp1;

                var temp2 = DFA[j * 3 + 1];
                DFA[j * 3 + 1] = DFA[j * 3 + 4];
                DFA[j * 3 + 4] = temp2;
            }
        }
    }

    var start = 0; //开始态为0
    var end = 0; //到达态从0开始
    //第一个是确定的
    DFA[start * 3] = start;
    DFA[start * 3 + 2] = start + s[0].length - 1;
    for (i = 1; i < num; i++) {
        /**
         * 如果这条路径和前一条路径一样长，
         * 则该路径的开始状态和前一个路径的开始状态相同，
         * 到达状态=前一路径的到达状态+该路径的长度 - 1。
         */
        if (s[i].length == s[i - 1].length) {
            DFA[i * 3] = start;
            DFA[i * 3 + 2] = DFA[i * 3 - 1] + s[i].length - 1;
            end = DFA[i * 3 + 2];
        } else {
            /**
             * 如果这条路径的长度与前一路径的长度不一样长，
             * 判断该路径是否包含之前的路径，
             * 若包含，开始状态为包含路径的到达状态
             * 到达状态=总的到达状态+该路径的长度 - 包含路径的长度。
             */
            for (var j = i - 1; j >= 0; j--) {

                if (isContained(s[i], s[j])) {

                    DFA[i * 3] = DFA[j * 3 + 2];
                    DFA[i * 3 + 2] = end + s[i].length - s[j].length;
                    break;
                }
            }
        }
    }
    addTable(DFA, 2);
}

/**
 * 获得DFA的到达状态集
 */
function getDFAEnd(arr) {
    var i;
    //创建图实例
    var max1 = getMax(arr, 0);
    var max2 = getMax(arr, 2);
    var len = Math.max(max1, max2);
    var graph = new Graph(len + 1, arr.length / 3);

    for (i = 0; i < arr.length; i += 3) {
        /**
         * 在这里我们注意，将所有节点+1，因为图的构造从1开始
         */
        graph.addEdge(arr[i] + 1, arr[i + 2] + 1, arr[i + 1]);
    }
    var s = [];
    //不考虑起始点
    for (i = 2; i <= len + 1; i++) {
        graph.set.clear();
        graph.dfs(i);
        graph.marked = [];
        if (graph.set.size == 1) { //如果一个节点只能到达本身，则是终止点
            s.push(i);
        }
    }
    for (i = 0; i < s.length; i++) {
        document.getElementById("DFA-end").innerHTML += (s[i] - 1) + ";";
    }

}
/**
 * 判断数组是否包含
 */
function isContained(aa, bb) {
    if (!(aa instanceof Array) || !(bb instanceof Array) || ((aa.length < bb.length))) {
        return false;
    }
    for (var i = 0; i < bb.length; i++) {
        var flag = false;
        for (var j = 0; j < aa.length; j++) {
            if (aa[j] == bb[i]) {
                flag = true;
                break;
            }
        }
        if (flag == false) {
            return flag;
        }
    }
    return true;
}

/**
 * 新建一个Graph类
 */
function Graph(v, e) {
    this.set = new Set(); //用来存储遍历的节点
    this.vertices = v;
    this.edges = e;
    this.adj = [];
    this.weight = [];
    this.edgeTo = [];
    for (var i = 1; i <= this.vertices; ++i) { //初始化顶点的二维矩阵
        this.adj[i] = [];
    }

    for (var i = 1; i <= this.edges; ++i) { //初始化边的权值二维矩阵
        this.weight[i] = [];
    }

    this.addEdge = addEdge;
    this.dfs = dfs;
    this.bfs = bfs;
    this.pathTo = pathTo;
    this.hasPathTo = hashPathTo;
    this.marked = [];
}

/**
 * 添加图的边
 */
function addEdge(v, e, w) {
    this.adj[v].push(e);
    this.weight[v][e] = w;
    this.edges++;
}

/**
 * 邻接矩阵的DFS递归算法
 */
function dfs(v) {
    this.marked[v] = true;
    if (typeof(this.adj[v]) != "undefined") {
        this.set.add(v);
    }

    for (var i = 0; i < this.adj[v].length; i++) {
        var w = this.adj[v][i];
        if (!this.marked[w]) {
            this.dfs(w);
        }
    }
}

/**
 * 邻接矩阵的BFS算法
 */
function bfs(s) {
    var queue = [];
    this.marked[s] = true;
    queue.unshift(s); // 添加到队尾
    while (queue.length > 0) {
        var v = queue.shift(); // 从队首移除
        if (typeof(v) != "undefined") {
            //alert("Visisted vertex: " + v);
        }
        for (var i = 0; i < this.adj[v].length; i++) {
            var w = this.adj[v][i];
            if (!this.marked[w]) {
                this.edgeTo[w] = v;
                this.marked[w] = true;
                queue.unshift(w);
            }
        }
    }
}

/**
 * 获得最短路径
 */
function pathTo(v, s) {
    if (!this.hasPathTo(v)) {
        return undefined;
    }
    var path = [];
    for (var i = v; i != s; i = this.edgeTo[i]) {
        path.push(i);
    }
    path.push(s); //加入出发节点
    return path;
}

function hashPathTo(v) {
    return this.marked[v];
}

/**
 * 获得MFA
 */
function MFA() {
    var DFA = [];
    var MFA = [];
    var table = document.getElementById("DFA");
    var arr = table.getElementsByTagName("td");
    var DFAEnd = document.getElementById("DFA-end").innerHTML;
    var end = DFAEnd.split(";");
    end.pop(); //去除末尾空串

    for (var i = 0; i < end.length; i++) {
        end[i] = (Number)(end[i]);
    }
    end.sort(sortNumber);
    //console.log(end)
    for (var i = 0; i < arr.length; i++) {
        DFA.push(arr[i].innerText);
    }

    for (var i = 0; i < DFA.length; i++) {
        if (end.indexOf((Number)(DFA[i + 2])) != -1) { //判断DFA的到达状态是否在end中
            DFA[i + 2] = end[0];
        }
    }
    MFA = DFA;
    addTable(MFA, 3);
    document.getElementById("MFA-end").innerHTML = end[0];
}

/**
 * 排序函数
 */
function sortNumber(a, b) {
    return a - b
}