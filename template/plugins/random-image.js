module.exports = body => {
  body
    .mock("/users", "get", [{
      avatar: "@image",
      userImg: '@ximage'
    }])
  // .mock("/user/{userId}", "get", {
  //   userImg: '@ximage'
  // })
};
