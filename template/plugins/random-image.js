module.exports = body => {
  body
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

};
