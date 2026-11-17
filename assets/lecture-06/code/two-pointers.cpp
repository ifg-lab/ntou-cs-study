#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

void solve(){
    int n,x;
    cin>>n>>x;
    vector<int>a(n);
    for (int i=0;i<n;i++) cin>>a[i];
    int l=0,r=n-1;
    while (l<r){
        int total=a[l]+a[r];
        if (total==x){
            cout<<l+1<<' '<<r+1<<endl;
            return;
        }
        if (total<x) l++;
        else r--;
    }
    cout<<-1<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
