//better solution
import mongoose from "mongoose";

interface UserAttrs {
  email: string;
  password: string;
}

type UserDoc = mongoose.Document & UserAttrs;

const userSchema = new mongoose.Schema<UserDoc>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserModel = mongoose.model<UserDoc>("User", userSchema);

export class User extends UserModel {
  constructor(attrs: UserAttrs) {
    super(attrs);
  }
}

//old solution
/* 
import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
 */