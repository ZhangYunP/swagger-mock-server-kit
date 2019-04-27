module.exports = body => {
  body
    .find("/users")
    .method("get")
    .mock([
      {
        avatar: "@image"
      }
    ]);
};
