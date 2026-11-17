#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

void solve(){
    int n;
    cin>>n;
    vector<int>a(n);
    for (int i=0;i<n;i++) cin>>a[i];
    for (int i=1;i<n;i++){
        int key=a[i];
        int j=i;
        while (j>0 && a[j-1]>key){
            a[j]=a[j-1];
            j--;
        }
        a[j]=key;
    }
    for (int i=0;i<n;i++){
        if (i>0) cout<<' ';
        cout<<a[i];
    }
    cout<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
