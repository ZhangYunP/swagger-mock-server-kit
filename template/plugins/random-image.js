module.exports = body => {
  body
    .mock("/users", "get", [{
      avatar: "@image"
    }])
    .mock("/user/{userId}", "get", {
      userImg: '/api/v1/dumpimg1.jpg'
    })
};
