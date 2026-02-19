export type GetRoute = {
  [key: string]: any;
  path: string;
  params: Record<string, string>;
  routeData: string[];
};
export type GetClientInfo = {
  [key: string]: any;
  client: 'app_ios' | 'app_android' | 'PC' | 'H5' | 'xcx';
}