#include <bits/stdc++.h>
using namespace std;

int main(){
    int n=0;
    string p;
    cin >> n >> p;
    vector<int> num(n+1);
    vector<int> num1(n+1);

    

    for(int i=0;i<n+1;i++){
        cin >> num.at(i);
        num1.at(i) = num.at(i);
    }
    
    sort(num1.begin(), num1.end());
    vector<vector<int> > ans(n,vector<int>(num1.at(num.size()-1)));

    for(int i=0;i<num1.at(0);i++){
        
        for(int j=0;j<n;j++){
            ans.at(i).at(j) = num.at(i-);
        }
            if(p.at(i+1)=="<"){

                for(int k=0;num.at(i)-1 > num.at(i+1)-k){
                    k++;
                }
                k=k-1;
            }else{
                for(int k=0;num.at(i)-1 < num.at(i+1)-k){
                    k++;
                }
                k=k-1;
            }
                    
                


    }
}