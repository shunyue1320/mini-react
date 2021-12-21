import { wrapToVdom, shallowEqual } from "./utils";
import {
  REACT_ELEMENT,
  REACT_FORWARD_REF_TYPE,
  REACT_FRAGMENT,
  REACT_MEMO,
  REACT_PROVIDER,
  REACT_CONTEXT,
} from "./constants";
import { Component, PureComponent } from "./component";
import {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "./react-dom";

function createElement(type, config, children) {
  let ref;
  let key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }
  let props = { ...config };
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    props.children = wrapToVdom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    ref,
    key,
    props,
  };
}

function createRef() {
  return { current: null };
}

function forwardRef(render) {
  var elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render,
  };
  return elementType;
}

function createContext() {
  const context = { $$typeof: REACT_CONTEXT };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

function memo(type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    compare: shallowEqual,
    type,
  };
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  Fragment: REACT_FRAGMENT,
  PureComponent,
  memo,

  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
};

export default React;
