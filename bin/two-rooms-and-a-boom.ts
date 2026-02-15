#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {TwoRoomsAndABoomStack} from '../lib';

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? '';

const app = new cdk.App();
new TwoRoomsAndABoomStack(app, 'TwoRoomsAndABoomStack', {
  env: {account: AWS_ACCOUNT_ID, region: AWS_REGION},
});
