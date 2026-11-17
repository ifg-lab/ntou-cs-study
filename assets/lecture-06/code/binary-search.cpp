#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

int firstMatch(const vector<int>&a,int n,int x){
    int l=0,r=n;
    while (l<r){
        int mid=l+(r-l)/2;
        if (a[mid]<x) l=mid+1;
        else r=mid;
    }
    if (l<n && a[l]==x) return l;
    return -1;
}

void solve(){
    int n,x;
    cin>>n>>x;
    vector<int>a(n);
    for (int i=0;i<n;i++) cin>>a[i];
    cout<<firstMatch(a,n,x)<<endl;
    auto it=lower_bound(a.begin(),a.end(),x);
    if (it!=a.end() && *it==x) cout<<it-a.begin()<<endl;
    else cout<<-1<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
