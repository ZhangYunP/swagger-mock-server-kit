module.exports = body => {
  return body
    .mock("/api/v1/users", "get", [{
      avatar: "@image"
    }])
    .mock("/api/v1/users/{userId}", "get", {
      userImg: "@ximage"
    })
    .mock("/api/v1/foo/bar", "get", {
      hello: "world"
    })
    .mock({
      path: '/api/v1/foo/baz',
      method: 'get',
      data: {
        hello: 'world'
      }
    })
    .done()
};
