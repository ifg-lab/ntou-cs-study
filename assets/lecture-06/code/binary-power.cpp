#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

const int mod=1000000007;

int fastPower(int a,int b){
    a=(a%mod+mod)%mod;
    int ans=1;
    while (b>0){
        if (b&1) ans=ans*a%mod;
        a=a*a%mod;
        b>>=1;
    }
    return ans;
}

void solve(){
    int a,b;
    cin>>a>>b;
    cout<<fastPower(a,b)<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
