/**
 * @license
 * MIT License
 *
 * Copyright (c) 2025 OmniacDev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { PROTO } from './ipc';
export declare namespace DirectIPC {
    class Connection {
        private readonly _from;
        private readonly _to;
        private readonly _enc;
        private readonly _terminators;
        private MAYBE_ENCRYPT;
        private MAYBE_DECRYPT;
        get from(): string;
        get to(): string;
        constructor(from: string, to: string, encryption: string | false);
        terminate(notify?: boolean): void;
        send<S extends PROTO.Serializable<T>, T>(channel: string, serializer: S & PROTO.Serializable<T>, value: T): void;
        invoke<TS extends PROTO.Serializable<T>, T, RS extends PROTO.Serializable<R>, R>(channel: string, serializer: TS & PROTO.Serializable<T>, value: T, deserializer: RS & PROTO.Serializable<R>): Promise<R>;
        on<S extends PROTO.Serializable<T>, T>(channel: string, deserializer: S & PROTO.Serializable<T>, listener: (value: T) => void): () => void;
        once<S extends PROTO.Serializable<T>, T>(channel: string, deserializer: S & PROTO.Serializable<T>, listener: (value: T) => void): () => void;
        handle<TS extends PROTO.Serializable<T>, T, RS extends PROTO.Serializable<R>, R>(channel: string, deserializer: TS & PROTO.Serializable<T>, serializer: RS & PROTO.Serializable<R>, listener: (value: T) => R): () => void;
    }
    class ConnectionManager {
        private readonly _id;
        private readonly _enc_map;
        private readonly _con_map;
        private readonly _enc_force;
        private MAYBE_ENCRYPT;
        private MAYBE_DECRYPT;
        get id(): string;
        constructor(id: string, force_encryption?: boolean);
        connect(to: string, encrypted?: boolean, timeout?: number, mod?: number, prime?: number): Promise<Connection>;
        send<S extends PROTO.Serializable<T>, T>(channel: string, serializer: S & PROTO.Serializable<T>, value: T): void;
        invoke<TS extends PROTO.Serializable<T>, T, RS extends PROTO.Serializable<R>, R>(channel: string, serializer: TS & PROTO.Serializable<T>, value: T, deserializer: RS & PROTO.Serializable<R>): Promise<R>[];
        on<S extends PROTO.Serializable<T>, T>(channel: string, deserializer: S & PROTO.Serializable<T>, listener: (value: T) => void): () => void;
        once<S extends PROTO.Serializable<T>, T>(channel: string, deserializer: S & PROTO.Serializable<T>, listener: (value: T) => void): () => void;
        handle<TS extends PROTO.Serializable<T>, T, RS extends PROTO.Serializable<R>, R>(channel: string, deserializer: TS & PROTO.Serializable<T>, serializer: RS & PROTO.Serializable<R>, listener: (value: T) => R): () => void;
    }
}
export default DirectIPC;
