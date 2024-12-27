/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import * as Version from '@tgsnake/core/browser/src/Version.browser';
import { useState } from 'react';
import { EyeShowSVG, EyeHiddenSVG } from '@/components/svg';
import type { PropsFormInitialApp, PropsFormPhone, PropsFormOTPorPWD } from '@/types/types';

export function FormIntialApp({ onNext, disabled }: PropsFormInitialApp) {
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const apiId = Number(e.target.elements['api-id'].value);
    const apiHash = e.target.elements['api-hash'].value;
    const appVersion =
      e.target.elements['app-ver'].value !== ''
        ? e.target.elements['app-ver'].value
        : Version.version.replace(/\-browser.\d$/, '');
    const deviceModel =
      e.target.elements['device-mod'].value !== ''
        ? e.target.elements['device-mod'].value
        : undefined;
    const systemVersion =
      e.target.elements['system-ver'].value !== ''
        ? e.target.elements['system-ver'].value
        : undefined;
    const server = e.target.elements['server'].value;
    const ipv = e.target.elements['ipv'].value;
    return onNext({
      apiId,
      apiHash,
      clientOptions: {
        appVersion,
        deviceModel,
        systemVersion,
        testMode: server === 'test',
        ipv6: ipv === '6',
      },
    });
  };
  return (
    <form onSubmit={onSubmitForm} className="mt-4" autoComplete="on">
      <label htmlFor="api-id" className="block p-2 font-bold">
        API ID
      </label>
      <input
        id="api-id"
        name="api-id"
        className="input input-block input-ghost-primary input-solid"
        placeholder="Input your api id"
        required
        type="text"
        accept="number"
        disabled={disabled}
      />
      <label htmlFor="api-hash" className="block p-2 font-bold">
        API Hash
      </label>
      <input
        id="api-hash"
        name="api-hash"
        className="input input-block input-ghost-primary input-solid"
        placeholder="Input your api hash"
        required
        type="text"
        disabled={disabled}
      />
      <p className="divider divider-horizontal font-bold my-2">App Configuration</p>
      <div className="grid grid-cols-2 gap-2 py-2 items-center">
        <label htmlFor="app-ver" className="block font-bold text-center">
          App Version
        </label>
        <input
          id="app-ver"
          name="app-ver"
          className="input input-block input-ghost-primary input-solid"
          placeholder="Input your app version"
          type="text"
          disabled={disabled}
        />
        <label htmlFor="device-mod" className="block font-bold text-center">
          Device Model
        </label>
        <input
          id="device-mod"
          name="device-mod"
          className="input input-block input-ghost-primary input-solid"
          placeholder="Input your device model"
          type="text"
          disabled={disabled}
        />
        <label htmlFor="system-ver" className="block font-bold text-center">
          System Version
        </label>
        <input
          id="system-vet"
          name="system-ver"
          className="input input-block input-ghost-primary input-solid"
          placeholder="Input your system version"
          type="text"
          disabled={disabled}
        />
        <label htmlFor="server" className="block font-bold text-center">
          Connect to
        </label>
        <select
          id="server"
          name="server"
          className="input input-block input-ghost-primary input-solid"
          disabled={disabled}
          required
          defaultValue={'prod'}
        >
          <option value="prod">Production DC Server</option>
          <option value="test">Test DC Server</option>
        </select>
        <label htmlFor="ipv" className="block font-bold text-center">
          Connect with
        </label>
        <select
          id="ipv"
          name="ipv"
          className="input input-block input-ghost-primary input-solid"
          disabled={disabled}
          required
          defaultValue={'4'}
        >
          <option value="4">IPV4</option>
          <option value="6">IPV6</option>
        </select>
      </div>
      <button disabled={disabled} type="submit" className="btn btn-solid-primary btn-block mt-4">
        NEXT
      </button>
    </form>
  );
}

export function FormInputPhoneOrToken({ onNext, disabled }: PropsFormPhone) {
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const value = e.target.elements['phone'].value;
    if (/^[0-9]{8,10}:[a-zA-Z0-9_-]{35}$/.test(value) || value.includes(':')) {
      return onNext({
        value,
        loginAs: 'bot',
      });
    }
    return onNext({
      value,
      loginAs: 'user',
    });
  };
  return (
    <form onSubmit={onSubmitForm} className="mt-4" autoComplete="on">
      <label htmlFor="phone" className="block p-2 font-bold">
        Input your phone number or BOT token
      </label>
      <input
        id="phone"
        name="phone"
        className="input input-block input-ghost-primary input-solid"
        placeholder="Input your phone number or bot token"
        required
        type="text"
        disabled={disabled}
      />
      <button disabled={disabled} type="submit" className="btn btn-solid-primary btn-block mt-4">
        NEXT
      </button>
    </form>
  );
}

export function FormInputOTP({ onNext, disabled, recovery }: PropsFormOTPorPWD) {
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const value = e.target.elements['otp'].value;
    return onNext({
      value,
    });
  };
  return (
    <form onSubmit={onSubmitForm} className="mt-4" autoComplete="off">
      <label htmlFor="phone" className="block p-2 font-bold">
        Input the {recovery ? 'recovery' : 'OTP'} code
      </label>
      <input
        id="otp"
        name="otp"
        className="input input-block input-ghost-primary input-solid"
        placeholder={`Input the ${recovery ? 'recovery' : 'otp'} code`}
        required
        type="number"
        disabled={disabled}
      />
      <button disabled={disabled} type="submit" className="btn btn-solid-primary btn-block mt-4">
        NEXT
      </button>
    </form>
  );
}

export function FormInputPWD({ onNext, disabled }: PropsFormOTPorPWD) {
  const [show, setShow] = useState<boolean>(false);
  const onSubmitForm = (e: any) => {
    e.preventDefault();
    const value = e.target.elements['pwd'].value;
    return onNext({
      value,
    });
  };
  const showPwd = (e: any) => {
    e.preventDefault();
    setShow(!show);
  };
  return (
    <form onSubmit={onSubmitForm} className="mt-4" autoComplete="off">
      <label htmlFor="phone" className="block p-2 font-bold">
        Input the 2FA Password
      </label>
      <div className="flex justify-between items-center">
        <input
          id="pwd"
          name="pwd"
          className="input input-ghost-primary input-solid input-block mr-2"
          placeholder="Input the 2fa password"
          required
          type={show ? 'text' : 'password'}
          disabled={disabled}
        />
        <button onClick={showPwd} className="cursor-pointer text-center w-5">
          {show ? <EyeShowSVG /> : <EyeHiddenSVG />}
        </button>
      </div>
      <button disabled={disabled} type="submit" className="btn btn-solid-primary btn-block mt-4">
        NEXT
      </button>
    </form>
  );
}
