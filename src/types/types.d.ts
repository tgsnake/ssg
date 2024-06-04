/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

export interface OnNextFormInitialAppClickedParams {
  apiHash: string;
  apiId: number;
  clientOptions: {
    appVersion?: string;
    deviceModel?: string;
    systemVersion?: string;
  };
}
export type OnNextFormInitialAppClicked = (param: OnNextFormInitialAppClickedParams) => any;
export interface PropsFormInitialApp {
  onNext: OnNextFormInitialAppClicked;
  disabled: boolean;
}
export interface OnNextFormPhoneClickedParams {
  loginAs: 'bot' | 'user';
  value: string;
}
export type OnNextFormPhoneClicked = (param: OnNextFormPhoneClickedParams) => any;
export interface PropsFormPhone {
  onNext: OnNextFormPhoneClicked;
  disabled: boolean;
}

export interface OnNextFormOTPorPWDClickedParams {
  value: string;
}
export type OnNextFormOTPorPWDClicked = (param: OnNextFormOTPorPWDClickedParams) => any;
export interface PropsFormOTPorPWD {
  onNext: OnNextFormOTPorPWDClicked;
  disabled: boolean;
  recovery?: boolean;
}

export interface AlertProps {
  message: string;
  type: 'info' | 'error';
}
