import React from "react";
const NavigationContext = React.createContext();
const LocationContext = React.createContext();
const RouteContext = React.createContext({ outlet: null });

export function Outlet() {
  return useOutlet();
}
export function useOutlet() {
  let outlet = React.useContext(RouteContext);
  return outlet;
}

/**
 * 路由容器
 * @param {*} children 儿子
 * @param {*} navigator 历史对象，其实就是history
 * @param {*} location 地址对象 {pathname:"当前路径"}
 * @returns
 */
// 作用：将 props 中的 历史对象 地址对象 存储到 Context
function Router({ children, navigator, location }) {
  return (
    <NavigationContext.Provider value={{ navigator }}>
      <LocationContext.Provider value={{ location }}>
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}

function Routes({ children }) {
  return useRoutes(createRoutesFromChildren(children));
}

function Route() {}

function createRoutesFromChildren(children) {
  let routes = [];
  React.Children.forEach(children, (child) => {
    let route = {
      path: child.props.path, //代表Route的路径
      element: child.props.element, //代表此Route要渲染的元素
      children: undefined,
    };
    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }
    routes.push(route);
  });
  console.log("routes = ", routes);
  return routes;
}

function useRoutes(routes) {
  let location = useLocation();
  let pathname = location.pathname || "/"; // 当前的pathname /user/add
  // routes 和 pathname 进行匹配
  let matches = matchRoutes(routes, { pathname });
  return _renderMatches(matches);
}
function _renderMatches(matches) {
  if (matches === null) return null;
  return matches.reduceRight((outlet, match) => {
    return (
      <RouteContext.Provider value={outlet}>
        {match.route.element}
      </RouteContext.Provider>
    );
  }, null);
}

function matchRoutes(routes, location) {
  // 获取当前地址中的路径名
  let pathname = location.pathname || "/";
  // 打平所有的分支 把路由进行展开
  let branches = flattenRoutes(routes);
  console.log("branches = ", branches);
  //匹配的结果
  let matches = null;
  //只要匹配上第一个，后续的就不再匹配了
  for (let i = 0; matches === null && i < branches.length; i++) {
    matches = matchRoutesBranch(branches[i], pathname);
  }
  console.log("matches = ", matches);
  return matches;
}

/**
 * 把路由进行展开
 * @param {*} routes 路由数组
 * @param {*} branches 分支数组
 * @param {*} parentMeta 父meta数组
 * @param {*} parentPath 父路径字符串
 */
function flattenRoutes(
  routes,
  branches = [],
  parentsMeta = [],
  parentPath = ""
) {
  routes.forEach((route) => {
    let meta = {
      relativePath: route.path || "", ///相对路径 add
      route,
    };
    let path = joinPaths([parentPath, meta.relativePath]); // /user/*/add
    let routesMeta = parentsMeta.concat(meta); // [user/*Meta,addMeta]
    if (route.children && route.children.length > 0) {
      //自己的routesMeta成为儿子们的parentsMeta,自己的path会成为儿子们的parentPath
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    branches.push({ path, routesMeta });
  });

  return branches;
}
function joinPaths(paths) {
  return paths.join("/").replace(/\/\/+/g, "/");
}

/**
 * 匹配各个分支
 * 第1级的meta relativePath /user/星/list
 * 第2级的meta relativePath list
 */
function matchRoutesBranch(branch, pathname) {
  let { routesMeta } = branch;
  let matchedParams = {}; //匹配的路径参数
  let matchedPathname = "/"; //匹配的路径 /
  let matches = [];
  for (let i = 0; i < routesMeta.length; i++) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1; //判断是否是最后一级的meta
    let remainingPathname =
      matchedPathname === "/"
        ? pathname
        : pathname.slice(matchedPathname.length);
    //开始用正则进行匹配
    let match = matchPath({ path: meta.relativePath, end }, remainingPathname);
    if (!match) return null;
    // /user/:id  /add/:name 合并父子路径参数
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      params: matchedParams, ///最终路径参数对象
      pathname: joinPaths([matchedPathname, match.pathname]), //自己完整的匹配路径
      pathnameBase: joinPaths([matchedPathname, match.pathnameBase]), //?类似于我们父路径或者说基本路径
      route,
    });
    if (match.pathnameBase) {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}

function matchPath(pattern, pathname) {
  let [matcher, paramNames] = compilePath(pattern.path, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;

  //获取当前匹配的路径
  let matchedPathname = match[0]; // /user
  //其实就是把结尾的/去掉  /user/add/   /user/add
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  //获取后面分组的值
  let values = match.slice(1);
  //获取捕获的分组
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    if (paramName === "*") {
      let value = captureGroups[index];
      //生新计算pathnameBase
      pathnameBase = matchedPathname
        .slice(0, matchedPathname.length - value.length)
        .replace(/(.)\/+$/, "$1");
    }
    memo[paramName] = values[index];
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname, //自己匹配到的完整路径
    pathnameBase, //匹配子路由的基路径
    pattern,
  };
}

// 把路径转化成正则表达式
function compilePath(path, end) {
  let paramNames = [];
  let regexpSource =
    "^" +
    path
      .replace(/^\/*/, "/") //把开始的任意多个星转成一个/     add /add   ///add   /add
      .replace(/\/*\*?$/, '') // 把结尾 的 /*替换 为空   /user*  /user/* /user//* /user//**
      .replace(/:(\w+)/g, (_, key) => {
        paramNames.push(key);
        return '([^\\/]+)';
      });
  if (path.endsWith("*")) {
    // /user/*
    paramNames.push("*"); //代表后面的内容可以是任意多个/也可以是/任意内容
    regexpSource += "(?:\\/(.+)|\\/*)$";
  } else {
    regexpSource += end ? "\\/*$" : "(?:\\b|\\/|$)";
  }
  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}

function useLocation() {
  return React.useContext(LocationContext).location;
}
function useParams() {
  let { matches } = React.useContext(RouteContext);
  //找到最后一个匹配
  let routeMatch = matches[matches.length - 1];
  //返回匹配结果中的路径参数对象params
  return routeMatch ? routeMatch.params : {};
}

function useNavigate() {
  let { navigator } = React.useContext(NavigationContext);
  let navigate = React.useCallback(
    (to) => {
      navigator.push(to);
    },
    [navigator]
  );
  return navigate;
}

function Navigate({ to }) {
  let navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  });
  return null;
}

export { Router, Routes, Route, useLocation, useNavigate, Navigate, useRoutes, useParams };
