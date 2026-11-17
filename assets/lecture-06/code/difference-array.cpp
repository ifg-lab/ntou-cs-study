#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

void solve(){
    int n,q;
    cin>>n>>q;
    vector<int>d(n+2,0);
    int prev=0;
    for (int i=1;i<=n;i++){
        int x;
        cin>>x;
        d[i]=x-prev;
        prev=x;
    }
    while (q--){
        int l,r,k;
        cin>>l>>r>>k;
        d[l]+=k;
        d[r+1]-=k;
    }
    int value=0;
    for (int i=1;i<=n;i++){
        value+=d[i];
        if (i>1) cout<<' ';
        cout<<value;
    }
    cout<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
