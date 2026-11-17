#include <bits/stdc++.h>
#define int long long
#define endl '\n'
using namespace std;

int dx[4]={0,0,1,-1};
int dy[4]={1,-1,0,0};

int bfs(const vector<string>&grid,int sx,int sy){
    if (sx==-1) return -1;
    int n=grid.size(),m=grid[0].size();
    vector<vector<int>>dist(n,vector<int>(m,-1));
    queue<pair<int,int>>q;
    q.push({sx,sy});
    dist[sx][sy]=0;
    while (!q.empty()){
        auto [x,y]=q.front();
        q.pop();
        if (grid[x][y]=='T') return dist[x][y];
        for (int i=0;i<4;i++){
            int nx=x+dx[i],ny=y+dy[i];
            if (nx<0 || nx>=n || ny<0 || ny>=m) continue;
            if (grid[nx][ny]=='#' || dist[nx][ny]!=-1) continue;
            dist[nx][ny]=dist[x][y]+1;
            q.push({nx,ny});
        }
    }
    return -1;
}

void solve(){
    int n,m;
    cin>>n>>m;
    vector<string>grid(n);
    int sx=-1,sy=-1;
    for (int i=0;i<n;i++){
        cin>>grid[i];
        for (int j=0;j<m;j++){
            if (grid[i][j]=='S') sx=i,sy=j;
        }
    }
    cout<<bfs(grid,sx,sy)<<endl;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
