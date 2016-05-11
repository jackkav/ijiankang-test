/**
  * @author Lyman Lai https://github.com/lymanlai/
  * @createdAt 2016-01-22 15:58
*/

// Base Schema for other Schema to extend
// useage:
// Schema.Xxx = new SimpleSchema([Schema.Base, {
//   additionField: { type: String }
// }])

Schema.Base = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    optional: true
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate || this.isUpsert) {
        return new Date();
      }
    },
    optional: true
  }
})
