module.exports = body => {
  body
    .mock("/users", "get", [{
      avatar: "@image"
    }]);
};
