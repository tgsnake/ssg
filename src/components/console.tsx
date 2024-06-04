/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

import { useState, useEffect } from 'react';
import { Console, Hook, Unhook } from 'console-feed';
export function ConsoleFeed() {
  const [logs, setLogs] = useState<Array<any>>([]);
  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => {
        return setLogs((currLogs) => [...currLogs.slice(-10), log]);
      },
      false,
    );
    return () => {
      Unhook(hookedConsole);
    };
  }, []);
  return (
    <div className="mt-10">
      <Console logs={logs} variant="dark" />
    </div>
  );
}
