var txtbox = document.getElementById("ord");
var okbtn = document.getElementById("btn");
var vbtn = document.getElementById("btn2");
var resultShow = document.getElementById("kekka");
var tweetr = document.getElementById("tweet");
vbtn.onclick=()=>{//音声認識
    SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    var i=0;
    recognition.onresult = (event) => {//音声が認識された時
    txtbox.value=event.results[i][0].transcript;//この二次元配列に音声認識の結果が収納されている
    showResult();//結果を見せる
    i++;
    }
    recognition.start();
    
}
okbtn.onclick= ()=>{
    showResult();    
}
showResult = ()=>{
    var N = txtbox.value;
    var result = SoinsuBunkai(N);
    if(result===-1){
        kekka.insertAdjacentHTML('afterbegin',"<p>正しい数値を入力してください</p>");
    }else{
        var re ="";
        var l=result.length;
        for(var i=0;i<l-1;i++){
            re = re + result[i][0] + "^" + result[i][1] + "*";
        }
        re = re + result[l-1][0] + "^" + result[l-1][1];//最後は＊をつけない
        console.log(N+"の素因数分解は"+re+"です");
        kekka.insertAdjacentHTML('afterbegin',`<p>${N}の素因数分解は${re}です</p>`);
    }
    
}


const SoinsuBunkai = (n)=>{//素因数分解した配列を返す関数
    if(/^\d*$/.test(n)){
        var array=[[,]];
        const root = Math.floor(Math.sqrt(n));//ルートn以下の最大の整数
        var k=0;
        for (i=2;i<=root;i++){//1から始めると無限ループする
            var bool = false;
            var j=0;
            while(n%i===0){
                j++;
                n=n/i;
                array[k]=[i,j];//配列にiのj乗の形で入れる
                bool = true;
            }
            if(bool){
                k++;//値が追加されたか判定，もう少し工夫できそうだけど
            }
        }
        if(n!=1){
            array[k]=[n,1];//残った数は1か素数になる
            k++;
        }
        if(k===0){
            array[0,0]=[n,1];//nが素数だった場合
            k++;
        }
        return array;
    }else{
        return -1;
    }
}



 