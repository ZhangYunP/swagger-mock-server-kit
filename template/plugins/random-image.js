module.exports = body => {
  return body
    .mock("/users", "get", [{
      avatar: "@image"
    }])
    .mock("/users/{userId}", "get", {
      userImg: "@ximage"
    })
    .mock("/foo/bar", "get", {
      hello: "world"
    })
    .mock({
      path: '/foo/baz',
      method: 'get',
      data: {
        hello: 'world'
      }
    })
    .mock({
      path: '/logout',
      method: 'get',
      data: {
        result: '@boolean'
      }
    })
    .done()
};
