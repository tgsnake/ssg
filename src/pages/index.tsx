/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { useState } from 'react';
import { Client, Storages } from '@tgsnake/core';
import { GithubSVG, CheckSVG } from '@/components/svg';
import {
  FormIntialApp,
  FormInputPhoneOrToken,
  FormInputOTP,
  FormInputPWD,
} from '@/components/form';
import { Alert } from '@/components/alert';
import { ConsoleFeed } from '@/components/console';
import type {
  OnNextFormInitialAppClickedParams,
  OnNextFormPhoneClickedParams,
  OnNextFormOTPorPWDClickedParams,
} from '@/types/types';

export default function Home() {
  const [state, setState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [client, setClient] = useState<Client>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [hintPwd, setHintPwd] = useState<string>();
  const [stringSession, setStringSession] = useState<string>();
  const [waiting, setWaiting] = useState<Wait<string>>();

  const onNextFormInitialApp = (params: OnNextFormInitialAppClickedParams) => {
    setState(1);
    const _client = new Client(new Storages.StringSession(''), params.apiHash, params.apiId, {
      tcp: 4,
      ...params.clientOptions,
    });
    setClient(_client);
  };
  const onNextFormPhone = async (params: OnNextFormPhoneClickedParams) => {
    setDisabled(true);
    if (client) {
      if (params.loginAs === 'bot') {
        setState(5);
        await client.start({
          botToken: params.value,
        });
        setLoading(false);
        const session = await client.exportSession();
        console.log('Your session:', session);
        setStringSession(session);
        return client._session.stop();
      }
      await client.start({
        phoneNumber: async () => {
          return params.value;
        },
        code: () => {
          setState(2);
          setDisabled(false);
          const _waiting = new Wait<string>();
          setWaiting(_waiting);
          return _waiting.promise;
        },
        password: (hint) => {
          setState(3);
          if (state !== 3) setHintPwd(hint);
          setDisabled(false);
          const _waiting = new Wait<string>();
          setWaiting(_waiting);
          return _waiting.promise;
        },
        recoveryCode: () => {
          setState(4);
          setDisabled(false);
          const _waiting = new Wait<string>();
          setWaiting(_waiting);
          return _waiting.promise;
        },
        authError: (error) => {
          console.log(error);
          setDisabled(false);
          setWaiting(undefined);
          setErrorMsg(error.message);
        },
      });
      setState(5);
      setLoading(false);
      setErrorMsg(undefined);
      const session = await client.exportSession();
      console.log('Your session:', session);
      setStringSession(session);
      return client._session.stop();
    }
  };
  const onNextFormOTPorPWD = (params: OnNextFormOTPorPWDClickedParams) => {
    setErrorMsg(undefined);
    if (waiting) {
      setDisabled(true);
      waiting.resolve(params.value);
    }
  };
  return (
    <>
      <header className="navbar navbar-glass sticky top-0">
        <div className="navbar-start">
          <span className="navbar-item font-bold text-xl">tgsnake</span>
        </div>
        <div className="navbar-end">
          <span className="navbar-item">
            <a href="#" target="_blank">
              <GithubSVG />
            </a>
          </span>
        </div>
      </header>
      <main className="px-4 py-2 mt-6 md:w-1/2 md:mx-auto">
        <ol className="steps mb-10">
          <li
            className={`step step-primary overflow-hidden ${state === 0 ? 'step-active' : 'step-done'}`}
          >
            <div className="step-circle">{state === 0 ? '1' : <CheckSVG />}</div>
            <h3>Build App</h3>
          </li>
          <li
            className={`step step-primary overflow-hidden ${state < 5 && state >= 1 ? 'step-active' : 'step-done'}`}
          >
            <div className="step-circle">{state < 5 && state >= 1 ? '2' : <CheckSVG />}</div>
            <h3>Login</h3>
          </li>
          <li
            className={`step step-primary overflow-hidden ${state === 5 ? 'step-active' : 'step-done'}`}
          >
            <div className="step-circle">3</div>
            <h3>Get Session</h3>
          </li>
        </ol>
        {state === 2 ? (
          <Alert
            type="info"
            message="The OTP code has been sent to your account via the Telegram application"
          />
        ) : state === 3 ? (
          <Alert type="info" message={hintPwd || ''} />
        ) : state === 4 ? (
          <Alert
            type="info"
            message="Recovery code has been sent to your recovery email. Please open your email and check the spam folder."
          />
        ) : (
          ''
        )}
        {errorMsg ? <Alert type="error" message={errorMsg} /> : ''}
        {state === 0 ? (
          <FormIntialApp onNext={onNextFormInitialApp} disabled={state > 0 || disabled} />
        ) : state === 1 ? (
          <FormInputPhoneOrToken onNext={onNextFormPhone} disabled={state > 1 || disabled} />
        ) : state === 2 ? (
          <FormInputOTP onNext={onNextFormOTPorPWD} disabled={state > 2} recovery={false} />
        ) : state === 3 ? (
          <FormInputPWD onNext={onNextFormOTPorPWD} disabled={state > 3 || disabled} />
        ) : state === 4 ? (
          <FormInputOTP
            onNext={onNextFormOTPorPWD}
            disabled={state > 4 || disabled}
            recovery={true}
          />
        ) : state === 5 ? (
          <div>
            <p className="font-bold">Your string session</p>
            <div className={loading ? 'skeleton h-24' : ''}>
              {!loading && (
                <pre className="break-all overflow-y-scroll whitespace-pre-wrap p-2 bg-zinc-800 rounded-lg my-4">
                  <code>{stringSession}</code>
                </pre>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
        <ConsoleFeed />
      </main>
    </>
  );
}

class Wait<T> {
  promise!: Promise<T>;
  resolve!: (resolve: T) => any;
  reject!: (error: string) => any;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
