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
                            s[i] = (Number)(s[i]);
                            s[i + 2] = (Number)(s[i + 2]);
                        }
                        addTable(s, 2);
                        getDFAEnd(s);
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
        case '|':
            return 1;
        case '+':
            return 2;
        case '*':
            return 3;
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
    console.log(exp)
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
    console.log(outputQueue)
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

            } else if (isLetter(regular[i - 1]) && regular[i] == '(') {
                //当出现字符连着左括号
                exp.push('+');
                exp.push(regular[i]);

            } else if (regular[i] == '*' && regular[i + 1] == '(') {
                //当出现星号连着左括号
                exp.push(regular[i]);
                exp.push('+');

            } else {
                exp.push(regular[i]);
            }
        }
        //console.log(exp)
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
                var temp = end.shift(); //保存栈顶元素
                NFA[num] = end.shift(); //出前面第二个节点的到达状态作为开始状态
                NFA[num + 1] = '#';
                NFA[num + 2] = start.pop(); //前面一个节点的开始状态出栈
                end.unshift(temp); //原栈顶元素入队列
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
            //console.log(start);
            //console.log(end);
        }
    }
    addTable(NFA, 1);

}


/**
 * 获得NFA的开始状态集和结束状态集
 */
function getNFAStartEnd(arr) {
    var i;
    //创建图实例
    var max1 = getMax(arr, 0);
    var max2 = getMax(arr, 2);
    var len = Math.max(max1, max2);
    var graph = new Graph(len, arr.length / 3);

    for (i = 0; i < arr.length; i += 3) {
        graph.addEdge(arr[i], arr[i + 2], arr[i + 1]);
    }

    var s = [];
    var e = [];

    //不考虑起始点
    for (i = 1; i <= len; i++) {
        graph.set.clear();
        graph.dfs(i);
        graph.marked = [];
        if (graph.set.size == len) { //如果一个节点能到达所有节点，则是开始
            s.push(i);
        }
        if (graph.set.size == 1) { //如果一个节点只能到达本身，则是终止点
            e.push(i);
        }
    }
    document.getElementById("NFA-start").innerHTML = "";
    document.getElementById("NFA-end").innerHTML = "";
    for (i = 0; i < s.length; i++) {
        document.getElementById("NFA-start").innerHTML += (s[i]);
    }

    for (i = 0; i < e.length; i++) {
        document.getElementById("NFA-end").innerHTML += (e[i]);
    }

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
        getNFAStartEnd(arr);
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
    var len = 0;
    var w = new Set(); //定义权值集合
    var p = new Set(); //定义所有节点集合
    var startPoint = (Number)(document.getElementById("NFA-start").innerText); //开始节点
    var endPoint = (Number)(document.getElementById("NFA-end").innerText); //终止节点
    var endSet = new Set(); //终结状态集
    for (i = 0; i < arr.length; i += 3) {
        var temp = (Number)(arr[i].innerText);
        len = len > temp ? len : temp;
        temp = (Number)(arr[i + 2].innerText);
        len = len > temp ? len : temp;
    }
    //创建图实例

    var graph = new Graph(len, arr.length / 3);
    for (i = 0; i < arr.length; i += 3) {
        if (arr[i + 1].innerText != '#') { //如果不是空加入队列
            w.add(arr[i + 1].innerText);
            num++;
        }
        p.add((Number)(arr[i].innerText));
        p.add((Number)(arr[i + 2].innerText));
        graph.addEdge(arr[i].innerText, arr[i + 2].innerText, arr[i + 1].innerText);
    }

    var iSet; //权值的交集
    /*得到起始节点的经过#边能到达的点的集合 */
    graph.bfs(startPoint);
    var s0 = new Set();
    s0.add(startPoint); //加入起始节点
    for (let p1 of p) {
        graph.marked = new Array();
        graph.paths = [];
        graph.stack = [];
        var ws = new Set("#");
        graph.getAllRoute(startPoint, p1);
        for (var jj = 0; jj < graph.paths.length; jj++) {
            var path = graph.paths[jj]; //获得路径
            var weight = graph.getWeight(path.reverse()); //获得路径的权值集合
            iSet = intersectSet(weight, ws); //权值的交集
            if (iSet.size == weight.size && iSet.size == ws.size) { //如果两个集合相等，加入节点
                s0.add(p1);
            }
        }
    }
    /*  graph.marked = new Array();
     graph.paths = [];
     graph.stack = [];
     graph.getAllRoute(1, 1);
     console.log(graph.paths) */
    var s = new Set(); // 定义一个集合用来存储子集

    var sflag = [false]; //用来标记子集是否被标记
    var st; //记录s集合初始大小
    s.add(s0);
    i = 0;
    do {
        st = s.size;
        i = 0;
        for (let ss of s) { //遍历集合中的子集
            var ws = new Set(); //用来判断集合是否相等
            if (!sflag[i]) {
                for (let w1 of w) {
                    var s1 = new Set();
                    ws.add(w1);
                    ws.add("#");
                    for (let sss of ss) { //遍历子集中的元素
                        graph.edgeTo = [];
                        graph.set = new Set();
                        graph.marked = [];
                        graph.bfs(sss);
                        for (let j of graph.set) {
                            if (graph.set.has(sss) && sss != j) {
                                graph.marked = new Array();
                                graph.paths = [];
                                graph.stack = [];
                                graph.getAllRoute(sss, j);
                                for (var jj = 0; jj < graph.paths.length; jj++) {
                                    var path = graph.paths[jj]; //获得路径
                                    var weight = graph.getWeight(path.reverse()); //获得路径的权值集合
                                    weight.add("#");
                                    iSet = intersectSet(weight, ws); //权值的交集
                                    if (iSet.size == weight.size && iSet.size == ws.size) { //如果两个集合相等，加入节点
                                        s1.add(j);
                                    }
                                }
                            } else if (graph.set.has(sss) && sss == j) { //如果节点到本身，则求节点下一个节点到本节点的所有路径，再加入本节点
                                for (var a = 0; a < graph.adj[j].length; a++) {
                                    var start = (Number)(graph.adj[j][a]);
                                    graph.marked = new Array();
                                    graph.paths = [];
                                    graph.stack = [];
                                    graph.getAllRoute(start, j);
                                    for (var jj = 0; jj < graph.paths.length; jj++) {
                                        graph.paths[jj].unshift(j); //加入原出发节点
                                        var path = graph.paths[jj]; //获得路径
                                        var weight = graph.getWeight(path.reverse()); //获得路径的权值集合
                                        iSet = intersectSet(weight, ws); //权值的交集
                                        if (iSet.size == weight.size && iSet.size == ws.size) { //如果两个集合相等，加入节点
                                            s1.add(j);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ws.clear();
                    var flag = true; //用来判断子集是否被标记
                    var k = 0; //用来标记是第几个子集
                    for (let s2 of s) {
                        iSet = intersectSet(s1, s2); //权值的交集
                        if (iSet.size == s1.size && iSet.size == s2.size) { //如果两个集合相等，说明该集合已经被标记
                            DFA.push(i);
                            DFA.push(w1);
                            DFA.push(k);
                            flag = false;
                            break;
                        }
                        k++;
                    }
                    if (flag && s1.size != 0) {
                        DFA.push(i);
                        DFA.push(w1);
                        DFA.push(s.size);
                        s.add(s1);
                        sflag.push(false);
                    }
                }
                sflag[i] = true; //标记子集
            }
            i++;
        }
    } while (st != s.size); //如果所有子集都被标记，结束循环

    i = 0;
    //确定终结状态集,存在NFA中终结态的集合为终结状态
    for (let ss of s) {
        console.log(ss)
        if (ss.has(endPoint)) {
            endSet.add(i);
        }
        i++;
    }
    document.getElementById("DFA-end").innerHTML = "";
    for (let end of endSet) {
        document.getElementById("DFA-end").innerHTML += end + ";";
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
        graph.addEdge(arr[i], arr[i + 2], arr[i + 1]);
    }
    var s = [];
    //不考虑起始点
    for (i = 1; i <= len; i++) {
        graph.set = new Set();
        graph.marked = [];
        graph.dfs(i);
        console.log(graph.set)
        if (graph.set.size == 1) { //如果一个节点只能到达本身，则是终止点
            s.push(i);
        }
    }
    for (i = 0; i < s.length; i++) {
        document.getElementById("DFA-end").innerHTML += (s[i]) + ";";
    }
}

/**
 * 求集合的交集
 */
function intersectSet(set1, set2) {
    var resultSet = new Set();
    for (let set of set1) {
        if (set2.has(set)) {
            resultSet.add(set);
        };
    };
    return resultSet;
};

/**
 * 判断数组是否包含
 */
/* function isContained(aa, bb) {
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
} */

/**
 * 新建一个Graph类
 */
function Graph(v, e) {
    this.set = new Set(); //用来存储遍历的节点
    this.stack = []; //用于存储路径
    this.paths = []; //用于存储多条路径
    this.vertices = v;
    this.edges = e;
    this.adj = [];
    this.marked = []; //标记节点是否被访问
    this.weight = [];
    this.edgeTo = [];
    for (var i = 0; i <= this.vertices; ++i) { //初始化顶点的二维矩阵
        this.adj[i] = [];
    }

    for (var i = 0; i <= this.edges; ++i) { //初始化边的权值二维矩阵
        this.weight[i] = [];
    }

    this.addEdge = addEdge;
    this.dfs = dfs;
    this.bfs = bfs;
    this.getAllRoute = getAllRoute;
    this.pathTo = pathTo;
    this.hasPathTo = hashPathTo;
    this.getWeight = getWeight;
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
            this.dfs((Number)(w));
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
            this.set.add(v);
        }
        for (var i = 0; i < this.adj[v].length; i++) {
            var w = (Number)(this.adj[v][i]);
            if (!this.marked[w]) {
                this.edgeTo[w] = v;
                this.marked[w] = true;
                queue.unshift(w);
            }
        }
    }
}

/**
 * 获得任意两点之间的所有路径
 */
function getAllRoute(start, end) {
    this.marked[start] = true; //marked数组存储各定点的遍历情况，true为已遍历（标记）
    this.stack.push(start); //入栈
    for (var j = 1; j <= this.vertices; j++) {
        if (start == end) { //找到终点
            //注意这里不能直接使用this.stack，这样修改stack的值会导致paths的值同时改变
            this.paths.push(this.stack.slice(0));
            this.stack.pop(); //出栈
            this.marked[start] = false;
            break;
        }
        if (!this.marked[j] && this.weight[start][j]) { //该顶点未被访问过
            this.getAllRoute(j, end);
        }
        if (j == this.vertices) { //如果该顶点无其它出度
            this.stack.pop();
            this.marked[start] = false;
        }
    }
}

/**
 * 获得最短路径
 */
function pathTo(v, s) {
    if (typeof(this.hasPathTo(v)) == "undefined") {
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
 * 求路径之间的权值和
 */
function getWeight(path) {
    var i;
    var weight = new Set();
    for (i = path.length - 1; i > 0; i--) {
        weight.add(this.weight[path[i]][path[i - 1]]);
    }
    return weight;
}
/**
 * 获得MFA
 */
function MFA() {
    var i;
    var MFA = [];
    var table = document.getElementById("DFA");
    var arr = table.getElementsByTagName("td");
    var DFAEnd = document.getElementById("DFA-end").innerHTML;
    var end = DFAEnd.split(";");
    var len = 0;
    var ek = new Set(); //初始终态集
    var sk = new Set(); //初始非终态集
    var k1 = new Set(); //终态集合的集合
    var k2 = new Set(); //非终态集合的集合
    var t = new Set();
    var w = new Set(); //权值集合
    var p = new Set(); //节点集合
    end.pop(); //去除末尾空串

    for (i = 0; i < arr.length; i += 3) {
        MFA.push((Number)(arr[i].innerText));
        MFA.push((arr[i + 1].innerText));
        MFA.push((Number)(arr[i + 2].innerText));
    }

    for (i = 0; i < arr.length; i += 3) {
        var temp = (Number)(arr[i].innerText);
        len = len > temp ? len : temp;
        temp = (Number)(arr[i + 2].innerText);
        len = len > temp ? len : temp;
    }
    //创建图实例
    var graph = new Graph(len, arr.length / 3);
    for (i = 0; i < arr.length; i += 3) {
        if (arr[i + 1].innerText != '#') { //如果不是空加入队列
            w.add(arr[i + 1].innerText);
        }
        p.add((Number)(arr[i].innerText));
        p.add((Number)(arr[i + 2].innerText));
        graph.addEdge(arr[i].innerText, arr[i + 2].innerText, arr[i + 1].innerText);
    }
    end = end.map(Number); //将字符串数组变为数字数组
    k1 = k1.add(new Set(end));
    ek = new Set(end);
    //划分终态集和非终态集
    for (let p1 of p) {
        if (end.indexOf(p1) == -1) { //如果不是终态集，加入到k2数组
            t.add(p1);
        }
    }
    sk = t;
    k2.add(t);
    /*考虑非终态集k2是否可再分
     *定义kk1,kk2数组用来划分k2终态集
     */
    for (var ww of w) {
        for (let k of k2) { //对k2进行遍历,注意这里k2是集合的集合
            //console.log(ww)
            var kk1 = new Set();
            var kk2 = new Set();
            var kk3 = new Set();
            if (k.size > 1) {
                for (var kk of k) {
                    var adj = graph.adj[kk].map(Number); //字符串数组转数字数组
                    var flag = false; //判断节点是否已经加入集合
                    for (i = 0; i < adj.length; i++) {
                        if (graph.weight[kk][adj[i]] == ww && ek.has(adj[i])) { //如果该节点通过某接受符号到达了终态集，加入kk1集合
                            kk1.add(kk);
                            flag = true;
                        } else if (graph.weight[kk][adj[i]] == ww && sk.has(adj[i])) { //如果该节点通过某接受符号到达了非终态集，加入kk2集合
                            kk2.add(kk);
                            flag = true;
                        }
                    }
                    if (!flag) { //如果节点没有权为ww的边,直接加入kk3集合
                        kk3.add(kk);
                    }
                }
                if (kk1.size > 0 && kk2.size > 0) {
                    k2.delete(k);
                    k2.add(kk1);
                    k2.add(kk2);
                } else if (kk1.size > 0 && kk2.size == 0 && kk1.size < k.size) {
                    k2.delete(k);
                    k2.add(kk1);
                    k2.add(kk3);
                } else if (kk2.size > 0 && kk1.size == 0 && kk2.size < k.size) {
                    k2.delete(k);
                    k2.add(kk2);
                    k2.add(kk3);
                }
            }
        }
    }
    /*考虑非终态集k1是否可再分
     *定义kk1,kk2数组用来划分k2终态集
     */
    for (var ww of w) {
        for (var k of k1) { //对k2进行遍历,注意这里k2是集合的集合
            var kk1 = new Set();
            var kk2 = new Set();
            var kk3 = new Set();
            if (k.size > 1) {
                for (var kk of k) {
                    var adj = graph.adj[kk].map(Number); //字符串数组转数字数组
                    var flag = false; //判断节点是否已经加入集合
                    for (i = 0; i < adj.length; i++) {
                        if (graph.weight[kk][adj[i]] == ww && ek.has(adj[i])) { //如果该节点通过某接受符号到达了终态集，加入kk1集合
                            kk1.add(kk);
                            flag = true;
                        } else if (graph.weight[kk][adj[i]] == ww && sk.has(adj[i])) { //如果该节点通过某接受符号到达了非终态集，加入kk2集合
                            kk2.add(kk);
                            flag = true;
                        }
                    }
                    if (!flag) { //如果节点没有权为ww的边,直接加入kk3集合
                        kk3.add(kk);
                    }
                }
                if (kk1.size > 0 && kk2.size > 0) {
                    k1.delete(k);
                    k1.add(kk1);
                    k1.add(kk2);
                } else if (kk1.size > 0 && kk2.size == 0 && kk1.size < k.size) {
                    k1.delete(k);
                    k1.add(kk1);
                    k1.add(kk3);
                } else if (kk2.size > 0 && kk1.size == 0 && kk2.size < k.size) {
                    k1.delete(k);
                    k1.add(kk2);
                    k1.add(kk3);
                }
            }
        }

    }

    console.log(k1);
    console.log(k2);
    for (var k of k1) { //对原来的节点进行合并
        if (k.size > 1) {
            for (var j = 0; j < MFA.length; j += 3) {
                if (k.has(MFA[j])) {
                    MFA[j] = [...k][0]; //使用集合第一个元素进行替换
                }
                if (k.has(MFA[j + 2])) {
                    MFA[j + 2] = [...k][0]; //使用集合第一个元素进行替换
                }
            }
        }
    }

    for (var k of k2) { //对原来的节点进行合并
        if (k.size > 1) {
            for (var j = 0; j < MFA.length; j += 3) {
                if (k.has(MFA[j])) {
                    MFA[j] = [...k][0]; //使用集合第一个元素进行替换
                }
                if (k.has(MFA[j + 2])) {
                    MFA[j + 2] = [...k][0]; //使用集合第一个元素进行替换
                }
            }
        }
    }
    console.log(MFA)
    DuplRemove(MFA)
    addTable(MFA, 3);
    getMFAEnd(MFA, end);
}

/** 
 * MFA数组去重
 */
function DuplRemove(arr) {
    for (var i = 0; i < arr.length; i += 3) {
        for (var j = i + 3; j < arr.length; j += 3) {
            if (arr[i] == arr[j] && arr[i + 1] == arr[j + 1] && arr[i + 2] == arr[j + 2]) { //第一个等同于第二个，splice方法删除第二个
                arr.splice(j, 3);
                j -= 3;
            }
        }
    }
}

/**
 * 获得MFA的终结状态集
 */
function getMFAEnd(arr, end) {
    document.getElementById("MFA-end").innerHTML = "";
    for (var i = 0; i < end.length; i++) {
        if (arr.indexOf(end[i]) > -1) {
            document.getElementById("MFA-end").innerHTML += end[i] + ";";
        }
    }
}