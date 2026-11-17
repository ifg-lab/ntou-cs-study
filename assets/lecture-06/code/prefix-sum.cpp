#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

void solve(){
    int n,q;
    cin>>n>>q;
    vector<int>p(n+1,0);
    for (int i=1;i<=n;i++){
        int x;
        cin>>x;
        p[i]=p[i-1]+x;
    }
    while (q--){
        int l,r;
        cin>>l>>r;
        cout<<p[r]-p[l-1]<<endl;
    }
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
