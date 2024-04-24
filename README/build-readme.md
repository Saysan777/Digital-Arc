# Building project for prod.
- We have broken down build script into three part
- First we build payload, then server then nextjs
- There are four script. Three of them are for the above respectively.
- Fourth one is to use the three build commands and copy those files.

- While building we change this files in tsconfig.json
    - "module": "CommonJS",                     // previous value was esnext
    - "moduleResolution": "node",               //  previous value was bundler

- We also added following to fix the build issue:
    import * as React from 'react       // this is in ReceiptEmail file
    Error was: React refers to UMD global, but the current file is a module. Conside adding an import instead.

- We also added copyfiles package for copying the build files
    yarn add -D copyfiles