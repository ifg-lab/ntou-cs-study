#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

struct Edge{
    int u,v,w;
};
class DSU{
private:
    vector<int>parent,sz;
public:
    DSU(int n){
        parent.resize(n+1);
        sz.assign(n+1,1);
        for (int i=0;i<=n;i++){
            parent[i]=i;
        }
    }

    int find(int x){
        if (parent[x]==x) return x;
        return parent[x]=find(parent[x]);
    }

    bool same(int x, int y){
        return find(x)==find(y);
    }

    void merge(int x, int y){
        x=find(x), y=find(y);
        if (x==y) return;
        if (sz[x]<sz[y]) swap(x,y);
        parent[y]=x;
        sz[x]+=sz[y];
    }
};

void solve(){
    int n,m;
    cin>>n>>m;
    vector<Edge>edges(m);
    for (auto &[u,v,w]:edges) cin>>u>>v>>w;
    sort(edges.begin(),edges.end(),[](const Edge &a,const Edge &b){
        return a.w<b.w;
    });
    DSU dsu(n);
    int cost=0,used=0;
    for (auto [u,v,w]:edges){
        if (dsu.same(u,v)) continue;
        dsu.merge(u,v);
        cost+=w;
        used++;
        if (used==n-1) break;
    }
    if (used==n-1) cout<<cost<<endl;
    else cout<<"IMPOSSIBLE"<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
