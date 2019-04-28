module.exports = body => {
  body
    .name("demo")
    .find("/users")
    .method("get")
    .mock([
      {
        avatar: "@image"
      }
    ]);
};
