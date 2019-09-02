# duck-typescript
A library for building cross-platform native desktop applications with TypeScript.

一个用typescript写的gui

# 安装
`apt-get install ts-node npm`

`npm install`

osx   `cc src/duck.c  -o duck.dylib -fPIC -shared -I. -L. -lscm`

linux `cc src/duck.c  -o duck.so -fPIC -shared -I. -L. -lscm`

# 运行
`npm run main`

# demo
计算器`ts-node -r tsconfig-paths/register -p example/calc/calc.ts`

播放器`ts-node -r tsconfig-paths/register -p example/music/music.ts`

<img src="https://raw.githubusercontent.com/evilbinary/duck-typescript/master/screenshot/calc.png" width="220px" />

<img src="https://raw.githubusercontent.com/evilbinary/duck-typescript/master/screenshot/music.png" width="800px" />

