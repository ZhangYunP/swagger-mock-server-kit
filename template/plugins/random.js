module.exports = body => {
  //   findResponseSchema(res) {
  //     for (var item in res) {
  //       if (item === "schema") return res[item];
  //       if (res[item] && typeof res[item] === "object")
  //         return this.findResponseSchema(res[item]);
  //     }
  //   }
  //   createExample(schema) {
  //     let example;
  //     switch (schema.type) {
  //       case "array":
  //         this.generateArrayItem(schema, example);
  //     }
  //     return example;
  //   }
  //   generateArrayItem(schema, example) {
  //     let max = schema["x-swagger-maxItems"] ? schema["x-swagger-maxItems"] : 5;
  //     let min = schema["x-swagger-minItems"] ? schema["x-swagger-minItems"] : 1;
  //     const count = Math.max(min, Math.floor(Math.random() * max));
  //     const { items } = schema;
  //     this.createExample(items);
  //   }
  //   generateObject(schema, example) {}
  //   generateString(schema, example) {}
  //   generagteNumber(schema, example) {}
};
