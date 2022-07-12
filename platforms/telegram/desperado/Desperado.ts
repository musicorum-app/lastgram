import fetch from "node-fetch";
import EventEmitter from "events";
import { Update } from "./types/Update.js";
import { Logger } from "@lastgram/logging";
import { User } from "./types/User.js";

interface ITGResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

export class DesperadoClient extends EventEmitter {
  apiUrl = "https://api.telegram.org/bot";

  #token: string;
  #currentOffset: number | undefined;
  #shouldStop = false;
  readonly #fullAPIUrl: string;

  constructor(token: string) {
    super();
    if (!token) {
      Logger.error(
        "Desperado",
        "Please add the TELEGRAM_TOKEN var to your environment."
      );
      process.emit("exit", 1);
    }
    this.#token = token;

    this.#fullAPIUrl = this.apiUrl + token + "/";
    this.#currentOffset = undefined;
    this.getMe()
      .then((me) => {
        Logger.info("Desperado", `Logged in as ${me.first_name}`);
      })
      .catch((e) => {
        Logger.error(
          "Desperado",
          "An invalid token was provided. Cannot (and will not) proceed."
        );
        process.emit("exit", 1);
      });
  }

  start(): Promise<boolean> {
    return this.fetchUpdates().then((ups) => {
      if (this.#shouldStop) return true;

      ups.forEach((up) => {
        const type = this.#getUpdateType(up);
        this.emit(type[0], up[type[1]]);
      });
      return this.start();
    });
  }

  stop() {
    this.#shouldStop = true;
    return true;
  }

  #getUpdateType(up: Update): [string, keyof Update] {
    if (up.message) return ["message", "message"];
    if (up.channel_post) return ["channelPost", "channel_post"];
    if (up.edited_channel_post)
      return ["editedChannelPost", "edited_channel_post"];
    if (up.edited_message) return ["editedMessage", "edited_message"];
    return ["unknown", "update_id"];
  }

  fetchUpdates() {
    return this.getUpdates(this.#currentOffset).then((r) => {
      if (!r[0]) return [];
      r = r.sort((a, b) => a.update_id - b.update_id);
      this.#currentOffset = r[r.length - 1].update_id + 1;
      return r;
    });
  }

  getMe(): Promise<User> {
    return this.#request("getMe") as Promise<User>;
  }

  getUpdates(offset: number | undefined, data: any = {}): Promise<Update[]> {
    return this.#request("getUpdates", { offset, ...data }) as Promise<
      Update[]
    >;
  }

  #request(method: string, data: any = {}): Promise<any> {
    return fetch(this.#fullAPIUrl + method, {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((a) => a.json() as Promise<any>)
      .then((r: ITGResponse) => {
        if (!r.ok)
          Logger.error(
            "Desperado",
            `Request to ${method} failed: ${r.description!}`
          );
        else return r.result;
        throw new Error(r.description!);
      })
      .catch((e) => {
        Logger.error(
          "Desperado",
          `Request to ${method} failed with an unrecoverable error: ${e.description}`
        );
        return e;
      });
  }
}
