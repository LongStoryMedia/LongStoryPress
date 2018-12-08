import React from "react";
import Loadable from "react-loadable";
import { invokeApi } from "./utils/api";

const loading = () => "LOADING...";

const Page = Loadable({
  loader: () => import(/*webpackChunkName: "Page"*/ "./Sections/PageContent"),
  loading: loading,
  modules: ["Page"]
});
const PostList = Loadable({
  loader: () => import(/*webpackChunkName: "PostList"*/ "./Sections/PostList"),
  loading: loading,
  modules: ["PostList"],
  render(loaded, props) {
    const { params } = props.match;
    let C = loaded.default[params[Object.keys(params)[0]]];
    return <C {...props} />;
  }
});

export default [
  {
    path: "/",
    exact: true,
    component: Page,
    fetchInitialData: async () => await invokeApi({ path: `pages/home` })
  },
  {
    path: "/(blog|articles)",
    exact: true,
    component: PostList,
    isJournal: true,
    fetchInitialData: async () => await invokeApi({ path: "posts" })
  },
  {
    path: "/(blog|articles)/:slug",
    exact: true,
    component: Page,
    isJournal: true,
    fetchInitialData: async (slug = "") =>
      await invokeApi({ path: `posts/${slug}` })
  },
  {
    path: "/tutorials",
    exact: true,
    component: PostList,
    isJournal: true,
    fetchInitialData: async () => await invokeApi({ path: "tutorials" })
  },
  {
    path: "/tutorials/:slug",
    exact: true,
    component: Page,
    isJournal: true,
    fetchInitialData: async (slug = "") =>
      await invokeApi({ path: `tutorials/${slug}` })
  },
  {
    path: "/:slug",
    component: Page,
    fetchInitialData: async (slug = "") =>
      await invokeApi({ path: `pages/${slug}` })
  },
  {
    path: "/:slug/:child",
    component: Page,
    fetchInitialData: async (slug = "") =>
      await invokeApi({ path: `pages/${slug}` })
  }
];
