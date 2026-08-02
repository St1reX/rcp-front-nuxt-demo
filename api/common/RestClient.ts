import type { $Fetch, NitroFetchRequest } from 'nitropack';
import type { UseFetchOptions } from '#app';
import type Configuration from './Configuration';

export default class RestClient {
  private readonly _baseUrl: string;
  private readonly _prefix: string;
  private readonly _clientUrl: string;
  private readonly _requestTimeout?: number;
  readonly clientSideFetch: $Fetch;

  constructor(configuration: Configuration) {
    this._baseUrl = configuration.baseUrl;
    this._prefix = configuration.prefix ?? '';
    this._requestTimeout = configuration.requestTimeout;
    this._clientUrl = `${this._baseUrl}${this._prefix}/`;

    this.clientSideFetch = $fetch.create({
      baseURL: this._clientUrl,
      timeout: this._requestTimeout,
      credentials: 'include',
      async onResponse(ctx) {
        if (import.meta.server && ctx.response.headers.get('set-cookie')) {
          // Forward response cookies to the client
          const cookieHeader = ctx.response.headers.get('set-cookie')!;
          appendResponseHeader((ctx as any).event, 'set-cookie', cookieHeader);
        }
      },
    });
  }

  serverSideFetch<T = void>(req: NitroFetchRequest, options?: UseFetchOptions<T>) {
    return useFetch(req, {
      ...options,
      credentials: 'include',
      baseURL: this._clientUrl,
      timeout: this._requestTimeout,
      $fetch: useRequestFetch() as typeof global.$fetch,
      server: true,
    });
  }
}
