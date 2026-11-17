#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

vector<int> dfs(const vector<vector<int>>&g,int root){
    int n=g.size()-1;
    vector<int>parent(n+1,-1),order;
    stack<int>st;
    parent[root]=0;
    st.push(root);
    while (!st.empty()){
        int u=st.top();
        st.pop();
        order.push_back(u);
        for (int v:g[u]){
            if (parent[v]!=-1) continue;
            parent[v]=u;
            st.push(v);
        }
    }
    vector<int>sz(n+1,1);
    for (int i=(int)order.size()-1;i>=1;i--){
        int u=order[i];
        sz[parent[u]]+=sz[u];
    }
    return sz;
}

void solve(){
    int n;
    cin>>n;
    vector<vector<int>>g(n+1);
    for (int i=1;i<n;i++){
        int u,v;
        cin>>u>>v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    auto sz=dfs(g,1);
    for (int i=1;i<=n;i++){
        if (i>1) cout<<' ';
        cout<<sz[i];
    }
    cout<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
