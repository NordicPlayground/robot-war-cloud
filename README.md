# nRF Robot War AWS backend

[![GitHub Actions](https://github.com/NordicPlayground/robot-war-cloud/workflows/Test%20and%20Release/badge.svg)](https://github.com/NordicPlayground/robot-war-cloud/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/NordicPlayground/robot-war-cloud)](https://mergify.io)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

AWS backend developed using [TypeScript](https://www.typescriptlang.org/) to play a game of nRF Robot War.

## Setup

    npm ci
    npx cdk bootstrap
    npx cdk deploy

Manual steps needed (can be implemented later through custom resources and just in time provisioning):

- create "game controller" thing group
- attach above policy to thing group
- create one or more game controller things and certificates
- assign game controller things to thing group (so they inherit the permission from the group)
