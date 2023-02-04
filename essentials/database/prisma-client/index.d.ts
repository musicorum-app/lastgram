
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model User
 * 
 */
export type User = {
  id: number
  createdAt: Date
  platformId: string
  accountId: number
  userPreferencesId: number
}

/**
 * Model FMAccount
 * 
 */
export type FMAccount = {
  id: number
  createdAt: Date
  username: string
  banned: boolean
  token: string | null
}

/**
 * Model UserPreferences
 * 
 */
export type UserPreferences = {
  id: number
  sendAsPhoto: boolean
  addTags: boolean
  addArtistScrobbles: boolean
  addAlbumScrobbles: boolean
  hideName: boolean
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>;

  $transaction<R>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: {maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel}): Promise<R>;

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<GlobalReject>;

  /**
   * `prisma.fMAccount`: Exposes CRUD operations for the **FMAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FMAccounts
    * const fMAccounts = await prisma.fMAccount.findMany()
    * ```
    */
  get fMAccount(): Prisma.FMAccountDelegate<GlobalReject>;

  /**
   * `prisma.userPreferences`: Exposes CRUD operations for the **UserPreferences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPreferences
    * const userPreferences = await prisma.userPreferences.findMany()
    * ```
    */
  get userPreferences(): Prisma.UserPreferencesDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.8.0
   * Query Engine version: d6e67a83f971b175a593ccc12e15c4a757f93ffe
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    User: 'User',
    FMAccount: 'FMAccount',
    UserPreferences: 'UserPreferences'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model User
   */


  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    accountId: number | null
    userPreferencesId: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    accountId: number | null
    userPreferencesId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    platformId: string | null
    accountId: number | null
    userPreferencesId: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    platformId: string | null
    accountId: number | null
    userPreferencesId: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    platformId: number
    accountId: number
    userPreferencesId: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    accountId?: true
    userPreferencesId?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    accountId?: true
    userPreferencesId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    platformId?: true
    accountId?: true
    userPreferencesId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    platformId?: true
    accountId?: true
    userPreferencesId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    platformId?: true
    accountId?: true
    userPreferencesId?: true
    _all?: true
  }

  export type UserAggregateArgs = {
    /**
     * Filter which User to aggregate.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs = {
    where?: UserWhereInput
    orderBy?: Enumerable<UserOrderByWithAggregationInput>
    by: Array<UserScalarFieldEnum>
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }


  export type UserGroupByOutputType = {
    id: number
    createdAt: Date
    platformId: string
    accountId: number
    userPreferencesId: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect = {
    id?: boolean
    createdAt?: boolean
    platformId?: boolean
    account?: boolean | FMAccountArgs
    preferences?: boolean | UserPreferencesArgs
    accountId?: boolean
    userPreferencesId?: boolean
  }


  export type UserInclude = {
    account?: boolean | FMAccountArgs
    preferences?: boolean | UserPreferencesArgs
  } 

  export type UserGetPayload<S extends boolean | null | undefined | UserArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? User :
    S extends undefined ? never :
    S extends { include: any } & (UserArgs | UserFindManyArgs)
    ? User  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'account' ? FMAccountGetPayload<S['include'][P]> :
        P extends 'preferences' ? UserPreferencesGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (UserArgs | UserFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'account' ? FMAccountGetPayload<S['select'][P]> :
        P extends 'preferences' ? UserPreferencesGetPayload<S['select'][P]> :  P extends keyof User ? User[P] : never
  } 
      : User


  type UserCountArgs = Merge<
    Omit<UserFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }
  >

  export interface UserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'User'> extends True ? Prisma__UserClient<UserGetPayload<T>> : Prisma__UserClient<UserGetPayload<T> | null, null>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'User'> extends True ? Prisma__UserClient<UserGetPayload<T>> : Prisma__UserClient<UserGetPayload<T> | null, null>

    /**
     * Find the first User that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs>
    ): PrismaPromise<Array<UserGetPayload<T>>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs>
    ): Prisma__UserClient<UserGetPayload<T>>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    account<T extends FMAccountArgs= {}>(args?: Subset<T, FMAccountArgs>): Prisma__FMAccountClient<FMAccountGetPayload<T> | Null>;

    preferences<T extends UserPreferencesArgs= {}>(args?: Subset<T, UserPreferencesArgs>): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * User base type for findUnique actions
   */
  export type UserFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where: UserWhereUniqueInput
  }

  /**
   * User findUnique
   */
  export interface UserFindUniqueArgs extends UserFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User base type for findFirst actions
   */
  export type UserFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     * 
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }

  /**
   * User findFirst
   */
  export interface UserFindFirstArgs extends UserFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which User to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     * 
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter, which Users to fetch.
     * 
    **/
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     * 
    **/
    orderBy?: Enumerable<UserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     * 
    **/
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * User create
   */
  export type UserCreateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to create a User.
     * 
    **/
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs = {
    /**
     * The data used to create many Users.
     * 
    **/
    data: Enumerable<UserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * User update
   */
  export type UserUpdateArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The data needed to update a User.
     * 
    **/
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs = {
    /**
     * The data used to update Users.
     * 
    **/
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * The filter to search for the User to update in case it exists.
     * 
    **/
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     * 
    **/
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
    /**
     * Filter which User to delete.
     * 
    **/
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs = {
    /**
     * Filter which Users to delete
     * 
    **/
    where?: UserWhereInput
  }


  /**
   * User without action
   */
  export type UserArgs = {
    /**
     * Select specific fields to fetch from the User
     * 
    **/
    select?: UserSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserInclude | null
  }



  /**
   * Model FMAccount
   */


  export type AggregateFMAccount = {
    _count: FMAccountCountAggregateOutputType | null
    _avg: FMAccountAvgAggregateOutputType | null
    _sum: FMAccountSumAggregateOutputType | null
    _min: FMAccountMinAggregateOutputType | null
    _max: FMAccountMaxAggregateOutputType | null
  }

  export type FMAccountAvgAggregateOutputType = {
    id: number | null
  }

  export type FMAccountSumAggregateOutputType = {
    id: number | null
  }

  export type FMAccountMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    username: string | null
    banned: boolean | null
    token: string | null
  }

  export type FMAccountMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    username: string | null
    banned: boolean | null
    token: string | null
  }

  export type FMAccountCountAggregateOutputType = {
    id: number
    createdAt: number
    username: number
    banned: number
    token: number
    _all: number
  }


  export type FMAccountAvgAggregateInputType = {
    id?: true
  }

  export type FMAccountSumAggregateInputType = {
    id?: true
  }

  export type FMAccountMinAggregateInputType = {
    id?: true
    createdAt?: true
    username?: true
    banned?: true
    token?: true
  }

  export type FMAccountMaxAggregateInputType = {
    id?: true
    createdAt?: true
    username?: true
    banned?: true
    token?: true
  }

  export type FMAccountCountAggregateInputType = {
    id?: true
    createdAt?: true
    username?: true
    banned?: true
    token?: true
    _all?: true
  }

  export type FMAccountAggregateArgs = {
    /**
     * Filter which FMAccount to aggregate.
     * 
    **/
    where?: FMAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FMAccounts to fetch.
     * 
    **/
    orderBy?: Enumerable<FMAccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: FMAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FMAccounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FMAccounts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FMAccounts
    **/
    _count?: true | FMAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FMAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FMAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FMAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FMAccountMaxAggregateInputType
  }

  export type GetFMAccountAggregateType<T extends FMAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateFMAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFMAccount[P]>
      : GetScalarType<T[P], AggregateFMAccount[P]>
  }




  export type FMAccountGroupByArgs = {
    where?: FMAccountWhereInput
    orderBy?: Enumerable<FMAccountOrderByWithAggregationInput>
    by: Array<FMAccountScalarFieldEnum>
    having?: FMAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FMAccountCountAggregateInputType | true
    _avg?: FMAccountAvgAggregateInputType
    _sum?: FMAccountSumAggregateInputType
    _min?: FMAccountMinAggregateInputType
    _max?: FMAccountMaxAggregateInputType
  }


  export type FMAccountGroupByOutputType = {
    id: number
    createdAt: Date
    username: string
    banned: boolean
    token: string | null
    _count: FMAccountCountAggregateOutputType | null
    _avg: FMAccountAvgAggregateOutputType | null
    _sum: FMAccountSumAggregateOutputType | null
    _min: FMAccountMinAggregateOutputType | null
    _max: FMAccountMaxAggregateOutputType | null
  }

  type GetFMAccountGroupByPayload<T extends FMAccountGroupByArgs> = PrismaPromise<
    Array<
      PickArray<FMAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FMAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FMAccountGroupByOutputType[P]>
            : GetScalarType<T[P], FMAccountGroupByOutputType[P]>
        }
      >
    >


  export type FMAccountSelect = {
    id?: boolean
    createdAt?: boolean
    username?: boolean
    banned?: boolean
    token?: boolean
    user?: boolean | UserArgs
  }


  export type FMAccountInclude = {
    user?: boolean | UserArgs
  } 

  export type FMAccountGetPayload<S extends boolean | null | undefined | FMAccountArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? FMAccount :
    S extends undefined ? never :
    S extends { include: any } & (FMAccountArgs | FMAccountFindManyArgs)
    ? FMAccount  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'user' ? UserGetPayload<S['include'][P]> | null :  never
  } 
    : S extends { select: any } & (FMAccountArgs | FMAccountFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'user' ? UserGetPayload<S['select'][P]> | null :  P extends keyof FMAccount ? FMAccount[P] : never
  } 
      : FMAccount


  type FMAccountCountArgs = Merge<
    Omit<FMAccountFindManyArgs, 'select' | 'include'> & {
      select?: FMAccountCountAggregateInputType | true
    }
  >

  export interface FMAccountDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one FMAccount that matches the filter.
     * @param {FMAccountFindUniqueArgs} args - Arguments to find a FMAccount
     * @example
     * // Get one FMAccount
     * const fMAccount = await prisma.fMAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FMAccountFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, FMAccountFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'FMAccount'> extends True ? Prisma__FMAccountClient<FMAccountGetPayload<T>> : Prisma__FMAccountClient<FMAccountGetPayload<T> | null, null>

    /**
     * Find one FMAccount that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FMAccountFindUniqueOrThrowArgs} args - Arguments to find a FMAccount
     * @example
     * // Get one FMAccount
     * const fMAccount = await prisma.fMAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FMAccountFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, FMAccountFindUniqueOrThrowArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Find the first FMAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountFindFirstArgs} args - Arguments to find a FMAccount
     * @example
     * // Get one FMAccount
     * const fMAccount = await prisma.fMAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FMAccountFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, FMAccountFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'FMAccount'> extends True ? Prisma__FMAccountClient<FMAccountGetPayload<T>> : Prisma__FMAccountClient<FMAccountGetPayload<T> | null, null>

    /**
     * Find the first FMAccount that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountFindFirstOrThrowArgs} args - Arguments to find a FMAccount
     * @example
     * // Get one FMAccount
     * const fMAccount = await prisma.fMAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FMAccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FMAccountFindFirstOrThrowArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Find zero or more FMAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FMAccounts
     * const fMAccounts = await prisma.fMAccount.findMany()
     * 
     * // Get first 10 FMAccounts
     * const fMAccounts = await prisma.fMAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fMAccountWithIdOnly = await prisma.fMAccount.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FMAccountFindManyArgs>(
      args?: SelectSubset<T, FMAccountFindManyArgs>
    ): PrismaPromise<Array<FMAccountGetPayload<T>>>

    /**
     * Create a FMAccount.
     * @param {FMAccountCreateArgs} args - Arguments to create a FMAccount.
     * @example
     * // Create one FMAccount
     * const FMAccount = await prisma.fMAccount.create({
     *   data: {
     *     // ... data to create a FMAccount
     *   }
     * })
     * 
    **/
    create<T extends FMAccountCreateArgs>(
      args: SelectSubset<T, FMAccountCreateArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Create many FMAccounts.
     *     @param {FMAccountCreateManyArgs} args - Arguments to create many FMAccounts.
     *     @example
     *     // Create many FMAccounts
     *     const fMAccount = await prisma.fMAccount.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FMAccountCreateManyArgs>(
      args?: SelectSubset<T, FMAccountCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a FMAccount.
     * @param {FMAccountDeleteArgs} args - Arguments to delete one FMAccount.
     * @example
     * // Delete one FMAccount
     * const FMAccount = await prisma.fMAccount.delete({
     *   where: {
     *     // ... filter to delete one FMAccount
     *   }
     * })
     * 
    **/
    delete<T extends FMAccountDeleteArgs>(
      args: SelectSubset<T, FMAccountDeleteArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Update one FMAccount.
     * @param {FMAccountUpdateArgs} args - Arguments to update one FMAccount.
     * @example
     * // Update one FMAccount
     * const fMAccount = await prisma.fMAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FMAccountUpdateArgs>(
      args: SelectSubset<T, FMAccountUpdateArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Delete zero or more FMAccounts.
     * @param {FMAccountDeleteManyArgs} args - Arguments to filter FMAccounts to delete.
     * @example
     * // Delete a few FMAccounts
     * const { count } = await prisma.fMAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FMAccountDeleteManyArgs>(
      args?: SelectSubset<T, FMAccountDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more FMAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FMAccounts
     * const fMAccount = await prisma.fMAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FMAccountUpdateManyArgs>(
      args: SelectSubset<T, FMAccountUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one FMAccount.
     * @param {FMAccountUpsertArgs} args - Arguments to update or create a FMAccount.
     * @example
     * // Update or create a FMAccount
     * const fMAccount = await prisma.fMAccount.upsert({
     *   create: {
     *     // ... data to create a FMAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FMAccount we want to update
     *   }
     * })
    **/
    upsert<T extends FMAccountUpsertArgs>(
      args: SelectSubset<T, FMAccountUpsertArgs>
    ): Prisma__FMAccountClient<FMAccountGetPayload<T>>

    /**
     * Count the number of FMAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountCountArgs} args - Arguments to filter FMAccounts to count.
     * @example
     * // Count the number of FMAccounts
     * const count = await prisma.fMAccount.count({
     *   where: {
     *     // ... the filter for the FMAccounts we want to count
     *   }
     * })
    **/
    count<T extends FMAccountCountArgs>(
      args?: Subset<T, FMAccountCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FMAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FMAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FMAccountAggregateArgs>(args: Subset<T, FMAccountAggregateArgs>): PrismaPromise<GetFMAccountAggregateType<T>>

    /**
     * Group by FMAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FMAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FMAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FMAccountGroupByArgs['orderBy'] }
        : { orderBy?: FMAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FMAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFMAccountGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for FMAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__FMAccountClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs= {}>(args?: Subset<T, UserArgs>): Prisma__UserClient<UserGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * FMAccount base type for findUnique actions
   */
  export type FMAccountFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter, which FMAccount to fetch.
     * 
    **/
    where: FMAccountWhereUniqueInput
  }

  /**
   * FMAccount findUnique
   */
  export interface FMAccountFindUniqueArgs extends FMAccountFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FMAccount findUniqueOrThrow
   */
  export type FMAccountFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter, which FMAccount to fetch.
     * 
    **/
    where: FMAccountWhereUniqueInput
  }


  /**
   * FMAccount base type for findFirst actions
   */
  export type FMAccountFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter, which FMAccount to fetch.
     * 
    **/
    where?: FMAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FMAccounts to fetch.
     * 
    **/
    orderBy?: Enumerable<FMAccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FMAccounts.
     * 
    **/
    cursor?: FMAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FMAccounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FMAccounts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FMAccounts.
     * 
    **/
    distinct?: Enumerable<FMAccountScalarFieldEnum>
  }

  /**
   * FMAccount findFirst
   */
  export interface FMAccountFindFirstArgs extends FMAccountFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * FMAccount findFirstOrThrow
   */
  export type FMAccountFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter, which FMAccount to fetch.
     * 
    **/
    where?: FMAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FMAccounts to fetch.
     * 
    **/
    orderBy?: Enumerable<FMAccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FMAccounts.
     * 
    **/
    cursor?: FMAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FMAccounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FMAccounts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FMAccounts.
     * 
    **/
    distinct?: Enumerable<FMAccountScalarFieldEnum>
  }


  /**
   * FMAccount findMany
   */
  export type FMAccountFindManyArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter, which FMAccounts to fetch.
     * 
    **/
    where?: FMAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FMAccounts to fetch.
     * 
    **/
    orderBy?: Enumerable<FMAccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FMAccounts.
     * 
    **/
    cursor?: FMAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FMAccounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FMAccounts.
     * 
    **/
    skip?: number
    distinct?: Enumerable<FMAccountScalarFieldEnum>
  }


  /**
   * FMAccount create
   */
  export type FMAccountCreateArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * The data needed to create a FMAccount.
     * 
    **/
    data: XOR<FMAccountCreateInput, FMAccountUncheckedCreateInput>
  }


  /**
   * FMAccount createMany
   */
  export type FMAccountCreateManyArgs = {
    /**
     * The data used to create many FMAccounts.
     * 
    **/
    data: Enumerable<FMAccountCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * FMAccount update
   */
  export type FMAccountUpdateArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * The data needed to update a FMAccount.
     * 
    **/
    data: XOR<FMAccountUpdateInput, FMAccountUncheckedUpdateInput>
    /**
     * Choose, which FMAccount to update.
     * 
    **/
    where: FMAccountWhereUniqueInput
  }


  /**
   * FMAccount updateMany
   */
  export type FMAccountUpdateManyArgs = {
    /**
     * The data used to update FMAccounts.
     * 
    **/
    data: XOR<FMAccountUpdateManyMutationInput, FMAccountUncheckedUpdateManyInput>
    /**
     * Filter which FMAccounts to update
     * 
    **/
    where?: FMAccountWhereInput
  }


  /**
   * FMAccount upsert
   */
  export type FMAccountUpsertArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * The filter to search for the FMAccount to update in case it exists.
     * 
    **/
    where: FMAccountWhereUniqueInput
    /**
     * In case the FMAccount found by the `where` argument doesn't exist, create a new FMAccount with this data.
     * 
    **/
    create: XOR<FMAccountCreateInput, FMAccountUncheckedCreateInput>
    /**
     * In case the FMAccount was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<FMAccountUpdateInput, FMAccountUncheckedUpdateInput>
  }


  /**
   * FMAccount delete
   */
  export type FMAccountDeleteArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
    /**
     * Filter which FMAccount to delete.
     * 
    **/
    where: FMAccountWhereUniqueInput
  }


  /**
   * FMAccount deleteMany
   */
  export type FMAccountDeleteManyArgs = {
    /**
     * Filter which FMAccounts to delete
     * 
    **/
    where?: FMAccountWhereInput
  }


  /**
   * FMAccount without action
   */
  export type FMAccountArgs = {
    /**
     * Select specific fields to fetch from the FMAccount
     * 
    **/
    select?: FMAccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: FMAccountInclude | null
  }



  /**
   * Model UserPreferences
   */


  export type AggregateUserPreferences = {
    _count: UserPreferencesCountAggregateOutputType | null
    _avg: UserPreferencesAvgAggregateOutputType | null
    _sum: UserPreferencesSumAggregateOutputType | null
    _min: UserPreferencesMinAggregateOutputType | null
    _max: UserPreferencesMaxAggregateOutputType | null
  }

  export type UserPreferencesAvgAggregateOutputType = {
    id: number | null
  }

  export type UserPreferencesSumAggregateOutputType = {
    id: number | null
  }

  export type UserPreferencesMinAggregateOutputType = {
    id: number | null
    sendAsPhoto: boolean | null
    addTags: boolean | null
    addArtistScrobbles: boolean | null
    addAlbumScrobbles: boolean | null
    hideName: boolean | null
  }

  export type UserPreferencesMaxAggregateOutputType = {
    id: number | null
    sendAsPhoto: boolean | null
    addTags: boolean | null
    addArtistScrobbles: boolean | null
    addAlbumScrobbles: boolean | null
    hideName: boolean | null
  }

  export type UserPreferencesCountAggregateOutputType = {
    id: number
    sendAsPhoto: number
    addTags: number
    addArtistScrobbles: number
    addAlbumScrobbles: number
    hideName: number
    _all: number
  }


  export type UserPreferencesAvgAggregateInputType = {
    id?: true
  }

  export type UserPreferencesSumAggregateInputType = {
    id?: true
  }

  export type UserPreferencesMinAggregateInputType = {
    id?: true
    sendAsPhoto?: true
    addTags?: true
    addArtistScrobbles?: true
    addAlbumScrobbles?: true
    hideName?: true
  }

  export type UserPreferencesMaxAggregateInputType = {
    id?: true
    sendAsPhoto?: true
    addTags?: true
    addArtistScrobbles?: true
    addAlbumScrobbles?: true
    hideName?: true
  }

  export type UserPreferencesCountAggregateInputType = {
    id?: true
    sendAsPhoto?: true
    addTags?: true
    addArtistScrobbles?: true
    addAlbumScrobbles?: true
    hideName?: true
    _all?: true
  }

  export type UserPreferencesAggregateArgs = {
    /**
     * Filter which UserPreferences to aggregate.
     * 
    **/
    where?: UserPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     * 
    **/
    orderBy?: Enumerable<UserPreferencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: UserPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPreferences
    **/
    _count?: true | UserPreferencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserPreferencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserPreferencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPreferencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPreferencesMaxAggregateInputType
  }

  export type GetUserPreferencesAggregateType<T extends UserPreferencesAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPreferences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPreferences[P]>
      : GetScalarType<T[P], AggregateUserPreferences[P]>
  }




  export type UserPreferencesGroupByArgs = {
    where?: UserPreferencesWhereInput
    orderBy?: Enumerable<UserPreferencesOrderByWithAggregationInput>
    by: Array<UserPreferencesScalarFieldEnum>
    having?: UserPreferencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPreferencesCountAggregateInputType | true
    _avg?: UserPreferencesAvgAggregateInputType
    _sum?: UserPreferencesSumAggregateInputType
    _min?: UserPreferencesMinAggregateInputType
    _max?: UserPreferencesMaxAggregateInputType
  }


  export type UserPreferencesGroupByOutputType = {
    id: number
    sendAsPhoto: boolean
    addTags: boolean
    addArtistScrobbles: boolean
    addAlbumScrobbles: boolean
    hideName: boolean
    _count: UserPreferencesCountAggregateOutputType | null
    _avg: UserPreferencesAvgAggregateOutputType | null
    _sum: UserPreferencesSumAggregateOutputType | null
    _min: UserPreferencesMinAggregateOutputType | null
    _max: UserPreferencesMaxAggregateOutputType | null
  }

  type GetUserPreferencesGroupByPayload<T extends UserPreferencesGroupByArgs> = PrismaPromise<
    Array<
      PickArray<UserPreferencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPreferencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPreferencesGroupByOutputType[P]>
            : GetScalarType<T[P], UserPreferencesGroupByOutputType[P]>
        }
      >
    >


  export type UserPreferencesSelect = {
    id?: boolean
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
    user?: boolean | UserArgs
  }


  export type UserPreferencesInclude = {
    user?: boolean | UserArgs
  } 

  export type UserPreferencesGetPayload<S extends boolean | null | undefined | UserPreferencesArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? UserPreferences :
    S extends undefined ? never :
    S extends { include: any } & (UserPreferencesArgs | UserPreferencesFindManyArgs)
    ? UserPreferences  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'user' ? UserGetPayload<S['include'][P]> | null :  never
  } 
    : S extends { select: any } & (UserPreferencesArgs | UserPreferencesFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'user' ? UserGetPayload<S['select'][P]> | null :  P extends keyof UserPreferences ? UserPreferences[P] : never
  } 
      : UserPreferences


  type UserPreferencesCountArgs = Merge<
    Omit<UserPreferencesFindManyArgs, 'select' | 'include'> & {
      select?: UserPreferencesCountAggregateInputType | true
    }
  >

  export interface UserPreferencesDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one UserPreferences that matches the filter.
     * @param {UserPreferencesFindUniqueArgs} args - Arguments to find a UserPreferences
     * @example
     * // Get one UserPreferences
     * const userPreferences = await prisma.userPreferences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserPreferencesFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserPreferencesFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UserPreferences'> extends True ? Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>> : Prisma__UserPreferencesClient<UserPreferencesGetPayload<T> | null, null>

    /**
     * Find one UserPreferences that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserPreferencesFindUniqueOrThrowArgs} args - Arguments to find a UserPreferences
     * @example
     * // Get one UserPreferences
     * const userPreferences = await prisma.userPreferences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserPreferencesFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserPreferencesFindUniqueOrThrowArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Find the first UserPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesFindFirstArgs} args - Arguments to find a UserPreferences
     * @example
     * // Get one UserPreferences
     * const userPreferences = await prisma.userPreferences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserPreferencesFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserPreferencesFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UserPreferences'> extends True ? Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>> : Prisma__UserPreferencesClient<UserPreferencesGetPayload<T> | null, null>

    /**
     * Find the first UserPreferences that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesFindFirstOrThrowArgs} args - Arguments to find a UserPreferences
     * @example
     * // Get one UserPreferences
     * const userPreferences = await prisma.userPreferences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserPreferencesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserPreferencesFindFirstOrThrowArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Find zero or more UserPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPreferences
     * const userPreferences = await prisma.userPreferences.findMany()
     * 
     * // Get first 10 UserPreferences
     * const userPreferences = await prisma.userPreferences.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPreferencesWithIdOnly = await prisma.userPreferences.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserPreferencesFindManyArgs>(
      args?: SelectSubset<T, UserPreferencesFindManyArgs>
    ): PrismaPromise<Array<UserPreferencesGetPayload<T>>>

    /**
     * Create a UserPreferences.
     * @param {UserPreferencesCreateArgs} args - Arguments to create a UserPreferences.
     * @example
     * // Create one UserPreferences
     * const UserPreferences = await prisma.userPreferences.create({
     *   data: {
     *     // ... data to create a UserPreferences
     *   }
     * })
     * 
    **/
    create<T extends UserPreferencesCreateArgs>(
      args: SelectSubset<T, UserPreferencesCreateArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Create many UserPreferences.
     *     @param {UserPreferencesCreateManyArgs} args - Arguments to create many UserPreferences.
     *     @example
     *     // Create many UserPreferences
     *     const userPreferences = await prisma.userPreferences.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserPreferencesCreateManyArgs>(
      args?: SelectSubset<T, UserPreferencesCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a UserPreferences.
     * @param {UserPreferencesDeleteArgs} args - Arguments to delete one UserPreferences.
     * @example
     * // Delete one UserPreferences
     * const UserPreferences = await prisma.userPreferences.delete({
     *   where: {
     *     // ... filter to delete one UserPreferences
     *   }
     * })
     * 
    **/
    delete<T extends UserPreferencesDeleteArgs>(
      args: SelectSubset<T, UserPreferencesDeleteArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Update one UserPreferences.
     * @param {UserPreferencesUpdateArgs} args - Arguments to update one UserPreferences.
     * @example
     * // Update one UserPreferences
     * const userPreferences = await prisma.userPreferences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserPreferencesUpdateArgs>(
      args: SelectSubset<T, UserPreferencesUpdateArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Delete zero or more UserPreferences.
     * @param {UserPreferencesDeleteManyArgs} args - Arguments to filter UserPreferences to delete.
     * @example
     * // Delete a few UserPreferences
     * const { count } = await prisma.userPreferences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserPreferencesDeleteManyArgs>(
      args?: SelectSubset<T, UserPreferencesDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPreferences
     * const userPreferences = await prisma.userPreferences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserPreferencesUpdateManyArgs>(
      args: SelectSubset<T, UserPreferencesUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one UserPreferences.
     * @param {UserPreferencesUpsertArgs} args - Arguments to update or create a UserPreferences.
     * @example
     * // Update or create a UserPreferences
     * const userPreferences = await prisma.userPreferences.upsert({
     *   create: {
     *     // ... data to create a UserPreferences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPreferences we want to update
     *   }
     * })
    **/
    upsert<T extends UserPreferencesUpsertArgs>(
      args: SelectSubset<T, UserPreferencesUpsertArgs>
    ): Prisma__UserPreferencesClient<UserPreferencesGetPayload<T>>

    /**
     * Count the number of UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesCountArgs} args - Arguments to filter UserPreferences to count.
     * @example
     * // Count the number of UserPreferences
     * const count = await prisma.userPreferences.count({
     *   where: {
     *     // ... the filter for the UserPreferences we want to count
     *   }
     * })
    **/
    count<T extends UserPreferencesCountArgs>(
      args?: Subset<T, UserPreferencesCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPreferencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPreferencesAggregateArgs>(args: Subset<T, UserPreferencesAggregateArgs>): PrismaPromise<GetUserPreferencesAggregateType<T>>

    /**
     * Group by UserPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPreferencesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPreferencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPreferencesGroupByArgs['orderBy'] }
        : { orderBy?: UserPreferencesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPreferencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPreferencesGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPreferences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserPreferencesClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends UserArgs= {}>(args?: Subset<T, UserArgs>): Prisma__UserClient<UserGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UserPreferences base type for findUnique actions
   */
  export type UserPreferencesFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter, which UserPreferences to fetch.
     * 
    **/
    where: UserPreferencesWhereUniqueInput
  }

  /**
   * UserPreferences findUnique
   */
  export interface UserPreferencesFindUniqueArgs extends UserPreferencesFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserPreferences findUniqueOrThrow
   */
  export type UserPreferencesFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter, which UserPreferences to fetch.
     * 
    **/
    where: UserPreferencesWhereUniqueInput
  }


  /**
   * UserPreferences base type for findFirst actions
   */
  export type UserPreferencesFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter, which UserPreferences to fetch.
     * 
    **/
    where?: UserPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     * 
    **/
    orderBy?: Enumerable<UserPreferencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPreferences.
     * 
    **/
    cursor?: UserPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPreferences.
     * 
    **/
    distinct?: Enumerable<UserPreferencesScalarFieldEnum>
  }

  /**
   * UserPreferences findFirst
   */
  export interface UserPreferencesFindFirstArgs extends UserPreferencesFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserPreferences findFirstOrThrow
   */
  export type UserPreferencesFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter, which UserPreferences to fetch.
     * 
    **/
    where?: UserPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     * 
    **/
    orderBy?: Enumerable<UserPreferencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPreferences.
     * 
    **/
    cursor?: UserPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPreferences.
     * 
    **/
    distinct?: Enumerable<UserPreferencesScalarFieldEnum>
  }


  /**
   * UserPreferences findMany
   */
  export type UserPreferencesFindManyArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter, which UserPreferences to fetch.
     * 
    **/
    where?: UserPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPreferences to fetch.
     * 
    **/
    orderBy?: Enumerable<UserPreferencesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPreferences.
     * 
    **/
    cursor?: UserPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPreferences from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPreferences.
     * 
    **/
    skip?: number
    distinct?: Enumerable<UserPreferencesScalarFieldEnum>
  }


  /**
   * UserPreferences create
   */
  export type UserPreferencesCreateArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * The data needed to create a UserPreferences.
     * 
    **/
    data: XOR<UserPreferencesCreateInput, UserPreferencesUncheckedCreateInput>
  }


  /**
   * UserPreferences createMany
   */
  export type UserPreferencesCreateManyArgs = {
    /**
     * The data used to create many UserPreferences.
     * 
    **/
    data: Enumerable<UserPreferencesCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UserPreferences update
   */
  export type UserPreferencesUpdateArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * The data needed to update a UserPreferences.
     * 
    **/
    data: XOR<UserPreferencesUpdateInput, UserPreferencesUncheckedUpdateInput>
    /**
     * Choose, which UserPreferences to update.
     * 
    **/
    where: UserPreferencesWhereUniqueInput
  }


  /**
   * UserPreferences updateMany
   */
  export type UserPreferencesUpdateManyArgs = {
    /**
     * The data used to update UserPreferences.
     * 
    **/
    data: XOR<UserPreferencesUpdateManyMutationInput, UserPreferencesUncheckedUpdateManyInput>
    /**
     * Filter which UserPreferences to update
     * 
    **/
    where?: UserPreferencesWhereInput
  }


  /**
   * UserPreferences upsert
   */
  export type UserPreferencesUpsertArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * The filter to search for the UserPreferences to update in case it exists.
     * 
    **/
    where: UserPreferencesWhereUniqueInput
    /**
     * In case the UserPreferences found by the `where` argument doesn't exist, create a new UserPreferences with this data.
     * 
    **/
    create: XOR<UserPreferencesCreateInput, UserPreferencesUncheckedCreateInput>
    /**
     * In case the UserPreferences was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<UserPreferencesUpdateInput, UserPreferencesUncheckedUpdateInput>
  }


  /**
   * UserPreferences delete
   */
  export type UserPreferencesDeleteArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
    /**
     * Filter which UserPreferences to delete.
     * 
    **/
    where: UserPreferencesWhereUniqueInput
  }


  /**
   * UserPreferences deleteMany
   */
  export type UserPreferencesDeleteManyArgs = {
    /**
     * Filter which UserPreferences to delete
     * 
    **/
    where?: UserPreferencesWhereInput
  }


  /**
   * UserPreferences without action
   */
  export type UserPreferencesArgs = {
    /**
     * Select specific fields to fetch from the UserPreferences
     * 
    **/
    select?: UserPreferencesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: UserPreferencesInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const FMAccountScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    username: 'username',
    banned: 'banned',
    token: 'token'
  };

  export type FMAccountScalarFieldEnum = (typeof FMAccountScalarFieldEnum)[keyof typeof FMAccountScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserPreferencesScalarFieldEnum: {
    id: 'id',
    sendAsPhoto: 'sendAsPhoto',
    addTags: 'addTags',
    addArtistScrobbles: 'addArtistScrobbles',
    addAlbumScrobbles: 'addAlbumScrobbles',
    hideName: 'hideName'
  };

  export type UserPreferencesScalarFieldEnum = (typeof UserPreferencesScalarFieldEnum)[keyof typeof UserPreferencesScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    platformId: 'platformId',
    accountId: 'accountId',
    userPreferencesId: 'userPreferencesId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: Enumerable<UserWhereInput>
    OR?: Enumerable<UserWhereInput>
    NOT?: Enumerable<UserWhereInput>
    id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    platformId?: StringFilter | string
    account?: XOR<FMAccountRelationFilter, FMAccountWhereInput>
    preferences?: XOR<UserPreferencesRelationFilter, UserPreferencesWhereInput>
    accountId?: IntFilter | number
    userPreferencesId?: IntFilter | number
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    platformId?: SortOrder
    account?: FMAccountOrderByWithRelationInput
    preferences?: UserPreferencesOrderByWithRelationInput
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type UserWhereUniqueInput = {
    id?: number
    platformId?: string
    accountId?: number
    userPreferencesId?: number
  }

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    platformId?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    platformId?: StringWithAggregatesFilter | string
    accountId?: IntWithAggregatesFilter | number
    userPreferencesId?: IntWithAggregatesFilter | number
  }

  export type FMAccountWhereInput = {
    AND?: Enumerable<FMAccountWhereInput>
    OR?: Enumerable<FMAccountWhereInput>
    NOT?: Enumerable<FMAccountWhereInput>
    id?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    username?: StringFilter | string
    banned?: BoolFilter | boolean
    token?: StringNullableFilter | string | null
    user?: XOR<UserRelationFilter, UserWhereInput> | null
  }

  export type FMAccountOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    username?: SortOrder
    banned?: SortOrder
    token?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FMAccountWhereUniqueInput = {
    id?: number
  }

  export type FMAccountOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    username?: SortOrder
    banned?: SortOrder
    token?: SortOrder
    _count?: FMAccountCountOrderByAggregateInput
    _avg?: FMAccountAvgOrderByAggregateInput
    _max?: FMAccountMaxOrderByAggregateInput
    _min?: FMAccountMinOrderByAggregateInput
    _sum?: FMAccountSumOrderByAggregateInput
  }

  export type FMAccountScalarWhereWithAggregatesInput = {
    AND?: Enumerable<FMAccountScalarWhereWithAggregatesInput>
    OR?: Enumerable<FMAccountScalarWhereWithAggregatesInput>
    NOT?: Enumerable<FMAccountScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    username?: StringWithAggregatesFilter | string
    banned?: BoolWithAggregatesFilter | boolean
    token?: StringNullableWithAggregatesFilter | string | null
  }

  export type UserPreferencesWhereInput = {
    AND?: Enumerable<UserPreferencesWhereInput>
    OR?: Enumerable<UserPreferencesWhereInput>
    NOT?: Enumerable<UserPreferencesWhereInput>
    id?: IntFilter | number
    sendAsPhoto?: BoolFilter | boolean
    addTags?: BoolFilter | boolean
    addArtistScrobbles?: BoolFilter | boolean
    addAlbumScrobbles?: BoolFilter | boolean
    hideName?: BoolFilter | boolean
    user?: XOR<UserRelationFilter, UserWhereInput> | null
  }

  export type UserPreferencesOrderByWithRelationInput = {
    id?: SortOrder
    sendAsPhoto?: SortOrder
    addTags?: SortOrder
    addArtistScrobbles?: SortOrder
    addAlbumScrobbles?: SortOrder
    hideName?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserPreferencesWhereUniqueInput = {
    id?: number
  }

  export type UserPreferencesOrderByWithAggregationInput = {
    id?: SortOrder
    sendAsPhoto?: SortOrder
    addTags?: SortOrder
    addArtistScrobbles?: SortOrder
    addAlbumScrobbles?: SortOrder
    hideName?: SortOrder
    _count?: UserPreferencesCountOrderByAggregateInput
    _avg?: UserPreferencesAvgOrderByAggregateInput
    _max?: UserPreferencesMaxOrderByAggregateInput
    _min?: UserPreferencesMinOrderByAggregateInput
    _sum?: UserPreferencesSumOrderByAggregateInput
  }

  export type UserPreferencesScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserPreferencesScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserPreferencesScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserPreferencesScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    sendAsPhoto?: BoolWithAggregatesFilter | boolean
    addTags?: BoolWithAggregatesFilter | boolean
    addArtistScrobbles?: BoolWithAggregatesFilter | boolean
    addAlbumScrobbles?: BoolWithAggregatesFilter | boolean
    hideName?: BoolWithAggregatesFilter | boolean
  }

  export type UserCreateInput = {
    createdAt?: Date | string
    platformId: string
    account: FMAccountCreateNestedOneWithoutUserInput
    preferences: UserPreferencesCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    platformId: string
    accountId: number
    userPreferencesId: number
  }

  export type UserUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    account?: FMAccountUpdateOneRequiredWithoutUserNestedInput
    preferences?: UserPreferencesUpdateOneRequiredWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    accountId?: IntFieldUpdateOperationsInput | number
    userPreferencesId?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateManyInput = {
    id?: number
    createdAt?: Date | string
    platformId: string
    accountId: number
    userPreferencesId: number
  }

  export type UserUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    accountId?: IntFieldUpdateOperationsInput | number
    userPreferencesId?: IntFieldUpdateOperationsInput | number
  }

  export type FMAccountCreateInput = {
    createdAt?: Date | string
    username: string
    banned?: boolean
    token?: string | null
    user?: UserCreateNestedOneWithoutAccountInput
  }

  export type FMAccountUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    username: string
    banned?: boolean
    token?: string | null
    user?: UserUncheckedCreateNestedOneWithoutAccountInput
  }

  export type FMAccountUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutAccountNestedInput
  }

  export type FMAccountUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUncheckedUpdateOneWithoutAccountNestedInput
  }

  export type FMAccountCreateManyInput = {
    id?: number
    createdAt?: Date | string
    username: string
    banned?: boolean
    token?: string | null
  }

  export type FMAccountUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FMAccountUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserPreferencesCreateInput = {
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
    user?: UserCreateNestedOneWithoutPreferencesInput
  }

  export type UserPreferencesUncheckedCreateInput = {
    id?: number
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
    user?: UserUncheckedCreateNestedOneWithoutPreferencesInput
  }

  export type UserPreferencesUpdateInput = {
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutPreferencesNestedInput
  }

  export type UserPreferencesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUncheckedUpdateOneWithoutPreferencesNestedInput
  }

  export type UserPreferencesCreateManyInput = {
    id?: number
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
  }

  export type UserPreferencesUpdateManyMutationInput = {
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserPreferencesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type FMAccountRelationFilter = {
    is?: FMAccountWhereInput
    isNot?: FMAccountWhereInput
  }

  export type UserPreferencesRelationFilter = {
    is?: UserPreferencesWhereInput
    isNot?: UserPreferencesWhereInput
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    platformId?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    platformId?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    platformId?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    userPreferencesId?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type FMAccountCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    username?: SortOrder
    banned?: SortOrder
    token?: SortOrder
  }

  export type FMAccountAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FMAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    username?: SortOrder
    banned?: SortOrder
    token?: SortOrder
  }

  export type FMAccountMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    username?: SortOrder
    banned?: SortOrder
    token?: SortOrder
  }

  export type FMAccountSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type UserPreferencesCountOrderByAggregateInput = {
    id?: SortOrder
    sendAsPhoto?: SortOrder
    addTags?: SortOrder
    addArtistScrobbles?: SortOrder
    addAlbumScrobbles?: SortOrder
    hideName?: SortOrder
  }

  export type UserPreferencesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserPreferencesMaxOrderByAggregateInput = {
    id?: SortOrder
    sendAsPhoto?: SortOrder
    addTags?: SortOrder
    addArtistScrobbles?: SortOrder
    addAlbumScrobbles?: SortOrder
    hideName?: SortOrder
  }

  export type UserPreferencesMinOrderByAggregateInput = {
    id?: SortOrder
    sendAsPhoto?: SortOrder
    addTags?: SortOrder
    addArtistScrobbles?: SortOrder
    addAlbumScrobbles?: SortOrder
    hideName?: SortOrder
  }

  export type UserPreferencesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FMAccountCreateNestedOneWithoutUserInput = {
    create?: XOR<FMAccountCreateWithoutUserInput, FMAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: FMAccountCreateOrConnectWithoutUserInput
    connect?: FMAccountWhereUniqueInput
  }

  export type UserPreferencesCreateNestedOneWithoutUserInput = {
    create?: XOR<UserPreferencesCreateWithoutUserInput, UserPreferencesUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferencesCreateOrConnectWithoutUserInput
    connect?: UserPreferencesWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FMAccountUpdateOneRequiredWithoutUserNestedInput = {
    create?: XOR<FMAccountCreateWithoutUserInput, FMAccountUncheckedCreateWithoutUserInput>
    connectOrCreate?: FMAccountCreateOrConnectWithoutUserInput
    upsert?: FMAccountUpsertWithoutUserInput
    connect?: FMAccountWhereUniqueInput
    update?: XOR<FMAccountUpdateWithoutUserInput, FMAccountUncheckedUpdateWithoutUserInput>
  }

  export type UserPreferencesUpdateOneRequiredWithoutUserNestedInput = {
    create?: XOR<UserPreferencesCreateWithoutUserInput, UserPreferencesUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPreferencesCreateOrConnectWithoutUserInput
    upsert?: UserPreferencesUpsertWithoutUserInput
    connect?: UserPreferencesWhereUniqueInput
    update?: XOR<UserPreferencesUpdateWithoutUserInput, UserPreferencesUncheckedUpdateWithoutUserInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserCreateNestedOneWithoutAccountInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    connect?: UserWhereUniqueInput
  }

  export type UserUncheckedCreateNestedOneWithoutAccountInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutAccountNestedInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    upsert?: UserUpsertWithoutAccountInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutAccountInput, UserUncheckedUpdateWithoutAccountInput>
  }

  export type UserUncheckedUpdateOneWithoutAccountNestedInput = {
    create?: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput
    upsert?: UserUpsertWithoutAccountInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutAccountInput, UserUncheckedUpdateWithoutAccountInput>
  }

  export type UserCreateNestedOneWithoutPreferencesInput = {
    create?: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferencesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUncheckedCreateNestedOneWithoutPreferencesInput = {
    create?: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferencesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutPreferencesNestedInput = {
    create?: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferencesInput
    upsert?: UserUpsertWithoutPreferencesInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutPreferencesInput, UserUncheckedUpdateWithoutPreferencesInput>
  }

  export type UserUncheckedUpdateOneWithoutPreferencesNestedInput = {
    create?: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPreferencesInput
    upsert?: UserUpsertWithoutPreferencesInput
    disconnect?: boolean
    delete?: boolean
    connect?: UserWhereUniqueInput
    update?: XOR<UserUpdateWithoutPreferencesInput, UserUncheckedUpdateWithoutPreferencesInput>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type FMAccountCreateWithoutUserInput = {
    createdAt?: Date | string
    username: string
    banned?: boolean
    token?: string | null
  }

  export type FMAccountUncheckedCreateWithoutUserInput = {
    id?: number
    createdAt?: Date | string
    username: string
    banned?: boolean
    token?: string | null
  }

  export type FMAccountCreateOrConnectWithoutUserInput = {
    where: FMAccountWhereUniqueInput
    create: XOR<FMAccountCreateWithoutUserInput, FMAccountUncheckedCreateWithoutUserInput>
  }

  export type UserPreferencesCreateWithoutUserInput = {
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
  }

  export type UserPreferencesUncheckedCreateWithoutUserInput = {
    id?: number
    sendAsPhoto?: boolean
    addTags?: boolean
    addArtistScrobbles?: boolean
    addAlbumScrobbles?: boolean
    hideName?: boolean
  }

  export type UserPreferencesCreateOrConnectWithoutUserInput = {
    where: UserPreferencesWhereUniqueInput
    create: XOR<UserPreferencesCreateWithoutUserInput, UserPreferencesUncheckedCreateWithoutUserInput>
  }

  export type FMAccountUpsertWithoutUserInput = {
    update: XOR<FMAccountUpdateWithoutUserInput, FMAccountUncheckedUpdateWithoutUserInput>
    create: XOR<FMAccountCreateWithoutUserInput, FMAccountUncheckedCreateWithoutUserInput>
  }

  export type FMAccountUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FMAccountUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    banned?: BoolFieldUpdateOperationsInput | boolean
    token?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserPreferencesUpsertWithoutUserInput = {
    update: XOR<UserPreferencesUpdateWithoutUserInput, UserPreferencesUncheckedUpdateWithoutUserInput>
    create: XOR<UserPreferencesCreateWithoutUserInput, UserPreferencesUncheckedCreateWithoutUserInput>
  }

  export type UserPreferencesUpdateWithoutUserInput = {
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserPreferencesUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    sendAsPhoto?: BoolFieldUpdateOperationsInput | boolean
    addTags?: BoolFieldUpdateOperationsInput | boolean
    addArtistScrobbles?: BoolFieldUpdateOperationsInput | boolean
    addAlbumScrobbles?: BoolFieldUpdateOperationsInput | boolean
    hideName?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateWithoutAccountInput = {
    createdAt?: Date | string
    platformId: string
    preferences: UserPreferencesCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountInput = {
    id?: number
    createdAt?: Date | string
    platformId: string
    userPreferencesId: number
  }

  export type UserCreateOrConnectWithoutAccountInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
  }

  export type UserUpsertWithoutAccountInput = {
    update: XOR<UserUpdateWithoutAccountInput, UserUncheckedUpdateWithoutAccountInput>
    create: XOR<UserCreateWithoutAccountInput, UserUncheckedCreateWithoutAccountInput>
  }

  export type UserUpdateWithoutAccountInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    preferences?: UserPreferencesUpdateOneRequiredWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    userPreferencesId?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateWithoutPreferencesInput = {
    createdAt?: Date | string
    platformId: string
    account: FMAccountCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPreferencesInput = {
    id?: number
    createdAt?: Date | string
    platformId: string
    accountId: number
  }

  export type UserCreateOrConnectWithoutPreferencesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
  }

  export type UserUpsertWithoutPreferencesInput = {
    update: XOR<UserUpdateWithoutPreferencesInput, UserUncheckedUpdateWithoutPreferencesInput>
    create: XOR<UserCreateWithoutPreferencesInput, UserUncheckedCreateWithoutPreferencesInput>
  }

  export type UserUpdateWithoutPreferencesInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    account?: FMAccountUpdateOneRequiredWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPreferencesInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    platformId?: StringFieldUpdateOperationsInput | string
    accountId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}